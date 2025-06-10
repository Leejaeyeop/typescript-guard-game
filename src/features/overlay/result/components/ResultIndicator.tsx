import IconCheck from "@/assets/icons/IconCheck.svg?react";
import IconX from "@/assets/icons/IconX.svg?react";

interface ResultIndicatorProps {
  wasCorrect: boolean;
  userAnswer: boolean;
}

export const ResultIndicator = ({
  wasCorrect,
  userAnswer,
}: ResultIndicatorProps) => {
  const resultText = wasCorrect ? "Correct" : "Incorrect";
  const answerText = userAnswer ? "Pass" : "Guard";
  const textColor = wasCorrect ? "text-green-400" : "text-red-400";

  // 스크린 리더를 위한 완전한 설명
  const accessibleText = `quiz result: ${wasCorrect ? "right" : "wrong"}. selected answer: ${answerText}.`;

  return (
    <div
      className={`flex items-center gap-2 font-bold ${textColor}`}
      aria-label={accessibleText} // 스크린 리더 사용자에게 명확한 정보 제공
    >
      {wasCorrect ? (
        <IconCheck className="h-6 w-6" />
      ) : (
        <IconX className="h-6 w-6" />
      )}
      <span>
        Your Answer: {answerText} ({resultText})
      </span>
    </div>
  );
};
