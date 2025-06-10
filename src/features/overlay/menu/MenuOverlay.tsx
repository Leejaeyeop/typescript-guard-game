import { MenuButton } from "@/components/ui/button/MenuButton";
import { createContext, ReactNode, useContext, useState } from "react";

type MenuOverlayContextType = {
  pushMenuContext: (context: ReactNode) => void;
};

const MenuOverlayContext = createContext<MenuOverlayContextType | undefined>(
  undefined
);

export function MenuOverlay({ children }: { children: ReactNode }) {
  // children is entry component ex) main, result
  const [menuContextDepth, setMenuContextDepth] = useState<ReactNode[]>([
    children,
  ]);

  const pushMenuContext = (context: ReactNode) => {
    setMenuContextDepth((prev) => [...prev, context]);
  };

  const popMenuContext = () => {
    setMenuContextDepth((prevItems) => {
      const newItems = [...prevItems];
      newItems.pop();
      return newItems;
    });
  };

  return (
    <MenuOverlayContext.Provider
      value={{
        pushMenuContext,
      }}
    >
      <div
        role="dialog" // 이 영역이 대화상자임을 명시
        aria-modal="true" // 다른 인터페이스와 상호작용을 차단하는 모달임을 명시
        aria-labelledby="menu-heading" // 대화상자의 제목을 지정
        className="absolute top-[15%] left-[15%] text-black w-[70%] h-[70%] bg-[url('/assets/ui/paper.webp')] bg-cover bg-center z-10 flex items-center justify-center"
      >
        {/* 스크린 리더만 읽는 숨겨진 제목 */}
        <h2 id="menu-heading" className="sr-only">
          menu
        </h2>
        <div
          id="menu-content"
          className="flex flex-col h-[60%] items-center gap-4 w-1/2 [font-size:_clamp(1rem,1.3vw,1.5em)] font-bold p-[4%] overflow-y-auto"
        >
          {/* last components */}
          {menuContextDepth.at(-1)}
          {/* menu navigation button */}
          {menuContextDepth.length > 1 && (
            <div className="w-full grow flex items-end">
              <MenuButton aria-label="Go Back" onClick={() => popMenuContext()}>
                Go Back
              </MenuButton>
            </div>
          )}
        </div>
      </div>
    </MenuOverlayContext.Provider>
  );
}

export function useMenuOverlay() {
  const context = useContext(MenuOverlayContext);
  if (!context) {
    throw new Error("useRoundManager must be used within a CounterProvider");
  }
  return context;
}
