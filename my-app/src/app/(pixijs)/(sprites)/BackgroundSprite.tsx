"use client";
import { AnimatedSprite, AnimatedSpriteFrames, Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";

export function BackgroundSprite() {
  const spriteRef = useRef<AnimatedSprite>(null);
  const [textures, setTextures] = useState<AnimatedSpriteFrames>([
    Texture.EMPTY,
  ]);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    Assets.addBundle("animationAssets", {
      idle1: "assets/idle1.jpeg",
      idle2: "assets/idle2.jpeg",
      idle3: "assets/idle3.jpeg",
      idle4: "assets/idle4.jpeg",
      idle5: "assets/idle5.jpeg",
      guard1: "assets/guard1.jpeg",
      guard2: "assets/guard2.jpeg",
      guard3: "assets/guard3.jpeg",
      guard4: "assets/guard4.jpeg",
      guard5: "assets/guard5.jpeg",
      guard6: "assets/guard6.jpeg",
      guard7: "assets/guard7.jpeg",
      guardIdle1: "assets/guard_idle1.jpeg",
      guardIdle2: "assets/guard_idle2.jpeg",
      guardIdle3: "assets/guard_idle3.jpeg",
      guardIdle4: "assets/guard_idle4.jpeg",
    });

    Assets.loadBundle("animationAssets").then((result) => {
      setTextures([
        result.idle1,
        result.idle2,
        result.idle3,
        result.idle4,
        result.idle5,
        // result.guard1,
        // result.guard2,
        // result.guard3,
        // result.guard4,
        // result.guard5,
        // result.guard6,
        // result.guard7,
      ]);
    });
  }, []);

  // 에니메이션 실행
  useEffect(() => {
    spriteRef.current?.play();
  }, [textures]);

  return (
    <pixiAnimatedSprite
      ref={spriteRef}
      anchor={0.5}
      // eventMode={"static"}
      // onClick={(event) => setIsActive(!isActive)}
      // onPointerOver={(event) => setIsHover(true)}
      // onPointerOut={(event) => setIsHover(false)}
      // scale={isActive ? 1 : 1.5}
      textures={textures}
      loop={true}
      animationSpeed={0.15}
      // 컨테이너 x 중간값
      x={300}
      // 컨테이너 y 중간값
      y={300}
      width={600}
      height={600}
    />
  );
}
