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
      className="absolute w-full h-full z-[5] top-0"
      onAnimationEnd={() => {
        updatePendingAnimationsCount("decrement");
        setIsVisibleRoundResult(false);
      }}
    >
      <div
        className={`${bgMap[roundResult]} animate-fade-in-out w-full h-full opacity-0`}
      ></div>
      <div className="absolute top-1/3 left-1/4">
        {roundResult === "RIGHT" ? (
          <Image
            src="/assets/ui/right_text.webp"
            alt="pass_button"
            width={450}
            height={100}
          />
        ) : (
          <Image
            src="/assets/ui/wrong_text.webp"
            alt="pass_button"
            width={450}
            height={100}
          />
        )}
      </div>
    </div>
  );
}
