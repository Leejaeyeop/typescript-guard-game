import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";
import { MenuButton } from "../button/MenuButton";
import { DifficultyLevel } from "@/types/difficultyLevel";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";

export function SelectDifficultyLevel() {
  const { setStageDifficultyLevel, initStage } = useStageManager();
  const { setActiveScene } = useAppStore();

  const closeMenu = useMenuStore((state) => state.closeMenu);

  const onClickHandler = (level: DifficultyLevel) => {
    setStageDifficultyLevel(level);
    setActiveScene(SCENE_IDS.QUIZ_STAGE);
    initStage();
    closeMenu();
  };

  return (
    <>
      <MenuButton onClick={() => onClickHandler("BEGINNER")}>
        Beginner
      </MenuButton>
      <MenuButton onClick={() => onClickHandler("INTERMEDIATE")}>
        Intermediate
      </MenuButton>
      <MenuButton onClick={() => onClickHandler("EXPERT")}>Expert</MenuButton>
    </>
  );
}
