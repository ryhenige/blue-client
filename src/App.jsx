import { useState, useEffect } from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import CharacterSelect from './pages/character/CharacterSelect'
import Scene from './pages/scene/Scene'

export default function Blue() {
  const [authData, setAuthData] = useState(null)
  const [currentView, setCurrentView] = useState('login') // 'login' or 'register'
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  // Check for existing auth data on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedPlayerId = localStorage.getItem('playerId')
    
    if (savedToken && savedPlayerId) {
      setAuthData({
        token: savedToken,
        playerId: savedPlayerId
      })
    }
  }, [])

  const handleLoginSuccess = (data) => {
    setAuthData(data)
  }

  const handleRegisterSuccess = (data) => {
    setAuthData(data)
  }

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
  }

  const handleLogout = () => {
    setAuthData(null)
    setSelectedCharacter(null)
    setCurrentView('login')
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('playerId')
  }

  const switchToRegister = () => {
    setCurrentView('register')
  }

  const switchToLogin = () => {
    setCurrentView('login')
  }

  const backToCharacterSelect = () => {
    setSelectedCharacter(null)
  }

  if (!authData) {
    if (currentView === 'register') {
      return (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )
    }
    
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={switchToRegister}
      />
    )
  }

  if (!selectedCharacter) {
    return (
      <CharacterSelect 
        token={authData.token}
        onCharacterSelect={handleCharacterSelect}
        onBackToLogin={handleLogout}
      />
    )
  }

  return (
    <Scene 
      token={authData.token} 
      character={selectedCharacter}
      onBackToCharacterSelect={backToCharacterSelect}
    />
  )
}
