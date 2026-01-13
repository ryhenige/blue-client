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
  z-index: 1000;
`

export default function Status({ character, udpConnected, snapshot }) {
  return (
    <StatusOverlay>
    <div>Name: {character?.name || 'Loading...'}</div>
    <div>Color: {character?.color}</div>
    <div>UDP Connected: {udpConnected ? 'Yes' : 'No'}</div>
    <div>Characters: {snapshot?.characters?.length || 0}</div>
    </StatusOverlay>
  )
}
