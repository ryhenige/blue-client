import { useState } from 'react'
import Login from './pages/auth/Login'
import Scene from './pages/scene/Scene'

export default function Blue() {
  const [authData, setAuthData] = useState(null)

  const handleLoginSuccess = (data) => {
    setAuthData(data)
  }

  const handleLogout = () => {
    setAuthData(null)
  }

  if (!authData) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <Scene 
      token={authData.token} 
      playerId={authData.playerId}
      onLogout={handleLogout}
    />
  )
}
