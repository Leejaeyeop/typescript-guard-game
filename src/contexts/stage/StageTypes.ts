import { DifficultyLevel } from "@/types/difficultyLevel";
import { Quiz } from "@/types/quiz";

export type STAGE_PHASES = [
  "NONE",
  "PREPARE",
  "STAGE_START",
  "ROUNDS_IN_PROGRESS",
  "STAGE_RESULTS",
  "STAGE_CONCLUDED",
];

export type StagePhase = STAGE_PHASES[number];

export type UserAnswerResult = {
  wasCorrect: boolean;
  userAnswer: boolean;
} & Quiz;

export type StageState = {
  phase: StagePhase;
  difficultyLevel: DifficultyLevel | null;
  quizzes: Quiz[];
  correctCount: number;
  currentRoundIndex: number;
  lifePoints: number;
  isPaused: boolean;
  isVisibleTopHUD: boolean;
};
