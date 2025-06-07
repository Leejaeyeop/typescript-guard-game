"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MAX_SIZE } from "./constants/sizes";
import { useRoundManager } from "./hooks/use-round-manager";
import { useResize } from "./hooks/use-resize";
// extend tells @pixi/react what Pixi.js components are available
import { RoundProvider } from "./hooks/use-round-manager";
import { StageProvider } from "./hooks/use-stage-manager";

import { useMenuStore } from "@/store/useMenuStore";

import { MainMenu } from "@/components/overlay/menu/MainMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";

import HTMLOverlay from "@/components/overlay/HTMLOverlay";
import { BackgroundSprite } from "@/components/canvas/sprites/BackgroundSprite";
import { VisitorSprite } from "@/components/canvas/sprites/VisitorSprite";
import { Quiz } from "@/types/quiz";

extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

interface AppContainerInterface {
  totalQuizzes: Quiz[];
}

export default function AppContainer({ totalQuizzes }: AppContainerInterface) {
  const appContainerRef = useRef<HTMLDivElement>(null);
  useResize(appContainerRef);

  const { setMenuOverlay, openMenu } = useMenuStore();
  const { activeScene } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // main menu scene 설정 직후
  useEffect(() => {
    if (activeScene === SCENE_IDS.MAIN) {
      openMenu();
      setMenuOverlay(<MainMenu />);
    }
  }, [activeScene]);

  return (
    <div id="appContainer" className="relative" ref={appContainerRef}>
      {isLoading && (
        <div className="absolute top-0 z-[999] w-full h-full flex items-center justify-center bg-black">
          <p className="text-white text-6xl animate-pulse">Loading...</p>
        </div>
      )}
      <StageProvider totalQuizzes={totalQuizzes}>
        <RoundProvider>
          <App setIsLoading={setIsLoading} />
          <div className={`${isLoading && "opacity-0"}`}>
            <HTMLOverlay />
          </div>
        </RoundProvider>
      </StageProvider>
    </div>
  );
}

interface AppProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
function App({ setIsLoading }: AppProps) {
  const appRef = useRef<ApplicationRef>(null);
  const { backgroundRef, visitorRef, isVisibleVisitor } = useRoundManager();

  return (
    <Application
      className="w-full h-full"
      ref={appRef}
      width={MAX_SIZE}
      height={MAX_SIZE}
    >
      <pixiContainer anchor={0.5}>
        <BackgroundSprite setIsLoading={setIsLoading} ref={backgroundRef} />
        {isVisibleVisitor && <VisitorSprite ref={visitorRef} />}
      </pixiContainer>
    </Application>
  );
}
