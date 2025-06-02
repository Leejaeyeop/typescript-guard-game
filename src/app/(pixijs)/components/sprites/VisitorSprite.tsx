import { Assets, Texture } from "pixi.js";
import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MAX_SIZE } from "../../constants/sizes";
import { useTick } from "@pixi/react";
import { useRoundManager } from "../../hooks/use-round-manager";
// import { useTick } from "@pixi/react";

function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

export type VisitorSpriteHandle = {
  setStatus: (status: "appear" | "disappear" | "idle") => void;
};

export function VisitorSprite({ ref }: { ref: Ref<VisitorSpriteHandle> }) {
  // The Pixi.js `Sprite`
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [positionY, setPositionY] = useState(MAX_SIZE);
  const { updatePendingAnimationsCount, setShowVisitor } = useRoundManager();
  const status = useRef<"appear" | "disappear" | "idle">("appear");

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
    if (status.current === "appear") {
      if (positionY > MAX_SIZE / 1.25) {
        setPositionY((prev) => prev - 4);
      } else {
        status.current = "idle";
        updatePendingAnimationsCount("decrement");
      }
    } else if (status.current === "disappear") {
      if (positionY < MAX_SIZE + 200) {
        setPositionY((prev) => prev + 4);
      } else {
        status.current = "idle";
        setShowVisitor(false);
        updatePendingAnimationsCount("decrement");
      }
    }
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        setStatus: (newState) => {
          status.current = newState;
        },
      };
    },
    []
  );

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
