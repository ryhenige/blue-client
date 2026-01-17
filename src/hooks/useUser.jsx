import { useState, useEffect } from 'react';
import { ENDPOINTS } from 'constants/api';

export function useUser(token) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    if (!token) {
      setError('No authentication token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
