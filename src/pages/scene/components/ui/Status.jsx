import styled from 'styled-components'

const StatusOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
`

export default function Status({ currentPlayer, udpConnected, snapshot, messages }) {
  // console.log(currentPlayer)
  return (
    <StatusOverlay>
    <div>Player ID: {currentPlayer?.id}</div>
    <div>Color: {currentPlayer?.color}</div>
    <div>UDP Connected: {udpConnected ? 'Yes' : 'No'}</div>
    <div>Players: {snapshot?.players?.length || 0}</div>
    </StatusOverlay>
  )
}
