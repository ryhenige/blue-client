import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "ui/colors";
import useCharacters from './hooks/useCharacters';
import Button from "pages/components/buttons";
import Structure from "pages/components/structure";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  font-family: Arial, sans-serif;
`;


const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
`;

const CharacterList = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
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


export default function CharacterSelect({ token, user, onCharacterSelect, onBackToLogin }) {
  const navigate = useNavigate()
  const { characters, loading, error, deleteCharacter } = useCharacters(token)

  const handleDeleteCharacter = async (id, e) => {
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        await deleteCharacter(id)
      } catch (err) {
        // Error is handled by useCharacters hook
      }
    }
  }

  const handleSelectCharacter = (character) => {
    onCharacterSelect(character)
  }


  return (
    <Container>
      <Structure variant="card" style={{ 
          textAlign: 'center', width: '500px', maxWidth: '90vw', maxHeight: '80vh', 
          overflowY: 'auto', minHeight: '500px'}}>
        <Title>Select Your Character</Title>
        
        {characters.length > 0 ? (
          <CharacterList>
            {characters.map(character => (
              <Structure 
                key={character.id} 
                variant="compactCard"
                onClick={() => handleSelectCharacter(character)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', 
                         cursor: 'pointer', transition: 'all 0.3s ease', justifyContent: 'space-between' }}
              >
                <CharacterInfo>
                  <CharacterAvatar color={character.color} />
                  <CharacterName>{character.name}</CharacterName>
                </CharacterInfo>
                <CharacterActions>
                  <Button 
                    theme="action"
                    onClick={(e) => handleDeleteCharacter(character.id, e)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </CharacterActions>
              </Structure>
            ))}
          </CharacterList>
        ) : (
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            No characters yet. Create your first character!
          </p>
        )}
        
        <Button 
          theme="primary"
          onClick={() => navigate('/character/create')}
          disabled={loading || characters.length >= 5}
        >
          {loading && <LoadingSpinner />}
          {characters.length >= 5 ? 'Maximum Characters Reached' : 'Create New Character'}
        </Button>
        
        {user?.isAdmin ? (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%' }}>
            <Button 
              theme="secondary"
              onClick={() => navigate('/admin')}
              style={{ flex: 1 }}
            >
              🛡️ Admin Dashboard
            </Button>
            <Button 
              theme="secondary"
              onClick={onBackToLogin}
              style={{ flex: 1 }}
              className="danger"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            theme="secondary"
            onClick={onBackToLogin}
            style={{ marginTop: '1rem', width: '100%' }}
            className="danger"
          >
            Logout
          </Button>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Structure>
    </Container>
  );
}
