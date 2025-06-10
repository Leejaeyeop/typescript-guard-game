import { useRoundManager } from "@/contexts/RoundProvider";
import { useStageManager } from "@/contexts/StageProvider";
import MonacoEditor from "@/features/overlay/question/MonacoEditor";
import { ActionBar } from "@/features/overlay/action-bar/ActionBar";
import { RoundAnswerResult } from "@/features/overlay/result/RoundAnswerResult";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";
import ResizableContainer from "./question/ResizableContainer";
import QuizReviewPage from "./result/QuizReviewPage";
import { TopHUD } from "./hud/TopHUD";

export default function HTMLOverlay() {
  const { activeScene } = useAppStore();
  const { stageState, currentQuiz } = useStageManager();

  const { roundState } = useRoundManager();

  const [isMenuOpen, menuOverlay, showQuizReview] = useMenuStore(
    useShallow((state) => [
      state.isMenuOpen,
      state.menuOverlay,
      state.showQuizReview,
      state.setShowQuizReview,
    ])
  );

  return (
    <>
      {/* top HUD */}
      {stageState.isVisibleTopHUD && <TopHUD />}
      {/* question */}
      <ResizableContainer hidden={!roundState.isVisibleAnswer}>
        <MonacoEditor value={currentQuiz?.question} />
      </ResizableContainer>
      {/* action bar */}
      {roundState.isVisibleActionBar && <ActionBar />}
      {/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {stageState.isPaused && (
        <div className="absolute top-0 w-full h-full backdrop-blur-md" />
      )}
      {/* answer result */}
      {activeScene === SCENE_IDS.QUIZ_STAGE && (
        <div
          className={`${!roundState.isVisibleRoundResult && "hidden"} absolute top-0 w-full h-full`}
        >
          <RoundAnswerResult />
        </div>
      )}
      {showQuizReview && <QuizReviewPage />}
    </>
  );
}
