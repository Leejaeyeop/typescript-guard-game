import { useRoundManager } from "@/app/(pixijs)/hooks/use-round-manager";
import Image from "next/image";

const bgMap = {
  NONE: "",
  RIGHT: "bg-green-700",
  WRONG: "bg-red-700",
} as const;

export function RoundAnswerResult() {
  const { setIsVisibleRoundResult, updatePendingAnimationsCount, roundResult } =
    useRoundManager();

  return (
    <div
      className="absolute w-full h-full z-[5] top-0 flex justify-center items-center"
      onAnimationEnd={() => {
        updatePendingAnimationsCount("decrement");
        setIsVisibleRoundResult(false);
      }}
    >
      <div
        className={`${bgMap[roundResult]} animate-fade-in-out w-full h-full opacity-0 absolute`}
      ></div>
      <div className="w-1/2 h-1/6 relative">
        {roundResult === "RIGHT" ? (
          <Image
            src="/assets/ui/right_text.webp"
            alt="result_text"
            fill
            loading="eager"
          />
        ) : (
          <Image
            src="/assets/ui/wrong_text.webp"
            alt="wrong_text"
            fill
            loading="eager"
          />
        )}
      </div>
    </div>
  );
}
