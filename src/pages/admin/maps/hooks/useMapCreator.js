import { useState, useCallback, useEffect } from "react"
import { loadTilesetWithCache } from "helpers/cache/tilesetCache"
import { MAP_WIDTH, MAP_HEIGHT } from "constants/maps/maps"

export function useMapCreator() {
  const [mapJson, setMapJson] = useState("")
  const [mapData, setMapData] = useState(null)
  const [error, setError] = useState("")
  const [selectedTilesets, setSelectedTilesets] = useState([])
  const [lastValidMapData, setLastValidMapData] = useState(null)
  const [loadedTilesets, setLoadedTilesets] = useState({})
  const [copiedTileId, setCopiedTileId] = useState(null)

  // Use standardized chunk dimensions
  const gridWidth = MAP_WIDTH
  const gridHeight = MAP_HEIGHT

  // Available tilesets - you can expand this list
  const availableTilesets = [
    { id: "tiletest", name: "Tile Test", url: "/sprites/maps/spriteSheets/tiletest.json"},
    { id: "tiletestTwo", name: "Tile Test Two", url: "/sprites/maps/spriteSheets/tiletestTwo.json"},
  ]

  // Calculate min/max for tilesets based on loaded data
  const getTilesetRange = (tilesetId) => {
    const tilesetData = loadedTilesets[tilesetId]
    if (!tilesetData) return { min: 0, max: 0 }
    
    // Find the tileset in availableTilesets to determine the starting ID
    const tilesetIndex = availableTilesets.findIndex(ts => ts.id === tilesetId)
    let minId = 0
    
    // Calculate min ID based on position in array (0, 100, 200, etc.)
    for (let i = 0; i < tilesetIndex; i++) {
      const prevTilesetData = loadedTilesets[availableTilesets[i].id]
      if (prevTilesetData) {
        minId += prevTilesetData.textures.length
      }
    }
    
    const maxId = minId + tilesetData.textures.length - 1
    return { min: minId, max: maxId }
  }

  // Initialize with default map
  useEffect(() => {
    const createDefaultMap = (w, h) => {
      return Array(h).fill(null).map(() => Array(w).fill(0))
    }
    
    const defaultMap = createDefaultMap(gridWidth, gridHeight)
    
    const initialMapData = { w: gridWidth, h: gridHeight, map: defaultMap }
    
    // Format each row as a separate line, but no comma on the last row
    const formattedJson = defaultMap.map((row, index) => {
      const rowStr = `  ${JSON.stringify(row)}`
      return index < defaultMap.length - 1 ? `${rowStr},` : rowStr
    }).join('\n')
    setMapJson(`[\n${formattedJson}\n]`)
    setMapData(initialMapData)
    setLastValidMapData(initialMapData)
  }, [])

  const handleJsonChange = (value) => {
    setMapJson(value)
    
    try {
      const parsed = JSON.parse(value)
      
      // Basic validation - must be 2D array
      if (!Array.isArray(parsed)) {
        throw new Error("Map must be a 2D array")
      }
      
      for (let row of parsed) {
        if (!Array.isArray(row)) {
          throw new Error("Map must be a 2D array")
        }
      }
      
      // Create full map data object
      const h = parsed.length
      const w = parsed[0]?.length || 0
      
      const fullMapData = {
        w: w,
        h: h,
        tilesets: selectedTilesets.map(ts => {
          const { min, max } = getTilesetRange(ts.id)
          return {
            min: min,
            max: max,
            url: ts.url
          }
        }),
        map: parsed
      }
      
      setMapData(fullMapData)
      setLastValidMapData(fullMapData)
      setError("") // Clear any previous errors
    } catch (err) {
      // Don't clear the map while typing - keep showing last valid map
      console.error("JSON Parse Error:", err.message, "Value:", value)
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  const handleTilesetToggle = (tileset) => {
    const isSelected = selectedTilesets.some(ts => ts.id === tileset.id)
    
    if (isSelected) {
      setSelectedTilesets(selectedTilesets.filter(ts => ts.id !== tileset.id))
    } else {
      setSelectedTilesets([...selectedTilesets, tileset])
    }
  }

  // Update map JSON when tilesets change
  useEffect(() => {
    if (lastValidMapData && lastValidMapData.map) {
      // Update the last valid map with new tilesets
      const fullMapData = {
        w: lastValidMapData.w,
        h: lastValidMapData.h,
        tilesets: selectedTilesets.map(ts => {
          const { min, max } = getTilesetRange(ts.id)
          return {
            min: min,
            max: max,
            url: ts.url
          }
        }),
        map: lastValidMapData.map
      }
      setMapData(fullMapData)
      setLastValidMapData(fullMapData)
    }
  }, [selectedTilesets])

  // Load tilesets when selection changes
  useEffect(() => {
    const loadTilesets = async () => {
      const loaded = {}
      
      for (const tileset of selectedTilesets) {
        if (!loadedTilesets[tileset.id]) {
          try {
            const data = await loadTilesetWithCache(tileset.url)
            loaded[tileset.id] = data
          } catch (error) {
            console.error(`Failed to load tileset ${tileset.id}:`, error)
          }
        } else {
          loaded[tileset.id] = loadedTilesets[tileset.id]
        }
      }
      
      setLoadedTilesets(loaded)
    }

    loadTilesets()
  }, [selectedTilesets])

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newMap = [...lastValidMapData.map]
    newMap[rowIndex][colIndex] = value === '' ? 0 : parseInt(value) || 0
    
    const fullMapData = {
      w: lastValidMapData.w,
      h: lastValidMapData.h,
      tilesets: selectedTilesets.map(ts => {
        const { min, max } = getTilesetRange(ts.id)
        return {
          min: min,
          max: max,
          url: ts.url
        }
      }),
      map: newMap
    }
    
    setMapData(fullMapData)
    setLastValidMapData(fullMapData)
    
    // Update the JSON display (for reference)
    const formattedJson = newMap.map((row, index) => {
      const rowStr = `  ${JSON.stringify(row)}`
      return index < newMap.length - 1 ? `${rowStr},` : rowStr
    }).join('\n')
    setMapJson(`[\n${formattedJson}\n]`)
  }

  const handleGridSizeChange = () => {
    // Grid size is now standardized - no resizing allowed
    console.log("Grid size is standardized to 20x15 tiles")
  }

  const getTileForId = (tileId) => {
    for (const [tilesetKey, tilesetData] of Object.entries(loadedTilesets)) {
      const { min, max } = getTilesetRange(tilesetKey)
      if (tileId >= min && tileId <= max) {
        const localIndex = tileId - min
        return {
          texture: tilesetData.textures[localIndex],
          tilesetData: tilesetData,
          localIndex: localIndex
        }
      }
    }
    return null
  }

  const handleExport = () => {
    if (!lastValidMapData) {
      alert('No map data to export!')
      return
    }

    // Create the export data structure
    const exportData = {
      w: lastValidMapData.w,
      h: lastValidMapData.h,
      tilesets: selectedTilesets.map(ts => {
        const { min, max } = getTilesetRange(ts.id)
        return {
          min: min,
          max: max,
          url: ts.url
        }
      }),
      map: lastValidMapData.map
    }

    // Convert to JSON string with proper formatting like one.json
    const tilesetsFormatted = exportData.tilesets.map(ts => `    ${JSON.stringify(ts)}`).join(',\n')
    const mapFormatted = exportData.map.map(row => `    [${row.join(', ')}]`).join(',\n')
    const jsonString = `{\n  "w": ${exportData.w},\n  "h": ${exportData.h},\n  "tilesets": [\n${tilesetsFormatted}\n  ],\n  "map": [\n${mapFormatted}\n  ]\n}`
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `map_${lastValidMapData.w}x${lastValidMapData.h}_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleLoadTemplate = (templateData) => {
    if (!templateData) {
      // Load empty template
      const createDefaultMap = (w, h) => {
        return Array(h).fill(null).map(() => Array(w).fill(0))
      }
      
      const defaultMap = createDefaultMap(gridWidth, gridHeight)
      const initialMapData = { w: gridWidth, h: gridHeight, map: defaultMap }
      
      // Format each row as a separate line, but no comma on the last row
      const formattedJson = defaultMap.map((row, index) => {
        const rowStr = `  ${JSON.stringify(row)}`
        return index < defaultMap.length - 1 ? `${rowStr},` : rowStr
      }).join('\n')
      setMapJson(`[\n${formattedJson}\n]`)
      setMapData(initialMapData)
      setLastValidMapData(initialMapData)
    } else {
      // Load template data
      const { w, h, map, tilesets: templateTilesets } = templateData
      
      // Validate that template matches standard dimensions
      if (w !== MAP_WIDTH || h !== MAP_HEIGHT) {
        alert(`Template dimensions (${w}×${h}) don't match standard chunk size (${MAP_WIDTH}×${MAP_HEIGHT})`)
        return
      }
      
      // Find and select the tilesets used in this template
      const templateUrls = templateTilesets.map(ts => ts.url)
      const matchingTilesets = availableTilesets.filter(ts => 
        templateUrls.includes(ts.url)
      )
      setSelectedTilesets(matchingTilesets)
      
      // Update map data
      const fullMapData = {
        w: w,
        h: h,
        tilesets: matchingTilesets.map(ts => {
          const { min, max } = getTilesetRange(ts.id)
          return {
            min: min,
            max: max,
            url: ts.url
          }
        }),
        map: map
      }
      
      // Format each row as a separate line, but no comma on the last row
      const formattedJson = map.map((row, index) => {
        const rowStr = `  ${JSON.stringify(row)}`
        return index < map.length - 1 ? `${rowStr},` : rowStr
      }).join('\n')
      setMapJson(`[\n${formattedJson}\n]`)
      setMapData(fullMapData)
      setLastValidMapData(fullMapData)
    }
  }

  return {
    // State
    mapJson,
    mapData,
    error,
    selectedTilesets,
    lastValidMapData,
    loadedTilesets,
    gridWidth,
    gridHeight,
    copiedTileId,
    availableTilesets,
    
    // Actions
    setMapJson,
    setError,
    setSelectedTilesets,
    setCopiedTileId,
    
    // Handlers
    handleJsonChange,
    handleTilesetToggle,
    handleCellChange,
    handleGridSizeChange,
    handleExport,
    handleLoadTemplate,
    
    // Utilities
    getTilesetRange,
    getTileForId
  }
}
