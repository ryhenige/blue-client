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
        <h3 style={{ color: COLORS.text.primary, margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👥 Total Users</h3>
        <div style={{ color: COLORS.text.secondary, lineHeight: '1.6' }}>
          Registered users in the system
          <StatValue>{stats.totalUsers}</StatValue>
        </div>
      </Structure>

      <Structure 
        variant="panel"
        onClick={() => navigate('/admin/storybook')}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <h3 style={{ color: COLORS.text.primary, margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📚 Component Storybook</h3>
        <div style={{ color: COLORS.text.secondary, lineHeight: '1.6' }}>
          View and test all UI components in an interactive gallery
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(108, 110, 204, 0.1)', 
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <strong>Open Storybook</strong>
          </div>
        </div>
      </Structure>

      <Structure 
        variant="panel"
        onClick={() => navigate('/admin/maps')}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <h3 style={{ color: COLORS.text.primary, margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗺️ Map Editor</h3>
        <div style={{ color: COLORS.text.secondary, lineHeight: '1.6' }}>
          Create and edit game maps using tilesets
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(108, 110, 204, 0.1)', 
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <strong>Open Map Editor</strong>
          </div>
        </div>
      </Structure>
    </AdminContent>
  )
}
