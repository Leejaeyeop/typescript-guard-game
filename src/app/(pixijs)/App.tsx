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

import OptionIcon from "@/assets/icons/options_icon.svg?react";
import { useMenuStore } from "@/store/useMenuStore";

import { PauseMenu } from "@/components/overlay/menu/PauseMenu";
import { MainMenu } from "@/components/overlay/menu/MainMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import MonacoEditor from "@/components/overlay/MonacoEditor";
import Image from "next/image";

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
  const { curRoundQuiz, isVisibleOption, isPaused } = useStageManager();

  const { curRoundPhase, submitAnswer, isVisibleAnswer, isVisibleActionBar } =
    useRoundManager();

  const [isMenuOpen, menuOverlay, setMenuOverlay, openMenu] = useMenuStore(
    useShallow((state) => [
      state.isMenuOpen,
      state.menuOverlay,
      state.setMenuOverlay,
      state.openMenu,
    ])
  );
  return (
    <>
      (
      <>
        {/* option 창 */}
        {isVisibleOption && (
          <div
            className="absolute top-0 right-0 w-1/12 h-1/12 hover:cursor-pointer p-2 opacity-50"
            onClick={() => {
              openMenu();
              setMenuOverlay(<PauseMenu />);
            }}
          >
            <OptionIcon fill="#808080" />
          </div>
        )}
        {/* answer */}
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
        {isVisibleActionBar && (
          <footer className="absolute bottom-0 gap-[5%] w-full h-1/6 flex justify-center">
            <button
              className="w-1/5 hover:cursor-pointer disabled:opacity-50"
              disabled={curRoundPhase !== "PRESENTING_QUESTION"}
              onClick={() => submitAnswer(true)}
            >
              <Image
                src="/assets/ui/pass_button.png"
                alt="pass_button"
                width={500}
                height={100}
              />
            </button>
            <button
              className="w-1/5 hover:cursor-pointer disabled:opacity-50"
              disabled={curRoundPhase !== "PRESENTING_QUESTION"}
              onClick={() => submitAnswer(false)}
            >
              <Image
                src="/assets/ui/guard_button.png"
                alt="pass_button"
                width={500}
                height={100}
              />
            </button>
          </footer>
        )}
      </>
      ){/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {isPaused && (
        <div className="absolute top-0 w-full h-full backdrop-blur-md"></div>
      )}
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
