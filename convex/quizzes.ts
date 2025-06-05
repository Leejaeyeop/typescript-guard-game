import { query } from "./_generated/server";
import { Quiz } from "../src/types/quiz";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const quizzes: Quiz[] = await ctx.db.query("quizzes").collect();
    return quizzes;
  },
});
