import { DifficultyLevel } from "./difficultyLevel";

export interface Quiz {
  id: number;
  difficultyLevel: DifficultyLevel;
  question: string;
}
