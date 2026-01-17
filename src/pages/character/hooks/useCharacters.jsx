import { useState, useEffect } from 'react';
import { ENDPOINTS } from 'constants/api';

export default function useCharacters(token) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacters = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(ENDPOINTS.CHARACTERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }
      
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (name, color, spriteConfig = {}) => {
    if (!token) throw new Error('No authentication token');

    setLoading(true);
    setError(null);
    
    try {
      const requestBody = { name, color };
      
      // Add sprite configuration if provided
      if (Object.keys(spriteConfig).length > 0) {
        requestBody.spriteConfig = spriteConfig;
      }
      
      const response = await fetch(ENDPOINTS.CHARACTERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create character');
      }
      
      const newCharacter = await response.json();
      setCharacters(prev => [newCharacter, ...prev]);
      return newCharacter;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCharacter = async (id, color) => {
    if (!token) throw new Error('No authentication token');

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${ENDPOINTS.CHARACTERS}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update character');
      }
      
      const updatedCharacter = await response.json();
      setCharacters(prev => 
        prev.map(char => char.id === id ? updatedCharacter : char)
      );
      return updatedCharacter;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCharacter = async (id) => {
    if (!token) throw new Error('No authentication token');

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${ENDPOINTS.CHARACTERS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete character');
      }
      
      setCharacters(prev => prev.filter(char => char.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load characters when token changes
  useEffect(() => {
    if (token) {
      fetchCharacters();
    } else {
      setCharacters([]);
    }
  }, [token]);

  return { 
    characters, 
    loading, 
    error, 
    fetchCharacters, 
    createCharacter, 
    updateCharacter, 
    deleteCharacter 
  };
}
