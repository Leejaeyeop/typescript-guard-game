import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { MAX_SIZE } from "../../constants/sizes";

export function MenuSprite() {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(`assets/ui/paper.png`).then((result) => {
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
      y={MAX_SIZE / 2}
      width={MAX_SIZE / 1.5}
      height={MAX_SIZE / 1.5}
    ></pixiSprite>
  );
}
