import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { COLORS } from "ui/colors";
import Structure from "pages/components/structure";

// Import component files
import * as Buttons from 'constants/styles/buttons'
import * as Inputs from 'constants/styles/inputs'
import * as Structures from 'constants/styles/structure'

// Define components in correct order
const ButtonComponents = {
  Primary: Buttons.Primary,
  Secondary: Buttons.Secondary, 
  Action: Buttons.Action,
  Back: Buttons.Back
}

const InputComponents = {
  Primary: Inputs.Primary,
  Secondary: Inputs.Secondary,
  Minimal: Inputs.Minimal,
  Glass: Inputs.Glass
}

const StructureComponents = {
  Card: Structures.Card,
  GlassCard: Structures.GlassCard,
  CompactCard: Structures.CompactCard,
  ElevatedCard: Structures.ElevatedCard,
  Modal: Structures.Modal,
  Panel: Structures.Panel
}

const StorybookContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background.main};
  color: ${COLORS.text.primary};
  display: flex;
`;

const Sidebar = styled.div`
  width: 250px;
  background: ${COLORS.background.main};
  backdrop-filter: blur(10px);
  border-right: 2px solid ${COLORS.background.glass};
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${COLORS.text.primary};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`;


const PreviewArea = styled.div`
  flex: 1;
  padding: 2rem;
  background: ${COLORS.background.main};
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.background.glass};
`;

const PreviewTitle = styled.h2`
  margin: 0;
  color: ${COLORS.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const BackButton = styled.button`
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
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;


const ComponentName = styled.h4`
  margin: 0;
  color: ${COLORS.text.primary};
  font-size: 0.9rem;
  font-weight: 700;
`;

const ComponentTile = styled.div`
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
`;

const ComponentIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ComponentCount = styled.div`
  color: ${COLORS.text.muted};
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;


const ComponentPreview = styled.div`
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
`;

const ControlsPanel = styled.div`
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid ${COLORS.background.glass};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ControlGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${COLORS.text.secondary};
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    background: ${COLORS.white};
    border: 2px solid ${COLORS.background.glass};
    border-radius: 6px;
    color: ${COLORS.text.primary};
    
    &:focus {
      outline: none;
      border-color: ${COLORS.primary.base};
      box-shadow: 0 0 0 3px ${COLORS.primary.base}20;
    }
  }
`;

const ControlLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ControlInput = styled.input`
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
`;

const ControlCheckbox = styled.input`
  margin-right: 0;
  width: auto !important;
  flex-shrink: 0;
`;

// Component registry - add your component files here
const COMPONENT_REGISTRY = {
  buttons: {
    name: 'Buttons',
    components: ButtonComponents,
    props: {
      text: { type: 'text', default: 'Click me!' },
      disabled: { type: 'boolean', default: false }
    }
  },
  inputs: {
    name: 'Inputs',
    components: InputComponents,
    props: {
      placeholder: { type: 'text', default: 'Write in me!' },
      disabled: { type: 'boolean', default: false }
    }
  },
  structure: {
    name: "Structure Components",
    icon: "",
    components: StructureComponents,
    props: {
      text: { type: 'text', default: 'Lorem ipsum ' },
    }
  }
};

export default function Storybook() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Initialize component props from registry defaults
  const [componentProps, setComponentProps] = useState(() => {
    const initialProps = { global: {} };
    
    // Collect props from the selected category
    Object.entries(COMPONENT_REGISTRY).forEach(([categoryKey, category]) => {
      Object.entries(category.props || {}).forEach(([propName, propConfig]) => {
        if (!initialProps.global.hasOwnProperty(propName)) {
          initialProps.global[propName] = propConfig.default;
        }
      });
    });
    
    return initialProps;
  });

  const updateProp = (componentName, propName, value) => {
    setComponentProps(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        [propName]: value
      }
    }));
  };

  const renderPropControl = (componentName, propName, propConfig, currentValue) => {
    switch (propConfig.type) {
      case 'text':
        return (
          <ControlInput
            type="text"
            value={currentValue || ''}
            onChange={(e) => updateProp(componentName, propName, e.target.value)}
          />
        );
      
      case 'boolean':
        return (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', opacity: 0.8, gap: '8px' }}>
            <ControlCheckbox
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => updateProp(componentName, propName, e.target.checked)}
            />
            <span style={{ lineHeight: '1' }}>{propName}</span>
          </div>
        );
      
      case 'number':
        return (
          <ControlInput
            type="number"
            value={currentValue || 0}
            onChange={(e) => updateProp(componentName, propName, Number(e.target.value))}
          />
        );
      
      default:
        return (
          <ControlInput
            type="text"
            value={currentValue || ''}
            onChange={(e) => updateProp(componentName, propName, e.target.value)}
          />
        );
    }
  };

  const renderSelectedCategory = () => {
    if (!selectedCategory) return null;

    const category = COMPONENT_REGISTRY[selectedCategory];
    const components = category.components;

    return (
      <>
        {/* Global Controls Panel */}
        <ControlsPanel style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: COLORS.primary }}>
            Global Props Controls
          </h3>
          
          {Object.entries(category.props || {}).map(([propName, propConfig]) => {
            const isBoolean = propConfig.type === 'boolean';
            return (
              <ControlGroup key={propName}>
                {!isBoolean && (
                  <ControlLabel>
                    {propName.charAt(0).toUpperCase() + propName.slice(1)}:
                  </ControlLabel>
                )}
                {renderPropControl('global', propName, propConfig, componentProps.global?.[propName] || propConfig.default)}
              </ControlGroup>
            );
          })}
        </ControlsPanel>

        {/* Component Grid */}
        <ComponentGrid>
          {Object.entries(components).map(([name, Component]) => {
            const props = componentProps.global || {};
            
            return (
              <Structure key={name} variant="card" style={{ padding: '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <ComponentName>{name}</ComponentName>
                <ComponentPreview>
                  {selectedCategory === 'inputs' ? (
                    <div style={{ 
                      background: name === 'Glass' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      padding: name === 'Glass' ? '1rem' : '0',
                      borderRadius: '8px',
                      margin: name === 'Glass' ? '-1rem' : '0'
                    }}>
                      <Component 
                        {...props}
                        className="storybook"
                        placeholder={props?.placeholder || 'Write in me!'}
                      />
                    </div>
                  ) : (
                    <Component 
                      {...props}
                      className="storybook"
                    >
                      {props.text || name}
                    </Component>
                  )}
                </ComponentPreview>
              </Structure>
            );
          })}
        </ComponentGrid>
      </>
    );
  };

  return (
    <StorybookContainer>
      <Sidebar>
        <SidebarTitle>Component Library</SidebarTitle>
        {Object.entries(COMPONENT_REGISTRY).map(([key, category]) => (
          <ComponentTile
            key={key}
            selected={selectedCategory === key}
            onClick={() => setSelectedCategory(key)}
            className={selectedCategory === key ? 'open' : ''}
          >
            <ComponentName>{category.name}</ComponentName>
            <ComponentCount>
              {Object.keys(category.components).length} components
            </ComponentCount>
          </ComponentTile>
        ))}
      </Sidebar>

      <PreviewArea>
        <PreviewHeader>
          <PreviewTitle>Storybook</PreviewTitle>
          <BackButton onClick={() => navigate('/admin')}>
            ← Back to Admin
          </BackButton>
        </PreviewHeader>

        {selectedCategory ? (
          renderSelectedCategory()
        ) : (
          <div style={{ textAlign: 'center', opacity: 0.7 }}>
            <h2>Select a component category to view</h2>
            <p>Choose from the available categories in the sidebar</p>
          </div>
        )}
      </PreviewArea>
    </StorybookContainer>
  );
}
