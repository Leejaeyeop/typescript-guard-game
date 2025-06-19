import { ROUND_RESULT } from "./RoundProvider";

export type RoundResult = (typeof ROUND_RESULT)[keyof typeof ROUND_RESULT];

export type ROUND_PHASES = [
  "NONE",
  "ROUND_START",
  "PRESENTING_QUESTION",
  "ANSWER_SUBMITTED",
  "SHOWING_RESULT",
  "ROUND_ENDED",
];

export type RoundPhase = ROUND_PHASES[number];

export type RoundState = {
  phase: RoundPhase;
  userAnswer: boolean | null;
  correctAnswer: boolean | null;
  isVisibleAnswer: boolean;
  isVisibleActionBar: boolean;
  isVisibleVisitor: boolean;
  pendingAnimationsCount: number;
  isVisibleRoundResult: boolean;
  roundResult: RoundResult;
};
