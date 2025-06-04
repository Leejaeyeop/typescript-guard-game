import { MenuOverlay, useMenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";

function ResultMenuContent() {
  const { pushMenuContext } = useMenuOverlay();
  const { setActiveScene } = useAppStore();
  const { score } = useStageManager();

  return (
    <>
      <div>result score: {score}</div>
      <MenuButton onClick={() => pushMenuContext(<SelectDifficultyLevel />)}>
        Play other game
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

export function ResultMenu() {
  return (
    <MenuOverlay>
      <ResultMenuContent></ResultMenuContent>
    </MenuOverlay>
  );
}
