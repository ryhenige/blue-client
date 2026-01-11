import { useState, useEffect } from 'react';

const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:5022"
  : "https://blue-api-prod.fly.dev";

export function useCharacters(token) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacters = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/characters`, {
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

  const createCharacter = async (name, color) => {
    if (!token) throw new Error('No authentication token');

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/characters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
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
      const response = await fetch(`${API_BASE}/api/characters/${id}`, {
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
      const response = await fetch(`${API_BASE}/api/characters/${id}`, {
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
