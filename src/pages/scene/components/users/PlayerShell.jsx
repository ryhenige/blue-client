
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import React from 'react'

const PlayerShell = React.memo(function PlayerShell({ player }) {
  const { position, color } = player
  const meshRef = useRef()
  const [localPosition, setLocalPosition] = useState(position ? [position.x, position.y, position.z] : [0, 0, 0])
  
  // Update local position when server position changes
  useEffect(() => {
    if (position) {
      setLocalPosition([position.x, position.y, position.z])
    }
  }, [position])

  // Update position when prop changes
  useEffect(() => {
    if (meshRef.current && localPosition) {
      meshRef.current.position.set(...localPosition)
    }
  }, [localPosition])
  
  return (
    <mesh ref={meshRef} position={localPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
      />
    </mesh>
  );
})

export default PlayerShell
