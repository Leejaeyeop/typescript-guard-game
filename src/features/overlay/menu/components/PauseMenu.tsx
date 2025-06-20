import { MenuOverlay, useMenuOverlay } from "../MenuOverlay";
import { useMenuStore } from "@/store/useMenuStore";
import { useStageManager } from "@/contexts/stage/StageProvider";
import { useEffect } from "react";
import { MenuButton } from "@/components/ui/button/MenuButton";
import { SettingMenu } from "./SettingMenu";

function PauseMenuContent() {
  const { closeMenu } = useMenuStore();
  const { initStage, stageStateDispatch, quitStage } = useStageManager();
  const { pushMenuContext } = useMenuOverlay();

  useEffect(() => {
    stageStateDispatch({ type: "TOGGLE_PAUSE", payload: true });
  }, [stageStateDispatch]);

  const cancelPause = () => {
    stageStateDispatch({ type: "TOGGLE_PAUSE", payload: false });
    closeMenu();
  };

  return (
    <>
      <MenuButton aria-label="Resume" onClick={cancelPause}>
        Resume
      </MenuButton>
      <MenuButton
        aria-label="Restart Game"
        onClick={() => {
          initStage();
          cancelPause();
        }}
      >
        Restart Game
      </MenuButton>
      <MenuButton
        aria-label="Settings"
        onClick={() => pushMenuContext(<SettingMenu />)}
      >
        Settings
      </MenuButton>
      <MenuButton
        aria-label="Quit"
        onClick={() => {
          quitStage();
          cancelPause();
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
