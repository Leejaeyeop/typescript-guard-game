import { useEffect } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { MainMenu } from "@/features/overlay/menu/components/MainMenu";
import GuideMenu from "@/features/overlay/menu/components/GuideMenu";

export function useInitialMenu() {
  const { setMenuOverlay, openMenu } = useMenuStore();
  const { activeScene, dontShowAgain } = useAppStore();

  useEffect(() => {
    if (activeScene === SCENE_IDS.MAIN) {
      openMenu();
      setMenuOverlay(dontShowAgain ? <MainMenu /> : <GuideMenu />);
    }
  }, [activeScene, dontShowAgain, setMenuOverlay, openMenu]);
}
