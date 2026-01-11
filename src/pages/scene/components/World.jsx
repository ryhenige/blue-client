import { useMemo } from 'react'
import { Stars } from '@react-three/drei'

import Player from './users/Player'
import PlayerShell from './users/PlayerShell'

export default function World({ snapshot = [], currentPlayer, onPlayerPositionChange }) {

  const players = useMemo(() => snapshot?.players || [], [snapshot])
  
  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
      {players?.map((player) => {
        if(player.id === currentPlayer?.id){
          return (
            <Player 
              key={player.id} 
              player={player}
              onPositionChange={onPlayerPositionChange} />
          )
        } else {
          return (
            <PlayerShell 
              key={player.id} 
              player={player} />
          )
        }
      })}
    </>
  )
}