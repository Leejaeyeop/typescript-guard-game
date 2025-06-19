import { initialState, ROUND_RESULT } from "./RoundProvider";
import { RoundPhase, RoundState } from "./RoundTypes";

function getNextPhaseAfterAnimation(phase: RoundPhase): RoundPhase {
  switch (phase) {
    case "ROUND_START":
      return "PRESENTING_QUESTION";
    case "ANSWER_SUBMITTED":
      return "SHOWING_RESULT";
    case "SHOWING_RESULT":
      return "ROUND_ENDED";
    default:
      return phase;
  }
}

export type Action =
  | { type: "RESET_ROUND" }
  | { type: "START_ROUND" }
  | { type: "PRESENT_QUESTION" }
  | { type: "SET_CORRECT_ANSWER"; payload: boolean }
  | { type: "SUBMIT_ANSWER"; payload: boolean }
  | { type: "SHOW_RESULT" }
  | { type: "END_ROUND" }
  | { type: "ANIMATION_STARTED" }
  | { type: "ANIMATION_FINISHED" };

export function roundReducer(state: RoundState, action: Action): RoundState {
  switch (action.type) {
    case "RESET_ROUND":
      return { ...initialState };
    case "START_ROUND":
      return { ...state, phase: "ROUND_START", isVisibleVisitor: true };
    case "PRESENT_QUESTION":
      return {
        ...state,
        phase: "PRESENTING_QUESTION",
        isVisibleAnswer: true,
        isVisibleActionBar: true,
      };
    case "SET_CORRECT_ANSWER":
      return { ...state, correctAnswer: action.payload };
    case "SUBMIT_ANSWER":
      return {
        ...state,
        phase: "ANSWER_SUBMITTED",
        userAnswer: action.payload,
        isVisibleAnswer: false,
        isVisibleActionBar: false,
      };
    case "SHOW_RESULT": {
      const isCorrect = state.correctAnswer === state.userAnswer;
      return {
        ...state,
        // phase: "SHOWING_RESULT",
        roundResult: isCorrect ? ROUND_RESULT.RIGHT : ROUND_RESULT.WRONG,
        isVisibleVisitor: false,
        isVisibleRoundResult: true,
      };
    }
    case "END_ROUND":
      return { ...state, phase: "ROUND_ENDED", isVisibleRoundResult: false };
    case "ANIMATION_STARTED":
      return {
        ...state,
        pendingAnimationsCount: state.pendingAnimationsCount + 1,
      };
    case "ANIMATION_FINISHED": {
      const newCount = state.pendingAnimationsCount - 1;
      if (newCount === 0) {
        // 모든 애니메이션이 끝나면 다음 단계로 전환
        return {
          ...state,
          pendingAnimationsCount: 0,
          phase: getNextPhaseAfterAnimation(state.phase),
        };
      }
      return { ...state, pendingAnimationsCount: newCount };
    }
    default:
      return state;
  }
}
