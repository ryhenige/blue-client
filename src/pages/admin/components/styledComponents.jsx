import styled from 'styled-components'
import { COLORS } from "ui/colors"

export const Container = styled.div`
  min-height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  display: flex;
`

export const Sidebar = styled.div`
  width: 250px;
  background: ${COLORS.background.main};
  backdrop-filter: blur(10px);
  border-right: 2px solid ${COLORS.background.glass};
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const SidebarTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${COLORS.text.primary};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`


export const PreviewArea = styled.div`
  flex: 1;
  padding: 2rem;
  background: ${COLORS.background.main};
`

export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.background.glass};
`

export const PreviewTitle = styled.h2`
  margin: 0;
  color: ${COLORS.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
`

export const BackButton = styled.button`
  background: ${COLORS.background.card};
  border: 1px solid ${COLORS.background.glass};
  color: ${COLORS.text.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.background.glass};
  }
`

export const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`


export const ComponentName = styled.h4`
  margin: 0;
  color: ${COLORS.text.primary};
  font-size: 0.9rem;
  font-weight: 700;
`

export const ComponentTile = styled.div`
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid ${COLORS.background.glass};
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  transition: all 0.3s ease;
  min-width: min-content;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background: ${COLORS.background.glass};
    box-shadow: 0 8px 16px ${COLORS.background.overlay};
  }

  &.open {
    text-align: right;
  }
`

export const ComponentIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

export const ComponentCount = styled.div`
  color: ${COLORS.text.muted};
  font-size: 0.8rem;
  margin-top: 0.5rem;
`


export const ComponentPreview = styled.div`
  padding: 1rem;
  background: transparent;
  border-radius: 8px;
  margin-top: 1rem;
  width: 100%;
  overflow: hidden;
  
  & input {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
`

export const ControlsPanel = styled.div`
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid ${COLORS.background.glass};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

export const ControlGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${COLORS.text.secondary};
    font-size: 0.9rem;
    font-weight: 500;
  }
`

export const ControlLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
`

export const ControlInput = styled.input`
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: ${COLORS.text};
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }
`

export const ControlCheckbox = styled.input`
  margin-right: 0;
  width: auto !important;
  flex-shrink: 0;
`