import { DifficultyLevel } from "@/types/difficultyLevel";
import { Quiz } from "@/types/quiz";
import { StageState } from "./StageTypes";
import { getRandomQuizzesByDifficulty } from "@/utils/quizUtils";
import { initialState } from "./StageProvider";

export type Action =
  | { type: "RESET_TO_NONE" }
  | { type: "SET_DIFFICULTY"; payload: DifficultyLevel }
  | { type: "INIT_STAGE" }
  | {
      type: "PREPARE_STAGE";
      payload: { allQuizzes: Quiz[]; difficulty: DifficultyLevel };
    }
  | { type: "START_STAGE" }
  | { type: "QUIT_STAGE" }
  | {
      type: "REPORT_ROUND_OUTCOME";
      payload: { isCorrect: boolean; userAnswer: boolean };
    }
  | { type: "TOGGLE_PAUSE"; payload: boolean };

export function stageReducer(
  stageState: StageState,
  action: Action
): StageState {
  switch (action.type) {
    case "RESET_TO_NONE":
      return { ...initialState };
    case "SET_DIFFICULTY":
      return { ...stageState, difficultyLevel: action.payload };
    case "INIT_STAGE":
      return { ...stageState, phase: "PREPARE" };
    case "PREPARE_STAGE":
      return {
        ...initialState, // Reset stats for a new stage
        difficultyLevel: action.payload.difficulty,
        quizzes: getRandomQuizzesByDifficulty(
          action.payload.allQuizzes,
          action.payload.difficulty
        ),
        phase: "STAGE_START",
        isVisibleTopHUD: true,
      };
    case "START_STAGE":
      return { ...stageState, phase: "ROUNDS_IN_PROGRESS" };
    case "QUIT_STAGE": {
      return {
        ...stageState,
        lifePoints: 0,
        phase: "STAGE_RESULTS",
        isVisibleTopHUD: false,
      };
    }
    case "REPORT_ROUND_OUTCOME": {
      const { isCorrect } = action.payload;
      const newCorrectCount = isCorrect
        ? stageState.correctCount + 1
        : stageState.correctCount;
      const newLifePoints = isCorrect
        ? stageState.lifePoints
        : stageState.lifePoints - 1;

      const isLastQuiz =
        stageState.currentRoundIndex === stageState.quizzes.length - 1;
      const isGameOver = newLifePoints === 0;

      if (isLastQuiz || isGameOver) {
        return {
          ...stageState,
          correctCount: newCorrectCount,
          lifePoints: newLifePoints,
          phase: "STAGE_RESULTS",
          isVisibleTopHUD: false,
        };
      }
      return {
        ...stageState,
        correctCount: newCorrectCount,
        lifePoints: newLifePoints,
        currentRoundIndex: stageState.currentRoundIndex + 1,
      };
    }
    case "TOGGLE_PAUSE":
      return { ...stageState, isPaused: action.payload };
    default:
      throw new Error("Unhandled action type in stageReducer");
  }
}
