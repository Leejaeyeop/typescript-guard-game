import { query } from "./_generated/server";
import { Quiz } from "../src/types/quiz";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const quizzes: Quiz[] = await ctx.db.query("quizzes").collect();

    const selectedFields = quizzes.map((quiz) => ({
      id: quiz.id,
      question: quiz.question,
      difficultyLevel: quiz.difficultyLevel,
      explanation: quiz.explanation,
      category: quiz.category,
    }));

    return selectedFields;
  },
});
