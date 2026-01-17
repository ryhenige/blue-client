import styled, { css } from "styled-components"
import { COLORS } from "ui/colors"

const Base = css`
  background: ${COLORS.white};
  border: 1px solid ${COLORS.text.muted};
  color: ${COLORS.text.primary};
  padding: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::placeholder {
    color: ${COLORS.text.muted};
  }
  
  &:focus {
    border-color: ${COLORS.primary.base};
    box-shadow: 0 0 0 3px ${COLORS.primary.base}20, 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Primary = styled.input`
  ${Base}
`

const Secondary = styled.input`
  background: ${COLORS.background.card};
  border: 2px solid ${COLORS.background.glass};
  color: ${COLORS.text.primary};
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${COLORS.text.muted};
  }
  
  &:focus {
    border-color: ${COLORS.primary.base};
    background: ${COLORS.white};
    box-shadow: 0 0 0 3px ${COLORS.primary.base}20;
  }
`

const Minimal = styled.input`
  background: transparent;
  border: none;
  border-bottom: 2px solid ${COLORS.text.muted};
  color: ${COLORS.text.primary};
  padding: 0.5rem 0;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${COLORS.text.muted};
  }
  
  &:focus {
    border-bottom-color: ${COLORS.primary.base};
  }
`

const Glass = styled.input`
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
`

export { Primary, Secondary, Minimal, Glass }
