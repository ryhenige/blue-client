import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useUdpConnection } from './hooks/useUdpConnection'

import { SceneContainer } from './components/StyledComponents'
import World from './components/World'
import Status from './components/ui/Status'
import Logout from './components/ui/Logout'

import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'

export default function Scene({ token, character, onBackToCharacterSelect }) {
  useDocumentTitle('Blue')
  const { connected: udpConnected, snapshot, sendPosition, disconnect: udpDisconnect, characterId: serverCharacterId } = useUdpConnection(token, character)

  extend({ Container, Graphics, Sprite })

  const handlePlayerPositionChange = (position) => {
    sendPosition(position)
  }

  return (
    <SceneContainer>
      <Status 
        token={token}
        character={character}
        snapshot={snapshot}
        udpConnected={udpConnected}
      />
      <Logout 
        onBackToCharacterSelect={onBackToCharacterSelect}
        udpDisconnect={udpDisconnect}
        wsDisconnect={() => {}}
      />
      
      <Application
       resizeTo={window}
      >
        <World 
          snapshot={snapshot}
          currentCharacterId={serverCharacterId}
          onPlayerPositionChange={handlePlayerPositionChange}
        />
      </Application>
    </SceneContainer>
  )
}
