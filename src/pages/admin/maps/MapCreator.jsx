import { useNavigate } from "react-router-dom"
import Button from "pages/components/buttons"
import TilePalette from "./components/TilePalette"
import VisualGridEditor from "./components/VisualGridEditor"
import MapTemplateSelector from "./components/MapTemplateSelector"
import { useMapCreator } from "./hooks/useMapCreator"

export default function MapCreator() {
  const navigate = useNavigate()
  const {
    mapJson,
    error,
    selectedTilesets,
    lastValidMapData,
    loadedTilesets,
    gridWidth,
    gridHeight,
    copiedTileId,
    availableTilesets,
    setSelectedTilesets,
    setGridWidth,
    setGridHeight,
    setCopiedTileId,
    handleTilesetToggle,
    handleCellChange,
    handleGridSizeChange,
    handleExport,
    handleLoadTemplate,
    getTilesetRange,
    getTileForId
  } = useMapCreator()

  return (
    <>
      <div style={{ position: "relative", margin: "10px" }}>
        <div style={{ position: "absolute", top: "0", right: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              theme="secondary"
              onClick={handleExport}>
              📥 Export Map
            </Button>
          </div>
        </div>

        <MapTemplateSelector 
          onLoadTemplate={handleLoadTemplate}
          selectedTilesets={selectedTilesets}
        />

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
            🎨 Select Tilesets
          </h4>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {availableTilesets.map(tileset => (
              <label key={tileset.id} style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: selectedTilesets.some(ts => ts.id === tileset.id) ? "#e3f2fd" : "#ffffff",
                border: "1px solid #dee2e6",
                transition: "all 0.2s ease"
              }}>
                <input
                  type="checkbox"
                  checked={selectedTilesets.some(ts => ts.id === tileset.id)}
                  onChange={() => handleTilesetToggle(tileset)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "#495057" }}>
                  {tileset.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <TilePalette
          selectedTilesets={selectedTilesets}
          loadedTilesets={loadedTilesets}
          copiedTileId={copiedTileId}
          setCopiedTileId={setCopiedTileId}
          getTilesetRange={getTilesetRange}
        />

        <VisualGridEditor
          lastValidMapData={lastValidMapData}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          setGridWidth={setGridWidth}
          setGridHeight={setGridHeight}
          copiedTileId={copiedTileId}
          handleCellChange={handleCellChange}
          handleGridSizeChange={handleGridSizeChange}
          getTileForId={getTileForId}
          getTilesetRange={getTilesetRange}
          loadedTilesets={loadedTilesets}
        />
      </div>
    </>
  )
}
