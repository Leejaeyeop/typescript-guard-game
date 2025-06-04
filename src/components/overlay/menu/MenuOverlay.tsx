import { createContext, ReactNode, useContext, useState } from "react";
import { MenuButton } from "../button/MenuButton";

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
      <div className="absolute top-[15%] left-[20%] text-black w-[70%] h-[70%] bg-[url('/assets/ui/paper.png')] bg-cover bg-center px-[20%] py-[15%] z-10">
        <div className="flex flex-col h-full grow items-center gap-4 w-full [font-size:_clamp(1rem,1.3vw,2em)] font-bold">
          {/* last components */}
          {menuContextDepth.at(-1)}
          {menuContextDepth.length > 1 && (
            <div className="w-full grow flex items-end">
              <MenuButton onClick={() => popMenuContext()}>Go Back</MenuButton>
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
