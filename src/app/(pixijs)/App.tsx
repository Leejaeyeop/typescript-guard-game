"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { BackgroundSprite } from "./components/sprites/BackgroundSprite";
import { useRef } from "react";
import { MAX_SIZE } from "./constants/sizes";
import { VisitorSprite } from "./components/sprites/VisitorSprite";
import { useRoundManager } from "./hooks/use-round-manager";
import { useResize } from "./hooks/use-resize";
// extend tells @pixi/react what Pixi.js components are available
import { RoundProvider } from "./hooks/use-round-manager";
import { StageProvider, useStageManager } from "./hooks/use-stage-manager";

import { MenuSprite } from "./components/sprites/MenuSprite";
import { useAppStore } from "../../store/useAppStore";
import { useShallow } from "zustand/shallow";
import { MenuOverlay } from "@/components/overlay/MenuOverlay";
extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

export default function AppContainer() {
  const appContainerRef = useRef<HTMLDivElement>(null);
  useResize(appContainerRef);

  return (
    <div className="relative" ref={appContainerRef}>
      <StageProvider>
        <RoundProvider>
          <App />
          <HTMLElements />
        </RoundProvider>
      </StageProvider>
    </div>
  );
}

function HTMLElements() {
  const { curRoundQuiz } = useStageManager();

  const { curRoundPhase, submitAnswer } = useRoundManager();

  const [isMenuOpen] = useAppStore(
    useShallow((state) => [state.isMenuOpen, state.setIsMenuOpen])
  );
  return (
    <>
      {/* 말풍선 */}
      {curRoundPhase === "PRESENTING_QUESTION" && (
        <>
          <div className="absolute bottom-[45%] left-1/2">
            <div className="relative inline-block bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md">
              {curRoundQuiz.answer}
              <div className="absolute left-4 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
            </div>
          </div>

          <footer className="absolute bottom-0 grid grid-cols-5 gap-4 w-full h-1/6">
            <button
              className="col-span-1 bg-green-600 border-2 rounded-2xl disabled:bg-green-300"
              disabled={curRoundPhase !== "PRESENTING_QUESTION"}
              onClick={() => submitAnswer(true)}
            >
              Pass
            </button>
            <div className="col-span-3 border-white border-4 text-white p-2 flex-grow backdrop-blur-md overflow-며새">
              <h1>Our Type</h1>
              <p> {curRoundQuiz.question}</p>
            </div>
            <button
              className="col-span-1 bg-red-500 disabled:bg-red-300 border-2 rounded-2xl"
              disabled={curRoundPhase !== "PRESENTING_QUESTION"}
              onClick={() => submitAnswer(false)}
            >
              Guard
            </button>
          </footer>
        </>
      )}
      {/* menu */}
      {isMenuOpen && <MenuOverlay />}
    </>
  );
}

function App() {
  const appRef = useRef<ApplicationRef>(null);
  const { backgroundRef, visitorRef, showVisitor } = useRoundManager();
  const [isMenuOpen] = useAppStore(useShallow((state) => [state.isMenuOpen]));

  return (
    <Application
      className="w-full h-full"
      ref={appRef}
      width={MAX_SIZE}
      height={MAX_SIZE}
    >
      <pixiContainer anchor={0.5}>
        <BackgroundSprite ref={backgroundRef} />
        {showVisitor && <VisitorSprite ref={visitorRef} />}
        {isMenuOpen && <MenuSprite />}
      </pixiContainer>
    </Application>
  );
}
