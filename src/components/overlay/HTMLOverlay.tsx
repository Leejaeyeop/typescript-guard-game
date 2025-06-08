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

export default function HTMLOverlay() {
  const { activeScene } = useAppStore();
  const { curRoundQuiz, isVisibleTopHUD, isPaused } = useStageManager();

  const { isVisibleAnswer, isVisibleActionBar, isVisibleRoundResult } =
    useRoundManager();

  const [isMenuOpen, menuOverlay] = useMenuStore(
    useShallow((state) => [state.isMenuOpen, state.menuOverlay])
  );
  return (
    <>
      {/* top HUD */}
      {isVisibleTopHUD && <TopHUD />}
      {/* question */}
      <ResizableContainer hidden={!isVisibleAnswer}>
        {/* <div className="relative inline-block bg-white h-full w-full px-2 py-2 rounded-xl shadow-md"> */}
        <MonacoEditor value={curRoundQuiz?.question} />
        {/* </div> */}
      </ResizableContainer>
      {/* action bar */}
      {isVisibleActionBar && <ActionBar />}
      {/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {isPaused && (
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
    </>
  );
}
