import { useMenuStore } from "@/store/useMenuStore";
import { Quiz } from "@/types/quiz";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStageManager } from "@/app/(pixijs)/hooks/use-stage-manager";

interface QuizReviewCardProps {
  quiz: Quiz;
  wasCorrect: boolean;
  useAnswer: boolean;
  questionNumber: number;
}
const QuizReviewCard = ({
  quiz,
  wasCorrect,
  useAnswer,
  questionNumber,
}: QuizReviewCardProps) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-zinc-300">
          Question #{questionNumber}
        </h3>
        {wasCorrect ? (
          <span className="flex items-center gap-2 text-green-400 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Your Answer: {useAnswer ? "Pass" : "Guard"} (Correct)
          </span>
        ) : (
          <span className="flex items-center gap-2 text-red-400 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Your Answer: {useAnswer ? "Pass" : "Guard"} (Incorrect)
          </span>
        )}
      </div>
      <SyntaxHighlighter language="typescript" style={dark} wrapLines={true}>
        {quiz.question}
      </SyntaxHighlighter>
      {/* (선택 사항) 해설이 있다면 여기에 표시 */}
      {quiz.explanation && (
        <p className="mt-3 text-sm sm:text-base text-zinc-400">
          {quiz.explanation}
        </p>
      )}
    </div>
  );
};

const QuizReviewPage = () => {
  const setShowQuizReview = useMenuStore((state) => state.setShowQuizReview);
  const { userAnswerResults } = useStageManager();

  return (
    <div className="absolute top-0 w-full h-full bg-black z-[99]">
      <header className="sticky top-0 h-10 flex items-center justify-end bg-black ">
        {/* --- 닫기 버튼 1: 우측 상단 'X' 아이콘 --- */}
        <button
          className="hover:cursor-pointer hover:opacity-80"
          aria-label="Close"
          onClick={() => setShowQuizReview(false)}
        >
          <h2 className="text-xl">Close [X]</h2>
        </button>
      </header>
      {userAnswerResults.current.map((result, index) => (
        <QuizReviewCard
          key={result.id}
          questionNumber={index + 1}
          quiz={result}
          useAnswer={result.userAnswer}
          wasCorrect={result.wasCorrect}
        />
      ))}
    </div>
  );
};

export default QuizReviewPage;
