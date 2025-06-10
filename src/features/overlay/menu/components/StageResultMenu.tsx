import { MenuButton } from "@/components/ui/button/MenuButton";
import { MenuOverlay, useMenuOverlay } from "../MenuOverlay";
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
          <h2 className="text-2xl text-red-500 mb-3">Failed...</h2>
        </>
      ) : (
        <>
          <h2 className="text-2xl text-blue-500 mb-3">Success</h2>
          <div>
            score: {correctCount} / {TotalNumberOfQuestions}
          </div>
        </>
      )}
      <MenuButton className="mb-5" onClick={() => setShowQuizReview(true)}>
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
