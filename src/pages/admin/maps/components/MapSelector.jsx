import { useState } from "react"
import styled from "styled-components"
import { COLORS } from "ui/colors"
import Structure from "pages/components/structure"

const MapList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const MapItem = styled(Structure)`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? COLORS.primary.base : 'rgba(255, 255, 255, 0.1)'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`

export default function MapSelector({ chunkNames, selectedChunk, onSelect }) {
  return (
    <MapList>
      {chunkNames.map(chunkName => (
        <MapItem 
          key={chunkName}
          variant="card"
          selected={selectedChunk === chunkName}
          onClick={() => onSelect(chunkName)}>
            {chunkName}
        </MapItem>
      ))}
    </MapList>
  )
}