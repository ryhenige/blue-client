import { useEffect, useState, useRef, useCallback } from 'react'
import React from 'react'
import {
    Graphics,
} from 'pixi.js'

// Constants
const SPRITE_SIZE = 50
const SPRITE_MARGIN = SPRITE_SIZE / 2

const CharacterShellSprite = React.memo(function CharacterShellSprite({ character }) {
    const graphicsRef = useRef(null)
    const [localPosition, setLocalPosition] = useState(character?.position || [0, 0, 0])
    
    // Update local position when server position changes
    useEffect(() => {
        if (character?.position && Array.isArray(character.position)) {
            setLocalPosition([character.position[0], character.position[1], character.position[2] || 0])
        }
    }, [character?.position])

    const draw = useCallback((graphics) => {
        graphics.clear();
        graphics.beginFill(character?.color || 0x4287f5);
        graphics.drawRect(-SPRITE_MARGIN, -SPRITE_MARGIN, SPRITE_SIZE, SPRITE_SIZE);
        graphics.endFill();
        
        // Draw directional marker (triangle pointing right)
        graphics.beginFill(0xffffff); // White marker
        graphics.moveTo(SPRITE_MARGIN - 5, 0);
        graphics.lineTo(SPRITE_MARGIN + 10, -5);
        graphics.lineTo(SPRITE_MARGIN + 10, 5);
        graphics.closePath();
        graphics.endFill();
    }, [character?.color])

    return (
        <pixiGraphics
            ref={graphicsRef}
            draw={draw}
            x={localPosition[0]}
            y={localPosition[1]}
            rotation={localPosition[2]} />
    );
})

export default CharacterShellSprite
