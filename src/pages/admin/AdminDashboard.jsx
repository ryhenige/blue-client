import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "ui/colors";
import { SIZES } from "ui/sizes";
import Button from "pages/components/buttons";
import Structure from "pages/components/structure";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  padding: 0;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${COLORS.background.glass};
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${COLORS.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminNav = styled.div`
  display: flex;
  gap: 1rem;
`;

const UserInfo = styled.div`
  padding: 1.5rem 2rem;
  background: ${COLORS.background.accent};
  border-bottom: 1px solid ${COLORS.background.glass};
  font-size: 0.9rem;
  color: ${COLORS.text.secondary};
  
  strong {
    color: ${COLORS.text.primary};
  }
`;

const AdminContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${COLORS.primary.base};
  margin: 1rem 0;
  padding: 15px;
  margin-bottom: 20px;
`;

export default function AdminDashboard({ token, user, onBackToCharacterSelect, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCharacters: 0,
    activeConnections: 0,
    recentRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)
  }, []);

  if (loading) {
    return (
      <AdminContainer>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Loading admin dashboard...
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>🛡️ Admin Dashboard</AdminTitle>
        <AdminNav>
          <Button theme="primary" onClick={() => navigate('/characters')}>
            ← Back to Characters
          </Button>
          <Button theme="action" onClick={onLogout}>
            Logout
          </Button>
        </AdminNav>
      </AdminHeader>

      <UserInfo>
        <strong>Logged in as:</strong> {user?.email} | 
        <strong> User ID:</strong> {user?.id} | 
        <strong> Admin:</strong> ✅
      </UserInfo>

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
          onClick={() => navigate('/storybook')}
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

      </AdminContent>

    </AdminContainer>
  );
}
