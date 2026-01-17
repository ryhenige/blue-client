import React, { useEffect, useRef, useState } from "react";
import { Application, useExtend } from "@pixi/react";
import { Container, AnimatedSprite } from "pixi.js";
import { drawOrder } from "constants/characters";
import { SIZES } from "ui/sizes";

import packManager from "helpers/packManager";

export default function Preview({ selection, animation = "idle-s" }) {
  useExtend({ Container, AnimatedSprite });

  const layerOrder = drawOrder;

  // What is currently rendered (stable during loading)
  const [currentResolved, setCurrentResolved] = useState(() => packManager.getResolvedAssets(selection));
  const [currentAnimations, setCurrentAnimations] = useState(null);

  // Track if we’re in the middle of loading a new selection (optional styling)
  const [isSwapping, setIsSwapping] = useState(false);

  // Store references to all animated sprites
  const spriteRefs = useRef({});

  // Prevent out-of-order loads from “winning” (e.g. user clicks fast)
  const loadTokenRef = useRef(0);

  console.log(selection)
  useEffect(() => {
    const token = ++loadTokenRef.current;
    let cancelled = false;

    (async () => {
      setIsSwapping(true);
      
      // Immediately stop all current sprites
      Object.values(spriteRefs.current).forEach(ref => {
        ref?.stop()
      });

      // Load using pack manager (pack-based loading)
      const animations = await packManager.loadSelection(selection);
      
      // Check if cancelled
      if (cancelled || token !== loadTokenRef.current) return;

      // Atomic swap: prevents "naked for a moment"
      const nextResolved = packManager.getResolvedAssets(selection);
      setCurrentResolved(nextResolved);
      setCurrentAnimations(animations);
      setIsSwapping(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [selection]);

  // Play animations when ready (both on load and after swapping)
  useEffect(() => {
    if (!isSwapping && currentAnimations) {
      const timer = setTimeout(() => {
        Object.values(spriteRefs.current).forEach(ref => {
          if (ref) {
            ref.gotoAndPlay(0);
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSwapping, currentAnimations]);

  return (
    <Application
      width={SIZES.preview.width}
      height={SIZES.preview.height}
      backgroundAlpha={0}
      autoStart
      sharedTicker
      options={{
        antialias: false,
        autoDensity: true,
        roundPixels: true,
      }}
    >
      <pixiContainer x={100} y={100} alpha={isSwapping ? 0.5 : 1}>
        {currentAnimations &&
          layerOrder.map((slot) => {
            const asset = currentResolved[slot];
            if (!asset) return null;

            // Your tags look like "pants-1-idle-s"
            const tagName = `${asset.id}-${animation}`;

            const clip = currentAnimations[slot]?.[tagName];
            if (!clip) return null;

            return (
              <pixiAnimatedSprite
                key={`${slot}-${asset.id}`}
                textures={clip.frames}
                ref={(ref) => {
                  spriteRefs.current[`${slot}`] = ref
                  ref?.gotoAndPlay(0)
                }}
                anchor={0.5}
                scale={3}
                loop
              />
            );
          })}
      </pixiContainer>
    </Application>
  );
}
