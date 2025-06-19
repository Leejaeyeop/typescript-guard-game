"use client";

import { useRef, useState } from "react";

import { RoundProvider } from "../../contexts/round/RoundProvider";
import { StageProvider } from "../../contexts/stage/StageProvider";

import HTMLOverlay from "@/features/overlay";

import { Quiz } from "@/types/quiz";
import PixiCanvas from "../game-canvas/PixiCanvas";
import { useResize } from "./hooks/use-resize";
import { useInitialMenu } from "./hooks/use-initial-menu";

interface GameViewProps {
  totalQuizzes: Quiz[];
}

export default function GameView({ totalQuizzes }: GameViewProps) {
  const gameViewRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useResize(gameViewRef);
  useInitialMenu();

  return (
    <div id="gameView" className="relative" ref={gameViewRef}>
      {isLoading && (
        <div className="absolute top-0 z-[999] w-full h-full flex items-center justify-center bg-black">
          <p className="text-white text-6xl animate-pulse">Loading...</p>
        </div>
      )}
      <StageProvider totalQuizzes={totalQuizzes}>
        <RoundProvider>
          <PixiCanvas setIsLoading={setIsLoading} />
          <div className={`${isLoading && "hidden"}`}>
            <HTMLOverlay />
          </div>
        </RoundProvider>
      </StageProvider>
    </div>
  );
}
