import { MenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";
import { useEffect } from "react";

function PauseMenuContent() {
  const { closeMenu } = useMenuStore();
  const { setActiveScene } = useAppStore();
  const { initStage, setIsPaused } = useStageManager();

  useEffect(() => {
    setIsPaused(true);

    return () => {
      setIsPaused(false);
    };
  }, []);

  return (
    <>
      <MenuButton onClick={() => closeMenu()}>Continue</MenuButton>
      <MenuButton
        onClick={() => {
          initStage();
          closeMenu();
        }}
      >
        Restart Game
      </MenuButton>
      <MenuButton
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
