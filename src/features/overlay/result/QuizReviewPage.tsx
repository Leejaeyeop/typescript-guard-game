import { useMenuStore } from "@/store/useMenuStore";
import { useStageManager } from "@/contexts/stage/StageProvider";
import { QuizReviewCard } from "./components/QuizReviewCard";

const QuizReviewPage = () => {
  const setShowQuizReview = useMenuStore((state) => state.setShowQuizReview);
  const { userAnswerResults } = useStageManager();

  return (
    <article className="absolute top-0 w-full h-full bg-black z-[99]">
      <header className="sticky top-0 h-10 flex items-center justify-end bg-black ">
        <button
          className="hover:cursor-pointer hover:opacity-80"
          aria-label="Close Review"
          onClick={() => setShowQuizReview(false)}
        >
          <h2 className="text-xl">Close [X]</h2>
        </button>
      </header>
      {userAnswerResults.current.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-2xl">No answer result.</p>
        </div>
      ) : (
        userAnswerResults.current.map((result, index) => (
          <QuizReviewCard
            key={result.id}
            questionNumber={index + 1}
            quiz={result}
            userAnswer={result.userAnswer}
            wasCorrect={result.wasCorrect}
          />
        ))
      )}
    </article>
  );
};

export default QuizReviewPage;
