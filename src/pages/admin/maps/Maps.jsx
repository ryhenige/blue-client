import React, { useState, useEffect } from 'react'
import SideSelector from "pages/admin/components/SideSelector"
import MapSelector from "./components/MapSelector"
import MapViewer from "./components/MapViewer"
import zonesConfig from "constants/registry/zones.json"

export default function Maps() {
  const [zoneRegistry, setZoneRegistry] = useState({})
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedChunk, setSelectedChunk] = useState(null)

  useEffect(() => {
    const buildZoneRegistry = async () => {
      try {
        const registry = {}
        
        Object.keys(zonesConfig.zones).forEach(zoneId => {
          const zoneData = zonesConfig.zones[zoneId]
          const chunks = {}
          
          zoneData.forEach(map => {
            Object.keys(map.chunks).forEach(chunkKey => {
              chunks[chunkKey] = {
                name: `Chunk ${chunkKey}`,
                zoneId: zoneId,
                chunkKey: chunkKey,
                url: map.chunks[chunkKey].url
              }
            })
          })
          
          registry[zoneId] = {
            name: zoneId,
            components: chunks
          }
        })
        
        setZoneRegistry(registry)
      } catch (err) {
        console.error('Failed to load zone registry:', err)
      }
    }

    buildZoneRegistry()
  }, [])

  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId)
    setSelectedChunk(null) // Reset chunk when zone changes
  }

  const handleChunkSelect = (chunkKey) => {
    setSelectedChunk(chunkKey)
  }
  
  return (
    <SideSelector
      title="Zones"
      descriptiveTitle="zone"
      registry={zoneRegistry}
      onSelect={handleZoneSelect}
    >
      {selectedZone && (
        <div>
          <h3>Selected Zone: {selectedZone}</h3>
          <MapSelector 
            chunkNames={Object.keys(zoneRegistry[selectedZone]?.components || {})} 
            selectedChunk={selectedChunk}
            onSelect={handleChunkSelect}
          />

          {selectedChunk && (
            <MapViewer
              zoneId={selectedZone}
              chunkId={selectedChunk}
            />
          )}
        </div>
      )}
    </SideSelector>
  )
}