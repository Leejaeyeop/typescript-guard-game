import { BackgroundSprite } from "@/features/game-canvas/components/sprites/BackgroundSprite";
import { VisitorSprite } from "@/features/game-canvas/components/sprites/VisitorSprite";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { Dispatch, SetStateAction, useRef } from "react";
import { MAX_SIZE } from "@/constants/sizes";
import { useRoundManager } from "@/contexts/round/RoundProvider";

extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

interface AppProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
export default function PixiCanvas({ setIsLoading }: AppProps) {
  const appRef = useRef<ApplicationRef>(null);
  const { backgroundRef, visitorRef, roundState } = useRoundManager();

  return (
    <Application
      className="w-full h-full"
      ref={appRef}
      width={MAX_SIZE}
      height={MAX_SIZE}
    >
      <pixiContainer anchor={0.5}>
        <BackgroundSprite setIsLoading={setIsLoading} ref={backgroundRef} />
        {roundState.isVisibleVisitor && <VisitorSprite ref={visitorRef} />}
      </pixiContainer>
    </Application>
  );
}
