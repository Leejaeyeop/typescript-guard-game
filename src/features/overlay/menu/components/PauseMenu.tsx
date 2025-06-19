import { MenuOverlay } from "../MenuOverlay";
import { useMenuStore } from "@/store/useMenuStore";
import { useStageManager } from "@/contexts/stage/StageProvider";
import { useEffect } from "react";
import { MenuButton } from "@/components/ui/button/MenuButton";

function PauseMenuContent() {
  const { closeMenu } = useMenuStore();
  const { initStage, stageStateDispatch, quitStage } = useStageManager();

  useEffect(() => {
    stageStateDispatch({ type: "TOGGLE_PAUSE", payload: true });

    return () => {
      stageStateDispatch({ type: "TOGGLE_PAUSE", payload: false });
    };
  }, [stageStateDispatch]);

  return (
    <>
      <MenuButton aria-label="Resume" onClick={() => closeMenu()}>
        Resume
      </MenuButton>
      <MenuButton
        aria-label="Restart Game"
        onClick={() => {
          initStage();
          closeMenu();
        }}
      >
        Restart Game
      </MenuButton>
      <MenuButton
        aria-label="Quit"
        onClick={() => {
          quitStage();
        }}
      >
        Quit
      </MenuButton>
    </>
  );
}

export function PauseMenu() {
  return (
    <MenuOverlay>
      <PauseMenuContent></PauseMenuContent>
    </MenuOverlay>
  );
}
