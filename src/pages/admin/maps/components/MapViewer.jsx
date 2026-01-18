import { useState, useCallback, useRef } from "react"
import ChunkRenderer from "helpers/renderers/ChunkRenderer"
import Structure from "pages/components/structure"
import { Application, useExtend } from "@pixi/react"
import { Container } from 'pixi.js'


export default function MapViewer({ zoneId, chunkId }) {
  useExtend({ Container })
  const [texturesReady, setTexturesReady] = useState(false)
  const containerRef = useRef(null)

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
        <pixiContainer ref={containerRef} scale={0.5}>
          <ChunkRenderer
            zoneId={zoneId}
            chunkId={chunkId}
            position={{ x: 0, y: 0 }}
            onTexturesReady={handleTexturesReady}
            container={containerRef.current}
            viewerMode
          />
        </pixiContainer>
      </Application>
    </Structure>
  )
}