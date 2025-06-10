import { useRoundManager } from "@/contexts/RoundProvider";
import Image from "next/image";

const bgMap = {
  NONE: "",
  RIGHT: "bg-green-700",
  WRONG: "bg-red-700",
} as const;

export function RoundAnswerResult() {
  const { roundState, roundStateDispatch } = useRoundManager();

  return (
    <section
      className="absolute w-full h-full z-[5] top-0 flex justify-center items-center"
      onAnimationEnd={() => {
        roundStateDispatch({ type: "ANIMATION_FINISHED" });
      }}
    >
      <div
        className={`${bgMap[roundState.roundResult]} animate-fade-in-out w-full h-full opacity-0 absolute`}
      ></div>
      <div className="w-1/2 h-1/6 relative">
        <Image
          className={`${roundState.roundResult !== "RIGHT" && "hidden"}`}
          src="/assets/ui/right_text.webp"
          alt="result_text"
          fill
          loading="eager"
          priority={true}
        />
        <Image
          className={`${roundState.roundResult !== "WRONG" && "hidden"}`}
          src="/assets/ui/wrong_text.webp"
          alt="wrong_text"
          fill
          loading="eager"
          priority={true}
        />
      </div>
    </section>
  );
}
