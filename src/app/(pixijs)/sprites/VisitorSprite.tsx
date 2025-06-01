import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { MAX_SIZE } from "../constants/sizes";
// import { useTick } from "@pixi/react";

export function VisitorSprite() {
  // The Pixi.js `Sprite`
  const spriteRef = useRef(null);

  const [texture, setTexture] = useState(Texture.EMPTY);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("assets/visitors/visitor1.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      texture={texture}
      x={MAX_SIZE / 2}
      y={MAX_SIZE / 1.3}
      width={MAX_SIZE / 2}
      height={MAX_SIZE / 2}
    />
  );
}
