import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { CompositeTilemap } from "@pixi/tilemap"
import { loadTilesetWithCache } from "helpers/cache/tilesetCache"

/**
 * ChunkRenderer - Renders a single chunk using multiple tilesets
 */
export default function ChunkRenderer({ zoneId, chunkId, position = { x: 0, y: 0 }, onTexturesReady }) {
  const { app } = useApplication()
  const tilemapRef = useRef(null)
  const loadedTilesetsRef = useRef({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [chunkData, setChunkData] = useState(null)
  const [tilesets, setTilesets] = useState({})

  // Helper function to find tileset and local tile ID for a given tile ID
  const getTilesetInfo = (tileId) => {
    for (const [tilesetKey, tilesetData] of Object.entries(tilesets)) {
      const { min, max } = tilesetData.range
      if (tileId >= min && tileId <= max) {
        return {
          tileset: loadedTilesetsRef.current[tilesetKey],
          localTileId: tileId - min
        }
      }
    }
    return null
  }

  // Helper function to get chunk URL
  const getChunkUrl = async (zoneId, chunkId) => {
    const zonesConfig = await import("constants/registry/zones.json")
    return zonesConfig.default.zones[zoneId][0].chunks[chunkId].url
  }

  // Load chunk data when zoneId/chunkId changes
  useEffect(() => {
    if (!zoneId || !chunkId) return

    const loadChunkData = async () => {
      try {
        const chunkUrl = await getChunkUrl(zoneId, chunkId)
        
        // Load the chunk
        const response = await fetch(chunkUrl)
        if (!response.ok) {
          throw new Error(`Failed to load chunk ${chunkId}: ${response.status}`)
        }
        const chunkDataResponse = await response.json()
        setChunkData(chunkDataResponse)

        // Load all tilesets needed for this chunk
        if (chunkDataResponse.tilesets) {
          const loadedTilesets = {}
          chunkDataResponse.tilesets.forEach((tilesetConfig, index) => {
            const tilesetKey = `tileset_${index}`
            loadedTilesets[tilesetKey] = {
              ...tilesetConfig,
              range: { min: tilesetConfig.min, max: tilesetConfig.max }
            }
          })
          setTilesets(loadedTilesets)
        }
      } catch (err) {
        console.error('Failed to load chunk:', err)
      }
    }

    loadChunkData()
  }, [zoneId, chunkId])

  // Load tilesets when tilesets data is available
  useEffect(() => {
    if (!app || !chunkData || Object.keys(tilesets).length === 0) return

    const controller = new AbortController()
    const signal = controller.signal

    // Load all tilesets needed for this chunk
    const loadTilesetsIfNeeded = async () => {
      const loaded = {}
      
      for (const [tilesetName, tilesetData] of Object.entries(tilesets)) {
        if (signal.aborted) return
        
        if (!loadedTilesetsRef.current[tilesetName]) {
          try {
            const tileset = await loadTilesetWithCache(tilesetData.url)
            
            if (signal.aborted) return
            
            loaded[tilesetName] = tileset
          } catch (error) {
            console.error(`Failed to load tileset ${tilesetName}:`, error)
          }
        } else {
          loaded[tilesetName] = loadedTilesetsRef.current[tilesetName]
        }
      }
      
      if (signal.aborted) return
      
      loadedTilesetsRef.current = { ...loadedTilesetsRef.current, ...loaded }
      const allLoaded = Object.keys(loaded).length === Object.keys(tilesets).length
      setIsLoaded(allLoaded)
      if (allLoaded && onTexturesReady) {
        onTexturesReady()
      }
    }

    loadTilesetsIfNeeded()

    return () => {
      controller.abort()
    }
  }, [app, chunkData, tilesets, onTexturesReady])

  useEffect(() => {
    if (!isLoaded) return // Don't render until tilesets are loaded
    if (!app || !chunkData || Object.keys(loadedTilesetsRef.current).length === 0) return

    // Create the tilemap
    const tilemap = new CompositeTilemap()
    tilemapRef.current = tilemap
    app.stage.addChild(tilemap)

    // Position the chunk
    tilemap.position.set(position.x, position.y)

    // Render the chunk
    const { map } = chunkData

    if (map) {
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          const tileId = map[y][x]
          if (tileId == null || tileId < 0) continue

          const tilesetInfo = getTilesetInfo(tileId)
          if (!tilesetInfo) continue

          const texture = tilesetInfo.tileset.textures[tilesetInfo.localTileId]
          if (!texture) continue

          tilemap.tile(texture, x * tilesetInfo.tileset.tileW, y * tilesetInfo.tileset.tileH)
        }
      }
    }

    // Cleanup
    return () => {
      if (tilemapRef.current && app?.stage) {
        app.stage.removeChild(tilemapRef.current)
        tilemapRef.current.destroy()
        tilemapRef.current = null
      }
    }
  }, [app, chunkData, tilesets, position])

  return null
}
