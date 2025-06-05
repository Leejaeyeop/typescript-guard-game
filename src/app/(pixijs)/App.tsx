"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { useEffect, useRef } from "react";
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

extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

export default function AppContainer() {
  const appContainerRef = useRef<HTMLDivElement>(null);
  const { setMenuOverlay, openMenu } = useMenuStore();
  const { activeScene } = useAppStore();

  useResize(appContainerRef);

  // main menu scene 설정 직후
  useEffect(() => {
    if (activeScene === SCENE_IDS.MAIN) {
      openMenu();
      setMenuOverlay(<MainMenu />);
    }
  }, [activeScene]);

  return (
    <div className="relative" ref={appContainerRef}>
      <StageProvider>
        <RoundProvider>
          <App />
          <HTMLOverlay />
        </RoundProvider>
      </StageProvider>
    </div>
  );
}

function App() {
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
        <BackgroundSprite ref={backgroundRef} />
        {isVisibleVisitor && <VisitorSprite ref={visitorRef} />}
      </pixiContainer>
    </Application>
  );
}
