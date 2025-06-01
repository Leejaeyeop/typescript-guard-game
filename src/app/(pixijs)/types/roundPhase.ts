/**
 * ROUND_START: Round 시작 및 초기화 /
 * PRESENTING_QUESTION: 문제 제시중 (사용자 답변 재기) /
 * ANSWER_SUBMITTED: 사용자가 답변 제출 /
 * ROUND_ENDED: 라운드 종료 /
 */
export type RoundPhase =
  | "ROUND_START"
  | "PRESENTING_QUESTION"
  | "ANSWER_SUBMITTED"
  | "ROUND_ENDED";
