import { MenuOverlay, useMenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useMenuStore } from "@/store/useMenuStore";

interface StageResultMenuProps {
  isFailed: boolean;
  TotalNumberOfQuestions: number;
  correctCount: number;
}

function StageResultMenuContent({
  isFailed = false,
  TotalNumberOfQuestions,
  correctCount,
}: StageResultMenuProps) {
  const { pushMenuContext } = useMenuOverlay();
  const { setActiveScene } = useAppStore();

  const setShowQuizReview = useMenuStore((state) => state.setShowQuizReview);

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
            score: {correctCount} / {TotalNumberOfQuestions}
          </div>
        </>
      )}
      <MenuButton onClick={() => setShowQuizReview(true)}>
        View Results
      </MenuButton>
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

export function StageResultMenu(props: StageResultMenuProps) {
  return (
    <MenuOverlay>
      <StageResultMenuContent {...props}></StageResultMenuContent>
    </MenuOverlay>
  );
}
