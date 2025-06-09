import { DifficultyLevel } from "./difficultyLevel";

export interface Quiz {
  id: number;
  difficultyLevel: DifficultyLevel;
  category: string;
  question: string;
  explanation: string;
}
