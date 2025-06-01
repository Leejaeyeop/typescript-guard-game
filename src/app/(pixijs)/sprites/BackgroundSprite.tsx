"use client";
import { AnimatedSprite, AnimatedSpriteFrames, Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { MAX_SIZE } from "../constants/sizes";
export function BackgroundSprite() {
  const spriteRef = useRef<AnimatedSprite>(null);
  const [textures, setTextures] = useState<AnimatedSpriteFrames>([
    Texture.EMPTY,
  ]);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    Assets.addBundle("animationAssets", {
      idle1: "assets/background/idle/idle1.jpeg",
      idle2: "assets/background/idle/idle2.jpeg",
      idle3: "assets/background/idle/idle3.jpeg",
      idle4: "assets/background/idle/idle4.jpeg",
      idle5: "assets/background/idle/idle5.jpeg",
      guard1: "assets/background/guard/guard1.jpeg",
      guard2: "assets/background/guard/guard2.jpeg",
      guard3: "assets/background/guard/guard3.jpeg",
      guard4: "assets/background/guard/guard4.jpeg",
      guard5: "assets/background/guard/guard5.jpeg",
      guard6: "assets/background/guard/guard6.jpeg",
      guard7: "assets/background/guard/guard7.jpeg",
      guardIdle1: "assets/background/guard_idle/guard_idle1.jpeg",
      guardIdle2: "assets/background/guard_idle/guard_idle2.jpeg",
      guardIdle3: "assets/background/guard_idle/guard_idle3.jpeg",
      guardIdle4: "assets/background/guard_idle/guard_idle4.jpeg",
    });

    Assets.loadBundle("animationAssets").then((result) => {
      setTextures([
        result.idle1,
        result.idle2,
        result.idle3,
        result.idle4,
        result.idle5,
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
      textures={textures}
      loop={true}
      animationSpeed={0.15}
      x={MAX_SIZE / 2}
      y={MAX_SIZE / 2}
      width={MAX_SIZE}
      height={MAX_SIZE}
    />
  );
}
