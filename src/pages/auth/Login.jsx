import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "ui/colors";
import { useAuth } from './hooks/useAuth';
import Button from "pages/components/buttons";
import Input from "pages/components/inputs";
import Structure from "pages/components/structure";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 107, 107, 0.1);
`;

const SwitchText = styled.p`
  margin-top: 2rem;
  color: ${COLORS.text.secondary};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()

  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await login(formData.email, formData.password);
      onLoginSuccess(result);
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <LoginContainer>
      <Structure variant="card" style={{ textAlign: 'center', width: '400px', maxWidth: '90vw' }}>
        <Title>Welcome Back</Title>
        <Subtitle>Enter Blue World - the 3D multiplayer experience</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Button theme="secondary" type="submit" disabled={loading} scale>
            {loading && <LoadingSpinner />}
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SwitchText>
          Don't have an account? <a onClick={() => navigate("/register")}>Create one</a>
        </SwitchText>
      </Structure>
    </LoginContainer>
  );
}
