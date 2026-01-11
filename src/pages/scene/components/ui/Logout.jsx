import styled from 'styled-components'

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(76, 175, 80, 0.8);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background: rgba(76, 175, 80, 1);
  }
`

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
`

export default function Logout({ onBackToCharacterSelect, udpDisconnect, wsDisconnect }) {
  const handleBackToCharacterSelect = () => {
    wsDisconnect()
    udpDisconnect()
    onBackToCharacterSelect()
  }

  return (
    <ButtonContainer>
      <BackButton onClick={handleBackToCharacterSelect}>
        Characters
      </BackButton>
    </ButtonContainer>
  )
}
