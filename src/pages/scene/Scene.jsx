import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useUdpConnection } from './hooks/useUdpConnection'
import { SceneContainer } from './components/StyledComponents'
import World from './components/World'
import Status from './components/ui/Status'
import Logout from './components/ui/Logout'

export default function Scene({ token, playerId: initialPlayerId, onLogout }) {
  useDocumentTitle('Blue')
  const { connected: udpConnected, snapshot, sendPosition, disconnect: udpDisconnect, playerId: serverPlayerId } = useUdpConnection(token, initialPlayerId)

  const currentPlayer = useMemo(() => snapshot?.players?.find(player => player.id === serverPlayerId), [snapshot, serverPlayerId])

  const handlePlayerPositionChange = (position) => {
    const [x, y, z] = position
    sendPosition(x, y, z, 0)
  }

  return (
    <SceneContainer>
      <Status 
        token={token}
        currentPlayer={currentPlayer}
        udpConnected={udpConnected}
        snapshot={snapshot}
        messages={[]}
      />
      <Logout 
        onLogout={onLogout}
        udpDisconnect={udpDisconnect}
        wsDisconnect={() => {}}
      />
      
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <World 
          snapshot={snapshot} 
          currentPlayer={currentPlayer}
          onPlayerPositionChange={handlePlayerPositionChange} 
        />
      </Canvas>
    </SceneContainer>
  )
}
