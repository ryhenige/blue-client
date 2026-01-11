import React, { useState } from 'react';
import styled from 'styled-components';
import { useCharacters } from './hooks/useCharacters';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
`;

const CharacterList = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CharacterCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CharacterAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.color || '#ffffff'};
  border: 3px solid rgba(255, 255, 255, 0.5);
`;

const CharacterName = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`;

const CharacterActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateButton = styled.button`
  background: rgba(76, 175, 80, 0.8);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  font-weight: 500;
  width: 100%;
  
  &:hover {
    background: rgba(76, 175, 80, 1);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 400px;
  max-width: 90vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  background: rgba(76, 175, 80, 0.8);
  border: none;
  color: white;
  padding: 1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: rgba(76, 175, 80, 1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function CharacterSelect({ token, onCharacterSelect, onBackToLogin }) {
  const { characters, loading, error, createCharacter, deleteCharacter } = useCharacters(token);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#ffffff'
  });

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    
    if (formData.name.length < 3 || formData.name.length > 50) {
      return;
    }

    try {
      const newCharacter = await createCharacter(formData.name, formData.color);
      setShowCreateModal(false);
      setFormData({ name: '', color: '#ffffff' });
      onCharacterSelect(newCharacter);
    } catch (err) {
      // Error is handled by useCharacters hook
    }
  };

  const handleDeleteCharacter = async (id, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        await deleteCharacter(id);
      } catch (err) {
        // Error is handled by useCharacters hook
      }
    }
  };

  const handleSelectCharacter = (character) => {
    onCharacterSelect(character);
  };

  if (showCreateModal) {
    return (
      <Modal>
        <ModalCard>
          <Title>Create New Character</Title>
          <Form onSubmit={handleCreateCharacter}>
            <Input
              type="text"
              placeholder="Character Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              minLength="3"
              maxLength="50"
              disabled={loading}
            />
            <label style={{ textAlign: 'left', marginBottom: '-0.5rem' }}>Character Color</label>
            <ColorInput
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              disabled={loading}
            />
            <ButtonGroup>
              <CancelButton 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={loading || formData.name.length < 3}>
                {loading && <LoadingSpinner />}
                Create
              </SubmitButton>
            </ButtonGroup>
          </Form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalCard>
      </Modal>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Select Your Character</Title>
        
        {characters.length > 0 ? (
          <CharacterList>
            {characters.map(character => (
              <CharacterCard 
                key={character.id} 
                onClick={() => handleSelectCharacter(character)}
              >
                <CharacterInfo>
                  <CharacterAvatar color={character.color} />
                  <CharacterName>{character.name}</CharacterName>
                </CharacterInfo>
                <CharacterActions>
                  <ActionButton 
                    onClick={(e) => handleDeleteCharacter(character.id, e)}
                    disabled={loading}
                  >
                    Delete
                  </ActionButton>
                </CharacterActions>
              </CharacterCard>
            ))}
          </CharacterList>
        ) : (
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            No characters yet. Create your first character!
          </p>
        )}
        
        <CreateButton 
          onClick={() => setShowCreateModal(true)}
          disabled={loading || characters.length >= 5}
        >
          {loading && <LoadingSpinner />}
          {characters.length >= 5 ? 'Maximum Characters Reached' : 'Create New Character'}
        </CreateButton>
        
        <ActionButton 
          onClick={onBackToLogin}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          Back to Login
        </ActionButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
}
