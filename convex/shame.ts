import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizzes: defineTable({
    id: v.number(),
    question: v.string(),
    difficultyLevel: v.string(),
    explanation: v.string(),
    category: v.string(),
    answer: v.boolean(),
  }).index("by_id", ["id"]),
});
