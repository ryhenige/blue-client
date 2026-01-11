import { useMemo } from 'react'
import { Stars } from '@react-three/drei'

import Character from './users/Character'
import CharacterShell from './users/CharacterShell'

export default function World({ snapshot = [], currentPlayer, onPlayerPositionChange }) {

  const characters = useMemo(() => snapshot?.characters || [], [snapshot])
  
  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
      {characters?.map((character) => {
        if(character.id === currentPlayer?.id){
          return (
            <Character 
              key={character.id} 
              character={character}
              onPositionChange={onPlayerPositionChange} />
          )
        } else {
          return (
            <CharacterShell 
              key={character.id} 
              character={character} />
          )
        }
      })}
    </>
  )
}