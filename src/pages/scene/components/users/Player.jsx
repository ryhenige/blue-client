
import { useState } from 'react'
import useKeyboardInput from '../../hooks/useKeyboardInput'
import { useRef, useEffect } from 'react'

export default function Player({ player, onPositionChange }) {
  const { position, color } = player
  const meshRef = useRef()
  const keyboardInput = useKeyboardInput()
  const [localPosition, setLocalPosition] = useState(position ? [position.x, position.y, position.z] : [0, 0, 0])
  
  // Update position when prop changes
  useEffect(() => {
    if (meshRef.current && localPosition) {
      meshRef.current.position.set(...localPosition)
    }
  }, [localPosition])

  // Handle keyboard movement for current player
  useEffect(() => {
    const { w, a, s, d } = keyboardInput

    const moveSpeed = 1;
    const newPosition = [...localPosition]

    if (w) newPosition[1] += moveSpeed // Move up (Y)
    if (s) newPosition[1] -= moveSpeed // Move down (Y)
    if (a) newPosition[0] -= moveSpeed // Move left (X)
    if (d) newPosition[0] += moveSpeed // Move right (X)

    // Clamp position to bounds
    newPosition[0] = Math.max(-5, Math.min(5, newPosition[0]))
    newPosition[1] = Math.max(-5, Math.min(5, newPosition[1]))

    // Update position if keys are pressed
    if (w || a || s || d) {
      setLocalPosition(newPosition)
      onPositionChange(newPosition)
    }
  }, [keyboardInput, onPositionChange])
  
  return (
    <mesh ref={meshRef} position={localPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
      />
    </mesh>
  );
}
