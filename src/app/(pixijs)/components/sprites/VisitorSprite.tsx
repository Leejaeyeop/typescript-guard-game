import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { MAX_SIZE } from "../../constants/sizes";
import { useTick } from "@pixi/react";
// import { useTick } from "@pixi/react";

function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

export function VisitorSprite() {
  // The Pixi.js `Sprite`
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [positionY, setPositionY] = useState(MAX_SIZE);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(`assets/visitors/visitor${getRandomNumber()}.png`).then(
        (result) => {
          setTexture(result);
        }
      );
    }
  }, [texture]);

  useTick(() => {
    if (positionY <= MAX_SIZE / 1.3) return;
    setPositionY((prev) => prev - 3);
  });

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      texture={texture}
      x={MAX_SIZE / 2}
      y={positionY}
      width={MAX_SIZE / 2}
      height={MAX_SIZE / 2}
    />
  );
}
