import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { COLORS } from 'constants/ui/colors'

import Structure from "pages/components/structure"

const AdminContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${COLORS.primary.base};
  margin: 1rem 0;
  padding: 15px;
  margin-bottom: 20px;
`

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const Title = styled.h3`
  color: ${COLORS.text.primary}; 
  margin-top: 0; 
  fontSize: 1.2rem, 
  fontWeight: 600, 
  display: flex, 
  alignItems: center, 
  gap: 0.5rem
`

const Description = styled.div`
  color: ${COLORS.text.secondary}; 
  lineHeight: 1.6
`

const Open = styled.div`
  font-weight: 600;
  margin-top: 15px; 
  padding: 10px; 
  background: rgba(108, 110, 204, 0.1); 
  border-radius: 6px;
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
`



export default function AdminHome() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCharacters: 0,
    activeConnections: 0,
    recentRegistrations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        Loading admin dashboard...
      </div>
    )
  }

  return (
    <AdminContent>
      <Structure variant="panel">
        <Title>👥 Total Users</Title>
        <Description>
          Registered users in the system
          <StatValue>{stats.totalUsers}</StatValue>
        </Description>
      </Structure>

      <Structure 
        variant="panel"
        onClick={() => navigate('/admin/storybook')}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <Container>
          <Title>📚 Component Storybook</Title>
          <Description>
            View and test all UI components in an interactive gallery
          </Description>
          <Open>
            Open Storybook
          </Open>
        </Container>
      </Structure>

      <Structure 
        variant="panel"
        onClick={() => navigate('/admin/maps')}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      > 
        <Container>
          <Title>🗺️ Map Editor</Title>
          <Description>
            Create and edit game maps using tilesets
          </Description>
          <Open>
            Open Map Editor
          </Open>
        </Container>
      </Structure>
    </AdminContent>
  )
}
