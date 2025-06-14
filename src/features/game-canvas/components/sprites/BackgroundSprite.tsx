"use client";
import { MAX_SIZE } from "@/constants/sizes";
import { useRoundManager } from "@/contexts/RoundProvider";
import {
  AnimatedSprite,
  AnimatedSpriteFrames,
  Assets,
  FrameObject,
  Texture,
} from "pixi.js";
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  Ref,
  Dispatch,
  SetStateAction,
} from "react";

const ANIMATION_SPEED = 0.15;

const spritesPath = {
  idle1: "assets/sprites/background/idle/idle1.jpeg",
  idle2: "assets/sprites/background/idle/idle2.jpeg",
  idle3: "assets/sprites/background/idle/idle3.jpeg",
  idle4: "assets/sprites/background/idle/idle4.jpeg",
  idle5: "assets/sprites/background/idle/idle5.jpeg",
  guard1: "assets/sprites/background/guard/guard1.jpeg",
  guard2: "assets/sprites/background/guard/guard2.jpeg",
  guard3: "assets/sprites/background/guard/guard3.jpeg",
  guard4: "assets/sprites/background/guard/guard4.jpeg",
  guard5: "assets/sprites/background/guard/guard5.jpeg",
  guard6: "assets/sprites/background/guard/guard6.jpeg",
  guard7: "assets/sprites/background/guard/guard7.jpeg",
  guardIdle1: "assets/sprites/background/guard_idle/guard_idle1.jpeg",
  guardIdle2: "assets/sprites/background/guard_idle/guard_idle2.jpeg",
  guardIdle3: "assets/sprites/background/guard_idle/guard_idle3.jpeg",
  guardIdle4: "assets/sprites/background/guard_idle/guard_idle4.jpeg",
} as const;

export type BackgroundSpriteHandle = {
  playGuardAnimation: () => void;
  playIdleAnimation: () => void;
};

interface BackgroundSpriteProps {
  ref: Ref<BackgroundSpriteHandle>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export function BackgroundSprite({ ref, setIsLoading }: BackgroundSpriteProps) {
  const spriteRef = useRef<AnimatedSprite>(null);
  const animations =
    useRef<Record<keyof typeof spritesPath, FrameObject>>(null);
  const [textures, setTextures] = useState<AnimatedSpriteFrames>([
    Texture.EMPTY,
  ]);
  const { roundStateDispatch } = useRoundManager();
  const [loop, setLoop] = useState(true);

  // idle
  const playIdleAnimation = () => {
    if (!animations.current) return;
    setTextures([
      animations.current.idle1,
      animations.current.idle2,
      animations.current.idle3,
      animations.current.idle4,
      animations.current.idle5,
    ]);
    setLoop(true);
  };

  // guard -> guard_idle -> guard -> idle (역순)
  const playGuardAnimation = () => {
    if (!animations.current) return;
    setTextures([
      animations.current.guard1,
      animations.current.guard2,
      animations.current.guard3,
      animations.current.guard4,
      animations.current.guard5,
      animations.current.guard6,
      animations.current.guard7,
      animations.current.guardIdle1,
      animations.current.guardIdle2,
      animations.current.guardIdle3,
      animations.current.guardIdle4,
      animations.current.guard7,
      animations.current.guard6,
      animations.current.guard5,
      animations.current.guard4,
      animations.current.guard3,
      animations.current.guard2,
      animations.current.guard1,
    ]);
    setLoop(false);
  };

  useImperativeHandle(ref, () => {
    return {
      playGuardAnimation,
      playIdleAnimation,
    };
  }, []);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    Assets.addBundle("animationAssets", spritesPath);

    Assets.loadBundle("animationAssets").then((result) => {
      animations.current = result;
      playIdleAnimation();
      setIsLoading(false);
    });
  }, [setIsLoading]);

  // 에니메이션 실행
  useEffect(() => {
    spriteRef.current?.play();
  }, [textures]);

  return (
    <pixiAnimatedSprite
      ref={spriteRef}
      anchor={0.5}
      textures={textures}
      loop={loop}
      animationSpeed={ANIMATION_SPEED}
      x={MAX_SIZE / 2}
      y={MAX_SIZE / 2}
      width={MAX_SIZE}
      height={MAX_SIZE}
      onComplete={() => {
        playIdleAnimation();
        roundStateDispatch({ type: "ANIMATION_FINISHED" });
      }}
    />
  );
}
