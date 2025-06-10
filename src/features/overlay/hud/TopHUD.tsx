import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";
import { useStageManager } from "@/contexts/StageProvider";
import Image from "next/image";
import { PauseMenu } from "../menu/components/PauseMenu";

export function TopHUD() {
  const [setMenuOverlay, openMenu] = useMenuStore(
    useShallow((state) => [state.setMenuOverlay, state.openMenu])
  );

  const { stageState } = useStageManager();

  return (
    <header className="absolute top-0 left-0 w-full h-[10vh] flex items-center justify-between px-6 text-white">
      {/* 왼쪽: Life & Score */}
      <div className="flex items-center space-x-6 text-lg font-semibold">
        <div className="flex items-center gap-1">
          <span>❤️ x</span>
          <span>{stageState.lifePoints}</span>
        </div>
        <div>
          {stageState.currentRoundIndex + 1} / {stageState.quizzes.length}
        </div>
      </div>

      {/* 오른쪽: Option Icon */}
      <div
        className="w-10 h-10 flex items-center justify-center hover:cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-150"
        onClick={() => {
          openMenu();
          setMenuOverlay(<PauseMenu />);
        }}
      >
        <Image
          src="/assets/ui/option.webp"
          alt="option"
          width={100}
          height={100}
          loading="eager"
          priority={true}
        />
      </div>
    </header>
  );
}
