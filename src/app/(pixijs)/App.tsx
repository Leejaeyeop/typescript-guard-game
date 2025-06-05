"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { BackgroundSprite } from "./components/sprites/BackgroundSprite";
import { useEffect, useRef } from "react";
import { MAX_SIZE } from "./constants/sizes";
import { VisitorSprite } from "./components/sprites/VisitorSprite";
import { useRoundManager } from "./hooks/use-round-manager";
import { useResize } from "./hooks/use-resize";
// extend tells @pixi/react what Pixi.js components are available
import { RoundProvider } from "./hooks/use-round-manager";
import { StageProvider, useStageManager } from "./hooks/use-stage-manager";

import { useShallow } from "zustand/shallow";

import { useMenuStore } from "@/store/useMenuStore";

import { MainMenu } from "@/components/overlay/menu/MainMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import MonacoEditor from "@/components/overlay/MonacoEditor";
import { ActionBar } from "@/components/overlay/actionBar/ActionBar";
import { TopHUD } from "@/components/overlay/hud/TopHUD";
import { RoundAnswerResult } from "@/components/overlay/result/RoundAnswerResult";

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

function HTMLOverlay() {
  const { curRoundQuiz, isVisibleTopHUD, isPaused } = useStageManager();

  const { isVisibleAnswer, isVisibleActionBar, isVisibleRoundResult } =
    useRoundManager();

  const [isMenuOpen, menuOverlay] = useMenuStore(
    useShallow((state) => [state.isMenuOpen, state.menuOverlay])
  );
  return (
    <>
      {/* top HUD */}
      {isVisibleTopHUD && <TopHUD />}
      {/* question */}
      <div
        className={`absolute bottom-[45%] h-1/5 w-1/2 left-1/4 ${
          !isVisibleAnswer && "hidden"
        }`}
      >
        <div className="relative inline-block bg-white h-full w-full px-2 py-2 rounded-xl shadow-md">
          {/* {curRoundQuiz?.answer} */}
          <MonacoEditor value={curRoundQuiz?.question} />
          <div className="absolute left-1/2 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
        </div>
      </div>
      {/* action bar */}
      {isVisibleActionBar && <ActionBar />}
      {/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {isPaused && (
        <div className="absolute top-0 w-full h-full backdrop-blur-md" />
      )}
      {/* answer result */}
      {isVisibleRoundResult && <RoundAnswerResult />}
    </>
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
