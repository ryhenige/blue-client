import { useMemo, useRef } from 'react'

import CharacterSprite from './users/CharacterSprite'
import CharacterShellSprite from './users/CharacterShellSprite'

import ChunkRenderer from 'helpers/renderers/ChunkRenderer'
import { useExtend } from "@pixi/react"
import { Container } from 'pixi.js'

export default function World({ snapshot = [], currentCharacterId, onPlayerPositionChange }) {

  useExtend({ Container })

  const characters = useMemo(() => snapshot?.characters || [], [snapshot])
  const chunkContainerRef = useRef(null)
  
  return (
    <>
      {/* Chunk container - renders all chunks first */}
      <pixiContainer ref={chunkContainerRef}>
        <ChunkRenderer 
          zoneId="overworld" 
          chunkId="0,0" 
          container={chunkContainerRef.current}
        />
        <ChunkRenderer 
          zoneId="overworld" 
          chunkId="1,0" 
          container={chunkContainerRef.current}
        />
      </pixiContainer>

      {/* Characters render last - on top of chunks */}
      {characters?.map((character) => {
        if(character.id === currentCharacterId){
          return (
            <CharacterSprite
              key={character.id} 
              currentPlayer={character}
              onPositionChange={onPlayerPositionChange}
            />
          )
        } else {
          return (
            <CharacterShellSprite 
              key={character.id} 
              character={character} />
          )
        }
      })}
    </>
  )
}