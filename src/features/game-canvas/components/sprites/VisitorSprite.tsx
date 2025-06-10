import { Assets, Texture } from "pixi.js";
import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTick } from "@pixi/react";
import { MAX_SIZE } from "@/constants/sizes";
import { useRoundManager } from "@/contexts/RoundProvider";
// import { useTick } from "@pixi/react";

function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

export type VisitorSpriteHandle = {
  setStatus: (status: "appear" | "disappear" | "idle") => void;
};

interface VisitorSpriteProps {
  ref: Ref<VisitorSpriteHandle>;
}

const IDLE_POSITION_Y = MAX_SIZE / 1.25;
const DISAPPEAR_POSITION_Y = MAX_SIZE + 200;
const POSITION_VARIATION_PER_FRAME = 5;

export function VisitorSprite({ ref }: VisitorSpriteProps) {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [positionY, setPositionY] = useState(MAX_SIZE);
  const { roundStateDispatch } = useRoundManager();
  const status = useRef<"appear" | "disappear" | "idle">("appear");

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(
        `assets/sprites/visitors/visitor${getRandomNumber()}.webp`
      ).then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useTick(() => {
    if (status.current === "appear") {
      // position 이 감소 되어야 스프라이트가 위로 상승함
      if (positionY > IDLE_POSITION_Y) {
        setPositionY((prev) => prev - POSITION_VARIATION_PER_FRAME);
      } else {
        status.current = "idle";
        roundStateDispatch({ type: "ANIMATION_FINISHED" });
      }
    } else if (status.current === "disappear") {
      if (positionY < DISAPPEAR_POSITION_Y) {
        setPositionY((prev) => prev + POSITION_VARIATION_PER_FRAME);
      } else {
        status.current = "idle";
        roundStateDispatch({ type: "ANIMATION_FINISHED" });
      }
    }
  });

  useImperativeHandle(ref, () => {
    return {
      setStatus: (newState) => {
        status.current = newState;
      },
    };
  }, []);

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
