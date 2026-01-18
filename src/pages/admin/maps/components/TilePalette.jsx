import React from "react"

export default function TilePalette({ selectedTilesets, loadedTilesets, copiedTileId, setCopiedTileId, getTilesetRange }) {
  if (Object.keys(loadedTilesets).length === 0) return null

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
        marginBottom: "15px", 
        marginTop: "0", 
        color: "#495057", 
        fontSize: "16px", 
        fontWeight: "600" 
      }}>
        🎨 Tile Palette
      </h4>
      {selectedTilesets.map(tileset => {
        const tilesetData = loadedTilesets[tileset.id]
        if (!tilesetData) return null
        
        const { min, max } = getTilesetRange(tileset.id)
        
        return (
          <div key={tileset.id} style={{ marginBottom: "20px" }}>
            <h5 style={{ 
              margin: "0 0 12px 0", 
              fontSize: "14px", 
              color: "#495057",
              fontWeight: "500"
            }}>
              {tileset.name} <span style={{ color: "#6c757d", fontSize: "12px" }}>(IDs: {min}-{max})</span>
            </h5>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", 
              gap: "8px",
              border: "1px solid #dee2e6",
              padding: "15px",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              {tilesetData.textures.map((texture, index) => {
                const { min } = getTilesetRange(tileset.id)
                const tileId = min + index
                const isCopied = copiedTileId === tileId
                return (
                  <div
                    key={tileId}
                    onClick={() => {
                      setCopiedTileId(tileId)
                      const el = document.createElement('div')
                      el.textContent = `✅ Copied tile ${tileId}!`
                      el.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #28a745;
                        color: white;
                        padding: 10px 16px;
                        border-radius: 6px;
                        z-index: 1000;
                        font-size: 14px;
                        font-weight: 500;
                        box-shadow: 0 4px 8px rgba(40,167,69,0.3);
                      `
                      document.body.appendChild(el)
                      setTimeout(() => document.body.removeChild(el), 2000)
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "6px",
                      border: isCopied ? "2px solid #28a745" : "1px solid #dee2e6",
                      backgroundColor: isCopied ? "#d4edda" : "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: isCopied ? "0 2px 8px rgba(40,167,69,0.3)" : "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isCopied ? "#c3e6cb" : "#e3f2fd"
                      e.currentTarget.style.borderColor = isCopied ? "#28a745" : "#2196f3"
                      e.currentTarget.style.transform = "scale(1.05)"
                      e.currentTarget.style.boxShadow = isCopied ? "0 4px 12px rgba(40,167,69,0.4)" : "0 4px 8px rgba(33,150,243,0.3)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isCopied ? "#d4edda" : "#ffffff"
                      e.currentTarget.style.borderColor = isCopied ? "#28a745" : "#dee2e6"
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = isCopied ? "0 2px 8px rgba(40,167,69,0.3)" : "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div style={{ 
                      width: "32px", 
                      height: "32px", 
                      marginBottom: "4px",
                      backgroundImage: `url(${tilesetData.imageUrl})`,
                      backgroundSize: `${tilesetData.tileW * tilesetData.cols}px ${tilesetData.tileH * tilesetData.rows}px`,
                      backgroundPosition: `-${(index % tilesetData.cols) * tilesetData.tileW}px -${Math.floor(index / tilesetData.cols) * tilesetData.tileH}px`,
                      imageRendering: "pixelated",
                      borderRadius: "2px"
                    }} />
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#495057" }}>
                      {tileId}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
