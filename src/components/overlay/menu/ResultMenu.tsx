import { MenuOverlay, useMenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";

interface ResultMenuProps {
  isFailed: boolean;
  TotalNumberOfQuestions: number;
  correctCount: number;
}

function ResultMenuContent({
  isFailed = false,
  TotalNumberOfQuestions,
  correctCount,
}: ResultMenuProps) {
  const { pushMenuContext } = useMenuOverlay();
  const { setActiveScene } = useAppStore();

  return (
    <>
      {isFailed ? (
        <>
          <div>Failed...</div>
        </>
      ) : (
        <>
          <div>Congratulations!</div>
          <div>
            result score: {correctCount} / {TotalNumberOfQuestions}
          </div>
          <MenuButton
            onClick={() => pushMenuContext(<SelectDifficultyLevel />)}
          >
            Play other game
          </MenuButton>
        </>
      )}

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

export function ResultMenu(props: ResultMenuProps) {
  return (
    <MenuOverlay>
      <ResultMenuContent {...props}></ResultMenuContent>
    </MenuOverlay>
  );
}
