"use client";

import { Application, extend, useTick } from "@pixi/react";
import { Container, Graphics, Sprite, AnimatedSprite } from "pixi.js";
import { BackgroundSprite } from "./(sprites)/BackgroundSprite";
import { VisitorSprite } from "./(sprites)/VisitorSprite";
import { useEffect, useRef, useState } from "react";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
  AnimatedSprite,
});

export default function App() {
  const pixiContainerRef = useRef<Container>(null);
  const [width, setWidth] = useState<string>("1px");
  useEffect(() => {
    // window.addEventListener("resize", () => {});
  }, []);

  return (
    // <Application
    //   className={`h-full min-h-[256px] min-w-[256px] w-[calc(100%-8rem)]`}
    // >
    // h -> 1:1 비율
    <Application
      className=" aspect-square min-h-[256px] min-w-[256px]"
      width={600}
      height={600}
    >
      <pixiContainer ref={pixiContainerRef} anchor={0.5}>
        <BackgroundSprite />
        <VisitorSprite />
      </pixiContainer>
    </Application>
  );
}
