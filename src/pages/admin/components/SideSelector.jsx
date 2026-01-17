import { useState } from 'react';
import { Container, Sidebar, SidebarTitle, ComponentTile, ComponentName, ComponentCount, 
        PreviewArea } from "pages/admin/components/styledComponents"



export default function SideSelector(
  { 
    title,
    descriptiveTitle,
    registry, 
    children,
    onSelect
  }
) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  return (
    <Container>
      <Sidebar>
        <SidebarTitle>{title}</SidebarTitle>
        {Object.entries(registry).map(([key, category]) => (
          <ComponentTile
            key={key}
            selected={selectedCategory === key}
            onClick={() => {
              setSelectedCategory(key);
              if (onSelect) onSelect(key);
            }}
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
        {selectedCategory ? (
          children
        ) : (
          <div style={{ textAlign: 'center', opacity: 0.7 }}>
            <h2>Select a {descriptiveTitle} to view</h2>
            <p>Choose from the available {descriptiveTitle} in the sidebar</p>
          </div>
        )}
      </PreviewArea>
    </Container>
  );
}
