import { useEffect, useState, useRef } from 'react'
import { useExtend } from "@pixi/react"
import { Container, AnimatedSprite } from 'pixi.js'

import useKeyboardInput from 'hooks/useKeyboardInput'
import { characterPackManager } from "helpers/managers/packManager"

// Constants
const SPRITE_SIZE = 50
const SPRITE_MARGIN = SPRITE_SIZE / 2
const MOVE_SPEED = 2
const animation = "idle-s"

export default function CharacterSprite({ currentPlayer, onPositionChange}) {
  useExtend({ Container, AnimatedSprite })

  const characterSelection = currentPlayer?.appearance || [1,1,1,1,1,1]
  const [currentAnimations, setCurrentAnimations] = useState(null)
  const [currentResolved, setCurrentResolved] = useState(() => characterPackManager.getResolvedAssets(characterSelection))
  
  const keyboardInput = useKeyboardInput()
  const [localPosition, setLocalPosition] = useState(currentPlayer?.position || [0, 0, 0])
  const [bounds, setBounds] = useState({width: 800, height: 600})

  useEffect(() => {
      const updateBounds = () => {
          setBounds({
              width: window.innerWidth - SPRITE_MARGIN, 
              height: window.innerHeight - SPRITE_MARGIN
          })
      }

      updateBounds()
      window.addEventListener('resize', updateBounds)
      return () => window.removeEventListener('resize', updateBounds)
  }, [])
    
  useEffect(() => {
    const loadCharacter = async () => {
      const animations = await characterPackManager.loadSelection(characterSelection)
      const resolved = characterPackManager.getResolvedAssets(characterSelection)
      setCurrentAnimations(animations)
      setCurrentResolved(resolved)
    }

    loadCharacter()
  }, [characterSelection])
    
  // Handle keyboard movement for current character
  useEffect(() => {
    const { w, a, s, d } = keyboardInput

    const newPosition = [...localPosition]
    let rotation = newPosition[2] || 0

    if (w) newPosition[1] -= MOVE_SPEED // Move up (Y)
    if (s) newPosition[1] += MOVE_SPEED // Move down (Y)
    if (a) newPosition[0] -= MOVE_SPEED // Move left (X)
    if (d) newPosition[0] += MOVE_SPEED // Move right (X)

    // Calculate rotation based on movement direction
    if (w && a) rotation = -Math.PI * 3/4 // Up-left
    else if (w && d) rotation = -Math.PI/4 // Up-right
    else if (s && a) rotation = Math.PI * 3/4 // Down-left
    else if (s && d) rotation = Math.PI/4 // Down-right
    else if (w) rotation = -Math.PI/2 // Up
    else if (s) rotation = Math.PI/2 // Down
    else if (a) rotation = Math.PI // Left
    else if (d) rotation = 0 // Right

    newPosition[2] = rotation

    // Clamp position to window bounds
    newPosition[0] = Math.max(SPRITE_MARGIN, Math.min(bounds.width, newPosition[0]))
    newPosition[1] = Math.max(SPRITE_MARGIN, Math.min(bounds.height, newPosition[1]))

    // Update position if keys are pressed
    if (w || a || s || d) {
        setLocalPosition(newPosition)
        onPositionChange([newPosition[0], newPosition[1], newPosition[2]])
    }
  }, [keyboardInput, onPositionChange, bounds])

  return (
    <pixiContainer x={localPosition[0]} y={localPosition[1]}>
      {currentAnimations &&
        characterPackManager.config.order.map((slot) => {
          const asset = currentResolved[slot]
          if (!asset) return null

          const tagName = `${asset.id}-${animation}`
          const clip = currentAnimations[slot]?.[tagName]
          if (!clip) return null

          return (
            <pixiAnimatedSprite
              key={`${slot}-${asset.id}`}
              textures={clip.frames}
              ref={(ref) => {
                ref?.play()
              }}
              anchor={0.5}
              loop
            />
          )
        })}
    </pixiContainer>
  )
}
