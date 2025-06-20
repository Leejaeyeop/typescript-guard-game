"use client";
import { MAX_SIZE } from "@/constants/sizes";
import { useRoundManager } from "@/contexts/round/RoundProvider";
import { useTheme } from "next-themes";
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
  useCallback,
} from "react";

// 2. 테마별로 에셋 경로를 구조화
const themedSpritesPath = {
  light: {
    idle: "assets/sprites/background/light/idle/idle.jpeg",
    guard1: "assets/sprites/background/light/guard/guard1.jpeg",
    guard2: "assets/sprites/background/light/guard/guard2.jpeg",
    guard3: "assets/sprites/background/light/guard/guard3.jpeg",
    guard4: "assets/sprites/background/light/guard/guard4.jpeg",
    guard5: "assets/sprites/background/light/guard/guard5.jpeg",
    guard6: "assets/sprites/background/light/guard/guard6.jpeg",
    guard7: "assets/sprites/background/light/guard/guard7.jpeg",
  },
  dark: {
    // 다크 모드용 에셋 경로
    idle1: "assets/sprites/background/dark/idle/idle1.jpeg",
    idle2: "assets/sprites/background/dark/idle/idle2.jpeg",
    idle3: "assets/sprites/background/dark/idle/idle3.jpeg",
    idle4: "assets/sprites/background/dark/idle/idle4.jpeg",
    idle5: "assets/sprites/background/dark/idle/idle5.jpeg",
    guard1: "assets/sprites/background/dark/guard/guard1.jpeg",
    guard2: "assets/sprites/background/dark/guard/guard2.jpeg",
    guard3: "assets/sprites/background/dark/guard/guard3.jpeg",
    guard4: "assets/sprites/background/dark/guard/guard4.jpeg",
    guard5: "assets/sprites/background/dark/guard/guard5.jpeg",
    guard6: "assets/sprites/background/dark/guard/guard6.jpeg",
    guard7: "assets/sprites/background/dark/guard/guard7.jpeg",
    guardIdle1: "assets/sprites/background/dark/guard_idle/guard_idle1.jpeg",
    guardIdle2: "assets/sprites/background/dark/guard_idle/guard_idle2.jpeg",
    guardIdle3: "assets/sprites/background/dark/guard_idle/guard_idle3.jpeg",
    guardIdle4: "assets/sprites/background/dark/guard_idle/guard_idle4.jpeg",
  },
};

export type BackgroundSpriteHandle = {
  playGuardAnimation: () => void;
  playIdleAnimation: () => void;
};

interface BackgroundSpriteProps {
  ref: Ref<BackgroundSpriteHandle>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

type ThemedSpritesPath = typeof themedSpritesPath;

type MapToFrameObject<T> = {
  [K in keyof T]: FrameObject;
};

type AnimationMap = {
  [Theme in keyof ThemedSpritesPath]: MapToFrameObject<
    ThemedSpritesPath[Theme]
  >;
};

const ANIMATION_SPEED = 0.15;

export function BackgroundSprite({ ref, setIsLoading }: BackgroundSpriteProps) {
  const spriteRef = useRef<AnimatedSprite>(null);
  const animations = useRef<AnimationMap>(null);
  const currentAnimation = useRef<"IDLE" | "GUARD">("IDLE");

  const [textures, setTextures] = useState<AnimatedSpriteFrames>([
    Texture.EMPTY,
  ]);
  const { roundStateDispatch } = useRoundManager();
  const [loop, setLoop] = useState(true);

  const { resolvedTheme } = useTheme();

  // idle
  const playIdleAnimation = useCallback(() => {
    if (!animations.current) return;

    currentAnimation.current = "IDLE";

    if (resolvedTheme === "dark") {
      setTextures([
        animations.current.dark.idle1,
        animations.current.dark.idle2,
        animations.current.dark.idle3,
        animations.current.dark.idle4,
        animations.current.dark.idle5,
      ]);
    } else {
      setTextures([animations.current.light.idle]);
    }

    setLoop(true);
  }, [resolvedTheme]);

  // guard -> guard_idle -> guard -> idle (역순)
  const playGuardAnimation = useCallback(() => {
    if (!animations.current) return;
    currentAnimation.current = "GUARD";
    if (resolvedTheme === "dark") {
      setTextures([
        animations.current.dark.guard1,
        animations.current.dark.guard2,
        animations.current.dark.guard3,
        animations.current.dark.guard4,
        animations.current.dark.guard5,
        animations.current.dark.guard6,
        animations.current.dark.guard7,
        animations.current.dark.guardIdle1,
        animations.current.dark.guardIdle2,
        animations.current.dark.guardIdle3,
        animations.current.dark.guardIdle4,
        animations.current.dark.guard7,
        animations.current.dark.guard6,
        animations.current.dark.guard5,
        animations.current.dark.guard4,
        animations.current.dark.guard3,
        animations.current.dark.guard2,
        animations.current.dark.guard1,
      ]);
    } else {
      setTextures([
        animations.current.light.guard1,
        animations.current.light.guard2,
        animations.current.light.guard3,
        animations.current.light.guard4,
        animations.current.light.guard5,
        animations.current.light.guard6,
        animations.current.light.guard7,
        animations.current.light.guard7,
        animations.current.light.guard7,
        animations.current.light.guard7,
        animations.current.light.guard7,
        animations.current.light.guard7,
        animations.current.light.guard6,
        animations.current.light.guard5,
        animations.current.light.guard4,
        animations.current.light.guard3,
        animations.current.light.guard2,
        animations.current.light.guard1,
      ]);
    }

    setLoop(false);
  }, [resolvedTheme]);

  useEffect(() => {
    if (currentAnimation.current === "IDLE") {
      playIdleAnimation();
    } else {
      playGuardAnimation();
    }
  }, [resolvedTheme, playIdleAnimation, playGuardAnimation]);

  useImperativeHandle(ref, () => {
    return {
      playGuardAnimation,
      playIdleAnimation,
    };
  }, [playGuardAnimation, playIdleAnimation]);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    const loadAssets = async () => {
      // 각 테마별로 에셋 번들을 추가
      Assets.addBundle("light-animations", themedSpritesPath.light);
      Assets.addBundle("dark-animations", themedSpritesPath.dark);

      // 두 번들을 모두 로드
      const [lightAssets, darkAssets] = await Promise.all([
        Assets.loadBundle("light-animations"),
        Assets.loadBundle("dark-animations"),
      ]);

      animations.current = {
        light: lightAssets,
        dark: darkAssets,
      };

      setIsLoading(false);
      playIdleAnimation();
    };

    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
