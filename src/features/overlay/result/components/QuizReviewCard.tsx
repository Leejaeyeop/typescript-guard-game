// The refactored QuizReviewCard.tsx
import { Quiz } from "@/types/quiz";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ResultIndicator } from "./ResultIndicator";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface QuizReviewCardProps {
  quiz: Quiz;
  wasCorrect: boolean;
  userAnswer: boolean;
  questionNumber: number;
}

export const QuizReviewCard = ({
  quiz,
  wasCorrect,
  userAnswer,
  questionNumber,
}: QuizReviewCardProps) => {
  const headingId = `question-heading-${questionNumber}`;

  return (
    // section과 aria-labelledby로 시맨틱 구조 강화
    <section
      aria-labelledby={headingId}
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4"
    >
      <header className="flex items-center justify-between mb-3">
        <h3 id={headingId} className="text-lg font-bold text-zinc-300">
          Question #{questionNumber}
        </h3>
        <ResultIndicator wasCorrect={wasCorrect} userAnswer={userAnswer} />
      </header>
      <SyntaxHighlighter
        language="typescript"
        style={dark}
        wrapLines={true}
        customStyle={{ margin: 0 }}
      >
        {quiz.question}
      </SyntaxHighlighter>
      {quiz.category && (
        <p className="mt-3 text-sm sm:text-base text-white">
          <strong className="text-blue-500">Category: </strong>
          {quiz.category}
        </p>
      )}
      {/* (선택 사항) 해설이 있다면 여기에 표시 */}
      {quiz.explanation && (
        <p className="mt-3 text-sm sm:text-base text-zinc-400">
          {quiz.explanation}
        </p>
      )}
    </section>
  );
};
