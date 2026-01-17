import styled from 'styled-components'
import Button from "pages/components/buttons"

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
`

const handleBackToCharacterSelect = () => {
  window.location.href = '/characters';
}

const Logout = () => {
  return (
    <ButtonContainer>
      <Button theme="back" onClick={handleBackToCharacterSelect}>
        Characters
      </Button>
    </ButtonContainer>
  )
}

export default Logout;
