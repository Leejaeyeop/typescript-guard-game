import { Quiz } from "@/types/quiz";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ResultIndicator } from "./ResultIndicator";
import { dark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { useMemo } from "react";

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
  const { resolvedTheme } = useTheme();

  const theme = useMemo(() => {
    if (resolvedTheme === "light") {
      return prism;
    } else {
      return dark;
    }
  }, [resolvedTheme]);

  return (
    // section과 aria-labelledby로 시맨틱 구조 강화
    // light/dark 모드 지원을 위해 TailwindCSS dark variant 사용
    <section
      aria-labelledby={headingId}
      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-4"
    >
      <header className="flex items-center justify-between mb-3">
        <h3
          id={headingId}
          className="text-lg font-bold text-zinc-900 dark:text-zinc-300"
        >
          Question #{questionNumber}
        </h3>
        <ResultIndicator wasCorrect={wasCorrect} userAnswer={userAnswer} />
      </header>
      <SyntaxHighlighter
        language="typescript"
        style={theme}
        wrapLines={true}
        customStyle={{ margin: 0 }}
      >
        {quiz.question}
      </SyntaxHighlighter>
      {quiz.category && (
        <p className="mt-3 text-sm sm:text-base text-zinc-900 dark:text-white">
          <strong className="text-blue-500">Category: </strong>
          {quiz.category}
        </p>
      )}
      {/* (선택 사항) 해설이 있다면 여기에 표시 */}
      {quiz.explanation && (
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {quiz.explanation}
        </p>
      )}
    </section>
  );
};
