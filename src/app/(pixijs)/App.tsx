"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { BackgroundSprite } from "./components/sprites/BackgroundSprite";
import { useRef, useEffect } from "react";
import { MAX_SIZE, MIN_SIZE } from "./constants/sizes";
import { VisitorSprite } from "./components/sprites/VisitorSprite";
// extend tells @pixi/react what Pixi.js components are available
extend({
  Graphics,
  Sprite,
  AnimatedSprite,
  Container,
});

// 각 round 단위로 퀴즈 관리

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
      {/* 말풍선 */}
      {/* <div className="absolute bottom-[45%] left-1/2">
        <div className="relative inline-block bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md">
          const foo:Foo = "1"
          <div className="absolute left-4 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
        </div>
      </div> */}
      <footer className="absolute bottom-0 grid grid-cols-5 gap-4 w-full h-1/6">
        <button className="col-span-1 bg-green-600 border-2 rounded-2xl">
          Pass
        </button>
        <div className="col-span-3 border-white border-4 text-white p-2 flex-grow backdrop-blur-md overflow-scroll">
          <h1>Our Type</h1>
          <p>type Foo = string</p>
        </div>
        <button className="col-span-1 bg-red-500 border-2 rounded-2xl">
          Guard
        </button>
      </footer>
    </div>
  );
}

function App() {
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
