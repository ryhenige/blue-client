import { useMemo } from 'react'

import CharacterSprite from './users/CharacterSprite'
import CharacterShellSprite from './users/CharacterShellSprite'

export default function World({ snapshot = [], currentCharacterId, onPlayerPositionChange }) {

  const characters = useMemo(() => snapshot?.characters || [], [snapshot])
  
  return (
    <>
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