import { useRoundManager } from "@/app/(pixijs)/hooks/use-round-manager";
import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";
import MonacoEditor from "@/components/overlay/question/MonacoEditor";
import { ActionBar } from "@/components/overlay/actionBar/ActionBar";
import { TopHUD } from "@/components/overlay/hud/TopHUD";
import { RoundAnswerResult } from "@/components/overlay/result/RoundAnswerResult";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";
import ResizableContainer from "./question/ResizableContainer";
import QuizReviewPage from "./result/QuizReview";

export default function HTMLOverlay() {
  const { activeScene } = useAppStore();
  const { stageState, currentQuiz } = useStageManager();

  const { isVisibleAnswer, isVisibleActionBar, isVisibleRoundResult } =
    useRoundManager();

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
      <ResizableContainer hidden={!isVisibleAnswer}>
        <MonacoEditor value={currentQuiz?.question} />
      </ResizableContainer>
      {/* action bar */}
      {isVisibleActionBar && <ActionBar />}
      {/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {stageState.isPaused && (
        <div className="absolute top-0 w-full h-full backdrop-blur-md" />
      )}
      {/* answer result */}
      {activeScene === SCENE_IDS.QUIZ_STAGE && (
        <div
          className={`${!isVisibleRoundResult && "hidden"} absolute top-0 w-full h-full`}
        >
          <RoundAnswerResult />
        </div>
      )}
      {showQuizReview && <QuizReviewPage />}
    </>
  );
}
