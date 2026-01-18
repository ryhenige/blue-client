import { useState, useCallback } from "react"
import { Application } from "@pixi/react"
import ChunkRenderer from "helpers/renderers/ChunkRenderer"
import Structure from "pages/components/structure"

export default function MapViewer({ zoneId, chunkId }) {
  const [texturesReady, setTexturesReady] = useState(false)

  const handleTexturesReady = useCallback(() => {
    setTexturesReady(true)
  }, [])

  return (
    <Structure variant="card">
      <h3><b>Zone:</b> {zoneId} <b>Chunk:</b> {chunkId}</h3>
      {!texturesReady && (
        <p>Loading tileset textures...</p>
      )}
      <Application
        width={800}
        height={600}
        backgroundAlpha={0}
        options={{
          antialias: false,
          autoDensity: true,
          roundPixels: true,
        }}
      >
        <ChunkRenderer
          zoneId={zoneId}
          chunkId={chunkId}
          position={{ x: 0, y: 0 }}
          onTexturesReady={handleTexturesReady}
        />
      </Application>
    </Structure>
  )
}