import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
// import { useTick } from "@pixi/react";

export function VisitorSprite() {
  // The Pixi.js `Sprite`
  const spriteRef = useRef(null);

  const [texture, setTexture] = useState(Texture.EMPTY);
  //   const [isHovered, setIsHover] = useState(false);
  //   const [isActive, setIsActive] = useState(false);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("assets/visitor.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={"static"}
      //   scale={isActive ? 1 : 1.5}
      texture={texture}
      //   x={400}
      //   y={450}
      //   width={150}
      //   height={200}
      x={300}
      y={550}
      width={250}
      height={350}
    />
  );
}
