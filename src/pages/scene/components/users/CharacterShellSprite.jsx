import React, { useEffect, useState } from 'react'
import { useExtend } from "@pixi/react"
import { Container, AnimatedSprite } from 'pixi.js'

import { characterPackManager } from "helpers/managers/packManager"

// Constants
const SPRITE_SIZE = 50
const SPRITE_MARGIN = SPRITE_SIZE / 2
const animation = "idle-s"

const CharacterShellSprite = React.memo(function CharacterShellSprite({ character }) {
  useExtend({ Container, AnimatedSprite })

  const characterSelection = character?.appearance || [1,1,1,2,1,1]
  const [currentAnimations, setCurrentAnimations] = useState(null)
  const [currentResolved, setCurrentResolved] = useState(() => characterPackManager.getResolvedAssets(characterSelection))

  useEffect(() => {
    const loadCharacter = async () => {
      const animations = await characterPackManager.loadSelection(characterSelection)
      const resolved = characterPackManager.getResolvedAssets(characterSelection)
      setCurrentAnimations(animations)
      setCurrentResolved(resolved)
    }

    loadCharacter()
  }, [characterSelection])

  return (
    <pixiContainer x={character?.position[0]} y={character?.position[1]}>
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
})

export default CharacterShellSprite
