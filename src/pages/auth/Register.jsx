import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from './hooks/useAuth';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: Arial, sans-serif;
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 400px;
  max-width: 90vw;
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

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
  opacity: 0.9;
  
  a {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
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

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    if (formData.password.length < 4) {
      return;
    }

    try {
      const result = await register(formData.email, formData.password);
      onRegisterSuccess(result);
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Join Blue World</Title>
        <Subtitle>Create your account to enter the 3D multiplayer experience</Subtitle>
        
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
            minLength="4"
            disabled={loading}
          />
          
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="4"
            disabled={loading}
          />
          
          <Button type="submit" disabled={loading || formData.password !== formData.confirmPassword}>
            {loading && <LoadingSpinner />}
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <ErrorMessage>Passwords do not match</ErrorMessage>
        )}
        {formData.password && formData.password.length < 4 && (
          <ErrorMessage>Password must be at least 4 characters</ErrorMessage>
        )}
        
        <SwitchText>
          Already have an account? <a onClick={onSwitchToLogin}>Sign in</a>
        </SwitchText>
      </RegisterCard>
    </RegisterContainer>
  );
}
