import { useRoundManager } from "@/contexts/round/RoundProvider";
import { useStageManager } from "@/contexts/stage/StageProvider";
import MonacoEditor from "@/features/overlay/question/MonacoEditor";
import { ActionBar } from "@/features/overlay/action-bar/ActionBar";
import { RoundAnswerResult } from "@/features/overlay/result/RoundAnswerResult";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";
import ResizableContainer from "./question/ResizableContainer";
import QuizReviewPage from "./result/QuizReviewPage";
import { TopHUD } from "./hud/TopHUD";
import { useMemo, useState } from "react";

export default function HTMLOverlay() {
  const { activeScene } = useAppStore();
  const { stageState, currentQuiz } = useStageManager();

  const { roundState } = useRoundManager();

  // monaco loading 상태 추가
  const [isEditorMounted, setIsEditorMounted] = useState(false);

  const [isMenuOpen, menuOverlay, showQuizReview] = useMenuStore(
    useShallow((state) => [
      state.isMenuOpen,
      state.menuOverlay,
      state.showQuizReview,
      state.setShowQuizReview,
    ])
  );

  const isActionDisabled = useMemo(
    () => isEditorMounted && roundState.phase !== "PRESENTING_QUESTION",
    [isEditorMounted, roundState.phase] // state 객체가 바뀔 때만 value가 새로 생성됨
  );
  return (
    <>
      {/* top HUD */}
      {stageState.isVisibleTopHUD && <TopHUD />}
      {/* question */}
      <ResizableContainer hidden={!roundState.isVisibleAnswer}>
        <MonacoEditor
          value={currentQuiz?.question}
          setIsEditorMounted={setIsEditorMounted}
        />
      </ResizableContainer>
      {/* action bar */}
      {roundState.isVisibleActionBar && (
        <ActionBar isActionDisabled={isActionDisabled} />
      )}
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
