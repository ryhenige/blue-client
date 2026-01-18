import React, { useState } from "react"
import { MAP_WIDTH, MAP_HEIGHT } from "constants/maps/maps"

export default function VisualGridEditor({ 
  lastValidMapData, 
  gridWidth, 
  gridHeight, 
  copiedTileId,
  handleCellChange,
  handleGridSizeChange,
  getTileForId,
  getTilesetRange,
  loadedTilesets
}) {
  const [hoveredCell, setHoveredCell] = useState(null)

  if (!lastValidMapData) return null

  const getTileInfo = (tileId) => {
    if (tileId === 0) return null
    
    for (const [tilesetKey, tilesetData] of Object.entries(loadedTilesets)) {
      const { min, max } = getTilesetRange(tilesetKey)
      if (tileId >= min && tileId <= max) {
        const localIndex = tileId - min
        return {
          tilesetId: tilesetKey,
          tilesetName: tilesetData.name || tilesetKey,
          localIndex: localIndex,
          globalId: tileId
        }
      }
    }
    return null
  }

  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef"
      }}>
        <div>
          <h4 style={{ margin: "0 0 8px 0", color: "#495057", fontSize: "16px", fontWeight: "600" }}>
            Visual Grid Editor
          </h4>
          <div style={{ fontSize: "13px", color: "#6c757d", minHeight: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Click tiles to copy IDs, then click cells to paste.</span>
            {copiedTileId !== null && (
              <span style={{ color: "#28a745", fontWeight: "600" }}>
                📋 Ready to paste: {copiedTileId}
              </span>
            )}
            {hoveredCell && (
              <span style={{ color: "#007bff", fontWeight: "600" }}>
                📍 {hoveredCell.tileInfo ? 
                  `${hoveredCell.tileInfo.tilesetName} - ID: ${hoveredCell.tileInfo.globalId} (Index: ${hoveredCell.tileInfo.localIndex})` : 
                  `Empty tile - Position: ${hoveredCell.col}, ${hoveredCell.row}`
                }
              </span>
            )}
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          padding: "8px 12px",
          backgroundColor: "#e9ecef",
          borderRadius: "6px",
          border: "1px solid #ced4da"
        }}>
          <div style={{ fontSize: "13px", color: "#495057", fontWeight: "500" }}>
            📐 Standard Chunk Size: {MAP_WIDTH}×{MAP_HEIGHT} tiles
          </div>
          <div style={{ fontSize: "12px", color: "#6c757d" }}>
            ({MAP_WIDTH * 64}×{MAP_HEIGHT * 64}px)
          </div>
        </div>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${lastValidMapData.w}, 64px)`,
        gap: "2px",
        backgroundColor: "#dee2e6",
        padding: "2px",
        borderRadius: "8px",
        width: "fit-content",
        maxWidth: "100%",
        maxHeight: "70vh",
        overflow: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        {lastValidMapData.map.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const tileInfo = getTileForId(cell)
            const tileDetails = getTileInfo(cell)
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => {
                  if (copiedTileId !== null) {
                    handleCellChange(rowIndex, colIndex, copiedTileId)
                  } else {
                    const tileId = prompt(`Enter tile ID (current: ${cell}):`, cell)
                    if (tileId !== null) {
                      handleCellChange(rowIndex, colIndex, tileId)
                    }
                  }
                }}
                style={{
                  width: "64px",
                  height: "64px",
                  position: "relative",
                  backgroundColor: "#ffffff",
                  cursor: copiedTileId !== null ? "copy" : "pointer",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e3f2fd"
                  e.currentTarget.style.transform = "scale(1.05)"
                  e.currentTarget.style.borderColor = "#2196f3"
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(33,150,243,0.3)"
                  setHoveredCell({
                    row: rowIndex,
                    col: colIndex,
                    tileInfo: tileDetails
                  })
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff"
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.borderColor = "#ced4da"
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
                  setHoveredCell(null)
                }}
              >
                {tileInfo && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "64px",
                    height: "64px",
                    backgroundImage: `url(${tileInfo.tilesetData.imageUrl})`,
                    backgroundSize: `${tileInfo.tilesetData.tileW * tileInfo.tilesetData.cols}px ${tileInfo.tilesetData.tileH * tileInfo.tilesetData.rows}px`,
                    backgroundPosition: `-${tileInfo.localIndex % tileInfo.tilesetData.cols * tileInfo.tilesetData.tileW}px -${Math.floor(tileInfo.localIndex / tileInfo.tilesetData.cols) * tileInfo.tilesetData.tileH}px`,
                    imageRendering: "pixelated",
                    pointerEvents: "none"
                  }} />
                )}
              </div>
            )
          })
        )}
      </div>
      <br />
    </div>
  )
}
