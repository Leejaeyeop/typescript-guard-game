"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { BackgroundSprite } from "./sprites/BackgroundSprite";
import { useRef, useEffect } from "react";
import { MAX_SIZE, MIN_SIZE } from "./constants/sizes";
import { VisitorSprite } from "./sprites/VisitorSprite";
// extend tells @pixi/react what Pixi.js components are available
extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

export function App() {
  const appRef = useRef<ApplicationRef>(null);

  return (
    <Application
      className="w-full h-full"
      ref={appRef}
      width={MAX_SIZE}
      height={MAX_SIZE}
    >
      <pixiContainer anchor={0.5}>
        <BackgroundSprite />
        <VisitorSprite />
      </pixiContainer>
    </Application>
  );
}

export default function AppContainer() {
  const appContainerRef = useRef<HTMLDivElement>(null);

  // 2. 높이를 계산하고 설정하는 함수
  const adjustAppContainerHeight = () => {
    if (!appContainerRef.current) return;

    const parentWidth = appContainerRef.current.parentElement!.offsetWidth; // 부모 요소의 실제 너비
    const viewportHeight = window.innerHeight; // 뷰포트의 실제 높이

    // w-full (부모 너비) 와 100vh (뷰포트 높이) 중 더 작은 값
    let minDimension = Math.min(parentWidth, viewportHeight);

    if (minDimension < MIN_SIZE) {
      minDimension = MIN_SIZE;
    }

    appContainerRef.current.style.width = minDimension + "px";
    appContainerRef.current.style.height = minDimension + "px";
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 높이 설정
    adjustAppContainerHeight();

    // 윈도우 리사이즈 이벤트에 리스너 등록
    window.addEventListener("resize", adjustAppContainerHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제 (클린업 함수)
    return () => {
      window.removeEventListener("resize", adjustAppContainerHeight);
    };
  }, []);

  return (
    <div className="relative" ref={appContainerRef}>
      <App />
      <footer className="absolute w-full bottom-0 flex justify-center">
        <div className="border-white border-4 h-3/12 text-white p-4 w-2/3 backdrop-blur-md overflow-auto">
          <h1>Our Type</h1>
          <p>type Foo = string</p>
          <button>Enter</button>
          <button>Guard</button>
        </div>
      </footer>
    </div>
  );
}
