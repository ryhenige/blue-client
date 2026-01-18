import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Structure from "pages/components/structure"
import { ComponentGrid, ComponentName, ControlGroup, ControlLabel, ControlCheckbox, 
        ControlsPanel, ComponentPreview, ControlTitle } from "pages/admin/components/styledComponents"
import SideSelector from "pages/admin/components/SideSelector"

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
}

export default function Storybook() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  // Initialize component props from registry defaults
  const [componentProps, setComponentProps] = useState(() => {
    const initialProps = { global: {} }
    
    // Collect props from the selected category
    Object.entries(COMPONENT_REGISTRY).forEach(([categoryKey, category]) => {
      Object.entries(category.props || {}).forEach(([propName, propConfig]) => {
        if (!initialProps.global.hasOwnProperty(propName)) {
          initialProps.global[propName] = propConfig.default
        }
      })
    })
    
    return initialProps
  })

  const updateProp = (componentName, propName, value) => {
    setComponentProps(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        [propName]: value
      }
    }))
  }

  const renderPropControl = (componentName, propName, propConfig, currentValue) => {
    switch (propConfig.type) {
      case 'text':
        return (
          <Inputs.Primary
            value={currentValue || ''}
            onChange={(e) => updateProp(componentName, propName, e.target.value)}
          />
        )
      
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
        )
      
      case 'number':
        return (
          <Inputs.Primary
            type="number"
            value={currentValue || 0}
            onChange={(e) => updateProp(componentName, propName, Number(e.target.value))}
          />
        )
      
      default:
        return (
          <Inputs.Primary
            type="text"
            value={currentValue || ''}
            onChange={(e) => updateProp(componentName, propName, e.target.value)}
          />
        )
    }
  }

  const renderSelectedCategory = () => {
    if (!selected) return null;

    const category = COMPONENT_REGISTRY[selected];
    const components = category.components;

    return (
      <>
        {/* Global Controls Panel */}
        <ControlsPanel>
          <ControlTitle>
            Global Props Controls
          </ControlTitle>
          
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
            )
          })}
        </ControlsPanel>

        {/* Component Grid */}
        <ComponentGrid>
          {Object.entries(components).map(([name, Component]) => {
            const props = componentProps.global || {};
            const { text, ...filteredProps } = props;
            
            return (
              <Structure key={name} variant="card" style={{ padding: '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <ComponentName>{name}</ComponentName>
                <ComponentPreview>
                  {selected === 'inputs' ? (
                    <div style={{ 
                      background: name === 'Glass' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      padding: name === 'Glass' ? '1rem' : '0',
                      borderRadius: '8px',
                      margin: name === 'Glass' ? '-1rem' : '0'
                    }}>
                      <Component 
                        {...filteredProps}
                        className="storybook"
                        placeholder={filteredProps?.placeholder || 'Write in me!'}
                      />
                    </div>
                  ) : (
                    <Component 
                      {...filteredProps}
                      className="storybook"
                    >
                      {text || name}
                    </Component>
                  )}
                </ComponentPreview>
              </Structure>
            )
          })}
        </ComponentGrid>
      </>
    )
  }

  return (
    <SideSelector
      title="Storybook"
      descriptiveTitle="component"
      registry={COMPONENT_REGISTRY}
      onSelect={setSelected}
    >
      {selected ? renderSelectedCategory() : null}
    </SideSelector>
  )
}
