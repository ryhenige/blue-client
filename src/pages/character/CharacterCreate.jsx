import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { COLORS } from "ui/colors";
import config from "/public/sprites/characters/packs.json";
import packManager from "../../helpers/packManager";
import Preview from "./components/Preview";
import useCharacters from "./hooks/useCharacters";
import Button from "pages/components/buttons";
import Input from "pages/components/inputs";
import Structure from "pages/components/structure";


const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 107, 107, 0.1);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PartSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 100px);
  margin-top: 0.5rem;
`;

const PartOption = styled.button`
  width: 80px;
  height: 80px;
  border: 2px solid ${props => props.selected ? COLORS.primary.base : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 10px;
  background: ${COLORS.transparent.mask3};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  overflow: hidden;
  
  &:hover {
    ${props => !props.selected && `
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    `}
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
`;

const PartSection = styled.div`
  margin-bottom: 1rem;
`;

const PartLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;

  ${props => props.$border && `
    border: 4px solid ${COLORS.background.mainSolid};
    border-radius: 10px 0 0 10px;
  `}
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 400px;
  width: 100%;
  overflow-y: auto;
  border-radius: 0 10px 10px 0;
  background: ${COLORS.background.mainSolid};

  scrollbar-width: none;
  -ms-overflow-style: none; 
  &::-webkit-scrollbar {
    display: none;
  }
`

const FalseBorder = styled.div`
  border: 1px solid #6c6ecc;
  border-radius: 10px;
  overflow: hidden;
  background: #6c6ecc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export default function CharacterCreate({ token, onCharacterSelect, onBackToCharacterSelect }) {
  const navigate = useNavigate();
  const { createCharacter, loading, error } = useCharacters(token)
  const [formData, setFormData] = useState([1,1,1,1,1,1])
  const [characterName, setCharacterName] = useState('')

  // Optional: Preload all packs on component mount for instant switching
  useEffect(() => {
    packManager.preloadAllPacks().catch(console.error)
  }, [])

  const handleCreateCharacter = async (e) => {
    e.preventDefault()
    
    try {
      // const newCharacter = await createCharacter(characterName, null, { parts: formData })
      onCharacterSelect(newCharacter)
    } catch (err) {
      // Error is handled by useCharacters hook
    }
  }

  const handleCancel = () => {
    onBackToCharacterSelect()
  }

  const updatePart = (slotIndex, value) => {
    const newFormData = [...formData]
    newFormData[slotIndex] = value
    setFormData(newFormData)
  }

  const renderPartOptions = (slotName, slotIndex) => {
    const assets = config.assets[slotName] || []
    
    return (
      <PartSection key={slotName}>
        <PartLabel>{slotName.charAt(0).toUpperCase() + slotName.slice(1)}</PartLabel>
        <PartSelector>
          {assets.map((asset, index) => (
            <PartOption 
              key={asset.id}
              type="button"
              selected={formData[slotIndex] === index + 1}
              onClick={(e) => {
                e.preventDefault()
                if(formData[slotIndex] !== index + 1) {
                  updatePart(slotIndex, index + 1)
                }
              }}
              disabled={loading}
            >
              <img 
                src={asset.url.replace('.json', '-thumb.png')} 
                style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }}
              />
            </PartOption>
          ))}
        </PartSelector>
      </PartSection>
    )
  }

  return (
    <Structure variant="card" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: COLORS.background.main }}>
      <Structure variant="card" style={{ width: '60%', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', textAlign: 'center' }}>
        <Title>Create New Character</Title>
        <Form onSubmit={handleCreateCharacter}>
          <Row>
            <Column $border>
              <div style={{ height: '200px', width: '200px', margin: '15px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FalseBorder>
                  <Preview selection={formData} />
                </FalseBorder>
              </div>
              <Input
                type="text"
                placeholder="Character Name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                required
                minLength="3"
                maxLength="50"
                disabled={loading}
              />

                <ButtonGroup>
                  <Button 
                    theme="secondary"
                    type="button" 
                    onClick={handleCancel}
                    disabled={loading}
                    width="100px"
                    height="40px"
                  >
                    Cancel
                  </Button>
                  <Button 
                    theme="primary"
                    type="submit"
                    disabled={loading}
                    width="170px"
                    height="40px"
                  >
                    Create Character
                  </Button>
                </ButtonGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Column>
            <Column>
                <Section>
                  {config.slots.map((slotName, index) => renderPartOptions(slotName, index))}
                </Section>
            </Column>
          </Row>
        </Form>
      </Structure>
    </Structure>
  )
}
