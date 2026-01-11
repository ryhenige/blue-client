import { useState } from 'react';

const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:5022"
  : "https://blue.fly.dev";

export function useAuth() {
  const [token, setToken] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      setToken(data.token);
      setPlayerId(data.playerId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setPlayerId(null);
    setError(null);
  };

  return { token, playerId, loading, error, login, logout };
}
