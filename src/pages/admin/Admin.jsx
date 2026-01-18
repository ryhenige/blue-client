import React from 'react';

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { COLORS } from 'constants/ui/colors'
import Button from "pages/components/buttons"

import AdminDashboard from './AdminDashboard'
import Storybook from './storybook/Storybook'
import Maps from './maps/Maps'
import MapCreator from './maps/MapCreator'

const AdminLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  padding: 0;
`

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${COLORS.background.glass};
`

const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${COLORS.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AdminNav = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const AdminContent = styled.div`
  ${props => props.$padded && `padding: 2rem`}
`

export default function Admin({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if we're on the admin home page (/admin or /admin/)
  const isAdminHome = location.pathname === '/admin' || location.pathname === '/admin/'
  const isMapsCreator = location.pathname === '/admin/maps/creator'

  return (
    <AdminLayoutContainer>
      <AdminHeader>
        <AdminTitle>🛡️ Admin Dashboard</AdminTitle>
        <AdminNav>
            {isAdminHome ? (
              <Button onClick={() => navigate('/characters')}>
                ← Back to Characters
              </Button>
            ) : 
            isMapsCreator ? (
              <Button onClick={() => navigate('/admin/maps/viewer')}>
                ← Back to Viewer
              </Button>
            ) : (
              <Button onClick={() => navigate('/admin')}>
                ← Back to Admin
              </Button>
            )}
          <Button theme="action" onClick={onLogout}>
            Logout
          </Button>
        </AdminNav>
      </AdminHeader>

      {/* --------- ROUTES  ---------- */}
      <AdminContent $padded={isAdminHome}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/storybook" element={<Storybook />} />
          <Route path="/maps/viewer" element={<Maps />} />
          <Route path="/maps/creator" element={<MapCreator />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminContent>
    </AdminLayoutContainer>
  )
}
