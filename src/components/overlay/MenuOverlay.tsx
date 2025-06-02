import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";
import { useAppStore } from "@/store/useAppStore";
import { useShallow } from "zustand/shallow";

export function MenuOverlay() {
  const { setStagePhaseIdx, setStageDifficultyLevel } = useStageManager();

  const [setIsMenuOpen] = useAppStore(
    useShallow((state) => [state.setIsMenuOpen])
  );
  return (
    <div className="absolute top-[30%] left-[32%] text-black w-[33%] h-[45%]">
      <div className="flex flex-col justify-center items-center gap-4 p-4 w-full [font-size:_clamp(1rem,1vw,2em)]">
        <button
          className="text-center border-2 w-full border-black"
          onClick={() => {
            setStagePhaseIdx(1);
            setStageDifficultyLevel("beginner");
            setIsMenuOpen(false);
          }}
        >
          Play Game
        </button>
        <button className="text-center border-2 w-full border-black">
          Option
        </button>
      </div>
    </div>
  );
}
