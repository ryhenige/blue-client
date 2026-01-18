import React, { useState, useEffect } from "react"
import zonesConfig from "constants/registry/zones.json"

export default function MapTemplateSelector({ onLoadTemplate, selectedTilesets }) {
  const [availableMaps, setAvailableMaps] = useState([])
  const [selectedMap, setSelectedMap] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAvailableMaps = async () => {
      try {
        const maps = [{ id: "empty", name: "Empty Template", path: null }]
        
        Object.values(zonesConfig.zones).forEach(zone => {
          zone.forEach(zoneData => {
            if (zoneData.chunks) {
              Object.entries(zoneData.chunks).forEach(([chunkKey, chunkData]) => {
                maps.push({
                  id: `${zoneData.id}_${chunkKey}`,
                  name: `${zoneData.id} - Chunk ${chunkKey}`,
                  path: chunkData.url
                })
              })
            }
          })
        })
        
        setAvailableMaps(maps)
      } catch (error) {
        console.error("Failed to load available maps:", error)
      }
    }

    loadAvailableMaps()
  }, [])

  const handleLoadTemplate = async () => {
    if (!selectedMap) return

    setLoading(true)
    try {
      if (selectedMap === "empty") {
        onLoadTemplate(null)
      } else {
        const mapData = availableMaps.find(m => m.id === selectedMap)
        if (mapData && mapData.path) {
          const response = await fetch(mapData.path)
          const mapJson = await response.json()
          onLoadTemplate(mapJson)
        }
      }
    } catch (error) {
      console.error("Failed to load template:", error)
      alert("Failed to load map template")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      marginBottom: "20px", 
      padding: "20px", 
      border: "1px solid #e9ecef", 
      borderRadius: "8px", 
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <h4 style={{ 
        margin: "0 0 15px 0", 
        color: "#495057", 
        fontSize: "16px", 
        fontWeight: "600" 
      }}>
        📂 Load Map Template
      </h4>
      <div style={{ 
        display: "flex", 
        gap: "12px", 
        alignItems: "center", 
        flexWrap: "wrap",
        marginBottom: "12px"
      }}>
        <select
          value={selectedMap}
          onChange={(e) => setSelectedMap(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ced4da",
            borderRadius: "6px",
            fontSize: "14px",
            minWidth: "250px",
            backgroundColor: "#ffffff",
            cursor: "pointer"
          }}
        >
          <option value="">Choose a template...</option>
          {availableMaps.map(map => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleLoadTemplate}
          disabled={!selectedMap || loading}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedMap && !loading ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: selectedMap && !loading ? "pointer" : "not-allowed",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            if (selectedMap && !loading) {
              e.currentTarget.style.backgroundColor = "#218838"
            }
          }}
          onMouseOut={(e) => {
            if (selectedMap && !loading) {
              e.currentTarget.style.backgroundColor = "#28a745"
            }
          }}
        >
          {loading ? "⏳ Loading..." : "📥 Load Template"}
        </button>
      </div>
    </div>
  )
}
