import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import { COLORS } from "ui/colors";
import { SIZES } from "ui/sizes";

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import CharacterSelect from './pages/character/CharacterSelect'
import CharacterCreate from './pages/character/CharacterCreate'
import Scene from './pages/scene/Scene'
import AdminDashboard from './pages/admin/AdminDashboard'
import Storybook from './pages/admin/storybook/Storybook'
import { useUser } from './hooks/useUser'

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated, user, requiredRole }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // For role-protected routes, wait until user data is loaded
  if (requiredRole) {
    if (!user) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: COLORS.background,
          color: COLORS.text
        }}>
          Loading...
        </div>
      );
    }
    
    // Only check role after user is confirmed loaded
    if (!user[requiredRole]) {
      return <Navigate to="/characters" replace />;
    }
  }
  
  return children;
}

// Main App Component with Router
function AppContent() {
  const navigate = useNavigate();
  
  // Initialize authData synchronously from localStorage
  const getInitialAuthData = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedPlayerId = localStorage.getItem('playerId')
    
    if (savedToken && savedPlayerId) {
      return {
        token: savedToken,
        playerId: savedPlayerId
      }
    }
    return null
  }
  
  const [authData, setAuthData] = useState(getInitialAuthData())
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  // Fetch user data when logged in
  const { user, loading: userLoading, error: userError } = useUser(authData?.token)

  const handleAuthSuccess = (data) => {
    setAuthData(data)
  }

  const handleCharacterSelect = (character) => {
    // Set selected character and navigate to play without page reload
    setSelectedCharacter(character);
    navigate('/play');
  }

  const handleLogout = () => {
    setAuthData(null)
    setSelectedCharacter(null)
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('playerId')
  }

  // Show loading while checking auth or user data
  if (authData && userLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: COLORS.background,
        color: COLORS.text
      }}>
        Loading...
      </div>
    )
  }

  // Show auth error
  if (authData && userError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: COLORS.background,
        color: COLORS.text,
        textAlign: 'center'
      }}>
        <div>Authentication Error: {userError}</div>
        <button 
          onClick={handleLogout}
          style={{ 
            marginTop: '20px',
            padding: SIZES.button.padding,
            background: COLORS.error,
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          authData ? 
            <Navigate to="/characters" replace /> 
          :
            <Login 
              onLoginSuccess={handleAuthSuccess}
            />
        } 
      />
      <Route 
        path="/register" 
        element={
          authData ? 
            <Navigate to="/characters" replace /> 
          :
            <Register 
              onRegisterSuccess={handleAuthSuccess}
            />
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/characters" 
        element={
          <ProtectedRoute isAuthenticated={!!authData} user={user}>
            <CharacterSelect 
              token={authData?.token}
              user={user}
              onCharacterSelect={handleCharacterSelect}
              onBackToLogin={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/character/create" 
        element={
          <ProtectedRoute isAuthenticated={!!authData} user={user}>
            <CharacterCreate 
              token={authData?.token}
              user={user}
              onCharacterSelect={handleCharacterSelect}
              onBackToCharacterSelect={() => navigate('/characters')}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/play" 
        element={
          <ProtectedRoute isAuthenticated={!!authData} user={user}>
            <Scene 
              token={authData?.token} 
              user={user}
              character={selectedCharacter}
              onBackToCharacterSelect={() => {
                setSelectedCharacter(null);
                navigate('/characters');
              }}
            />
          </ProtectedRoute>
        } 
      />

      {/* Admin Route - requires admin role */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute isAuthenticated={!!authData} user={user} requiredRole="isAdmin">
            <AdminDashboard 
              token={authData?.token}
              user={user}
              onBackToCharacterSelect={() => navigate('/characters')}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />

      {/* Storybook Route - requires admin role */}
      <Route 
        path="/storybook" 
        element={
          <ProtectedRoute isAuthenticated={!!authData} user={user} requiredRole="isAdmin">
            <Storybook />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          authData ? <Navigate to="/characters" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: '#1a1a1a',
            color: 'white'
          }}>
            <div>
              <h2>404 - Page Not Found</h2>
              <button 
                onClick={() => navigate('/')}
                style={{ 
                  marginTop: '20px',
                  padding: SIZES.button.padding,
                  background: COLORS.success,
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  )
}

// Main export wrapper with Router
export default function Blue() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
