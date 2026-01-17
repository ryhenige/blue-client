import { useState, useEffect } from 'react';
import { ENDPOINTS } from 'constants/api';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedPlayerId = localStorage.getItem('playerId');
    
    if (savedToken && savedPlayerId) {
      setToken(savedToken);
      setPlayerId(savedPlayerId);
    }
  }, []);

  const saveAuthData = (data) => {
    setToken(data.token);
    setPlayerId(data.playerId);
    
    // Save to localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('playerId', data.playerId);
  };

  const clearAuthData = () => {
    setToken(null);
    setPlayerId(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('playerId');
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      saveAuthData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      saveAuthData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
  };

  return { token, playerId, loading, error, login, register, logout };
}
