import { MenuOverlay } from "../MenuOverlay";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useStageManager } from "@/contexts/StageProvider";
import { useEffect } from "react";
import { MenuButton } from "@/components/ui/button/MenuButton";

function PauseMenuContent() {
  const { closeMenu } = useMenuStore();
  const { setActiveScene } = useAppStore();
  const { initStage, stageStateDispatch } = useStageManager();

  useEffect(() => {
    stageStateDispatch({ type: "TOGGLE_PAUSE", payload: true });

    return () => {
      stageStateDispatch({ type: "TOGGLE_PAUSE", payload: false });
    };
  }, [stageStateDispatch]);

  return (
    <>
      <MenuButton aria-label="Continue" onClick={() => closeMenu()}>
        Continue
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
        aria-label="Back to main"
        onClick={() => {
          setActiveScene(SCENE_IDS.MAIN);
        }}
      >
        Back to main
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
