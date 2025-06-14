import { useStageManager } from "@/contexts/StageProvider";
import { DifficultyLevel } from "@/types/difficultyLevel";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { MenuButton } from "@/components/ui/button/MenuButton";

export function SelectDifficultyLevel() {
  const { setStageDifficulty, initStage } = useStageManager();
  const { setActiveScene } = useAppStore();

  const closeMenu = useMenuStore((state) => state.closeMenu);

  const onClickHandler = (level: DifficultyLevel) => {
    setStageDifficulty(level);
    setActiveScene(SCENE_IDS.QUIZ_STAGE);
    initStage();
    closeMenu();
  };

  return (
    <>
      <MenuButton
        aria-label="Beginner"
        onClick={() => onClickHandler("BEGINNER")}
      >
        Beginner
      </MenuButton>
      <MenuButton
        aria-label="Intermediate"
        onClick={() => onClickHandler("INTERMEDIATE")}
      >
        Intermediate
      </MenuButton>
      <MenuButton aria-label="Expert" onClick={() => onClickHandler("EXPERT")}>
        Expert
      </MenuButton>
    </>
  );
}
