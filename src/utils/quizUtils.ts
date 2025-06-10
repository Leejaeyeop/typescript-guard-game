import { Quiz } from "@/types/quiz";
import { DifficultyLevel } from "@/types/difficultyLevel";

// The total number of questions to be used in a stage.
export const TOTAL_NUMBER_OF_QUESTIONS = 15;

/**
 * Filters and shuffles quizzes by a specific difficulty level,
 * then returns a specified number of them.
 * @param totalQuizzes - An array of all available quizzes.
 * @param stageDifficultyLevel - The desired difficulty level for the quizzes.
 * @returns An array of randomly selected quizzes.
 */
export function getRandomQuizzesByDifficulty(
  totalQuizzes: Quiz[],
  stageDifficultyLevel: DifficultyLevel
): Quiz[] {
  // 1. Filter quizzes by the desired difficulty level.
  const filteredQuizzes = totalQuizzes.filter(
    (quiz) => quiz.difficultyLevel === stageDifficultyLevel
  );

  // 2. Shuffle the filtered quizzes using the Fisher-Yates Shuffle algorithm.
  // A copy is made to avoid modifying the original array.
  const shuffledQuizzes = [...filteredQuizzes];
  let currentIndex = shuffledQuizzes.length;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledQuizzes[currentIndex], shuffledQuizzes[randomIndex]] = [
      shuffledQuizzes[randomIndex],
      shuffledQuizzes[currentIndex],
    ];
  }

  // 3. Slice the array to get the desired number of questions.
  return shuffledQuizzes.slice(0, TOTAL_NUMBER_OF_QUESTIONS);
}
