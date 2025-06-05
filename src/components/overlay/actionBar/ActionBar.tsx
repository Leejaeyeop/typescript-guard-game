import { useRoundManager } from "@/app/(pixijs)/hooks/use-round-manager";
import Image from "next/image";

export function ActionBar() {
  const { curRoundPhase, submitAnswer } = useRoundManager();
  return (
    <footer className="absolute bottom-0 gap-[5%] w-full h-1/6 flex justify-center">
      <button
        className="w-1/5 hover:cursor-pointer disabled:opacity-50"
        disabled={curRoundPhase !== "PRESENTING_QUESTION"}
        onClick={() => submitAnswer(true)}
      >
        <Image
          src="/assets/ui/pass_button.webp"
          alt="pass_button"
          width={500}
          height={100}
          loading="eager"
        />
      </button>
      <button
        className="w-1/5 hover:cursor-pointer disabled:opacity-50"
        disabled={curRoundPhase !== "PRESENTING_QUESTION"}
        onClick={() => submitAnswer(false)}
      >
        <Image
          src="/assets/ui/guard_button.webp"
          alt="pass_button"
          width={500}
          height={100}
          loading="eager"
        />
      </button>
    </footer>
  );
}
