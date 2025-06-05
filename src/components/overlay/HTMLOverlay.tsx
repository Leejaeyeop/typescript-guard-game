import { useRoundManager } from "@/app/(pixijs)/hooks/use-round-manager";
import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";
import MonacoEditor from "@/components/overlay/MonacoEditor";
import { ActionBar } from "@/components/overlay/actionBar/ActionBar";
import { TopHUD } from "@/components/overlay/hud/TopHUD";
import { RoundAnswerResult } from "@/components/overlay/result/RoundAnswerResult";
import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";

export default function HTMLOverlay() {
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
      <div
        className={`absolute bottom-[45%] h-1/5 w-1/2 left-1/4 ${
          !isVisibleAnswer && "hidden"
        }`}
      >
        <div className="relative inline-block bg-white h-full w-full px-2 py-2 rounded-xl shadow-md">
          {/* {curRoundQuiz?.answer} */}
          <MonacoEditor value={curRoundQuiz?.question} />
          <div className="absolute left-1/2 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
        </div>
      </div>
      {/* action bar */}
      {isVisibleActionBar && <ActionBar />}
      {/* menu */}
      {isMenuOpen && menuOverlay}
      {/* pause */}
      {isPaused && (
        <div className="absolute top-0 w-full h-full backdrop-blur-md" />
      )}
      {/* answer result */}
      {isVisibleRoundResult && <RoundAnswerResult />}
    </>
  );
}
