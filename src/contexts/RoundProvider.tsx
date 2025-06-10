"use client";

import {
  useRef,
  createContext,
  ReactNode,
  Ref,
  useContext,
  RefObject,
  useEffect,
  useMemo,
  Dispatch,
  useReducer,
} from "react";
import { useStageManager } from "./StageProvider";
import { BackgroundSpriteHandle } from "@/features/game-canvas/components/sprites/BackgroundSprite";
import { VisitorSpriteHandle } from "@/features/game-canvas/components/sprites/VisitorSprite";

// --- 타입 및 상수 정의 ---

const ROUND_RESULT = {
  NONE: "NONE",
  RIGHT: "RIGHT",
  WRONG: "WRONG",
} as const;

type RoundResult = (typeof ROUND_RESULT)[keyof typeof ROUND_RESULT];

type ROUND_PHASES = [
  "NONE",
  "ROUND_START",
  "PRESENTING_QUESTION",
  "ANSWER_SUBMITTED",
  "SHOWING_RESULT",
  "ROUND_ENDED",
];

type RoundPhase = ROUND_PHASES[number];

type RoundState = {
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

type RoundContextType = {
  roundState: RoundState;
  roundStateDispatch: Dispatch<Action>;
  backgroundRef: RefObject<BackgroundSpriteHandle | null>;
  visitorRef: Ref<VisitorSpriteHandle | null>;
  submitAnswer: (answer: boolean) => void;
  setCorrectAnswer: (answer: boolean) => void;
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

// --- Reducer 및 Action 정의 ---

type Action =
  | { type: "RESET_ROUND" }
  | { type: "START_ROUND" }
  | { type: "PRESENT_QUESTION" }
  | { type: "SET_CORRECT_ANSWER"; payload: boolean }
  | { type: "SUBMIT_ANSWER"; payload: boolean }
  | { type: "SHOW_RESULT" }
  | { type: "END_ROUND" }
  | { type: "ANIMATION_STARTED" }
  | { type: "ANIMATION_FINISHED" };

const initialState: RoundState = {
  phase: "NONE",
  userAnswer: null,
  correctAnswer: null,
  isVisibleAnswer: false,
  isVisibleActionBar: false,
  isVisibleVisitor: false,
  pendingAnimationsCount: 0,
  isVisibleRoundResult: false,
  roundResult: ROUND_RESULT.NONE,
};

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

function roundReducer(state: RoundState, action: Action): RoundState {
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

// --- Provider 컴포넌트 ---

export const RoundProvider = ({ children }: { children: ReactNode }) => {
  const { stageState, reportRoundOutcome } = useStageManager();
  const [roundState, roundStateDispatch] = useReducer(
    roundReducer,
    initialState
  );

  const backgroundRef = useRef<BackgroundSpriteHandle>(null);
  const visitorRef = useRef<VisitorSpriteHandle>(null);

  // 컴포넌트에서 사용하기 편하도록 dispatch를 래핑한 함수들
  const submitAnswer = (answer: boolean) =>
    roundStateDispatch({ type: "SUBMIT_ANSWER", payload: answer });
  const setCorrectAnswer = (answer: boolean) =>
    roundStateDispatch({ type: "SET_CORRECT_ANSWER", payload: answer });

  // 상위 컨텍스트(Stage)의 상태를 구독하여 라운드 상태 제어
  useEffect(() => {
    if (stageState.phase === "ROUNDS_IN_PROGRESS") {
      roundStateDispatch({ type: "START_ROUND" });
    } else if (stageState.phase === "NONE" || stageState.phase === "PREPARE") {
      roundStateDispatch({ type: "RESET_ROUND" });
    }
  }, [stageState.phase, stageState.currentRoundIndex]);

  // Reducer의 상태 변화에 따른 Side Effect (애니메이션 등) 처리
  useEffect(() => {
    switch (roundState.phase) {
      case "ROUND_START":
        backgroundRef.current?.playIdleAnimation();
        roundStateDispatch({ type: "ANIMATION_STARTED" }); // visitor 등장 애니메이션 시작
        visitorRef.current?.setStatus("appear");
        break;

      case "PRESENTING_QUESTION":
        roundStateDispatch({ type: "PRESENT_QUESTION" }); // visitor 퇴장 애니메이션 시작
        break;

      case "ANSWER_SUBMITTED":
        roundStateDispatch({ type: "ANIMATION_STARTED" }); // visitor 퇴장 애니메이션 시작
        visitorRef.current?.setStatus("disappear");

        if (roundState.userAnswer === false) {
          roundStateDispatch({ type: "ANIMATION_STARTED" }); // 경비원 애니메이션 시작
          backgroundRef.current?.playGuardAnimation();
        }
        break;

      case "SHOWING_RESULT":
        // 여기서는 결과 표시 애니메이션을 시작할 수 있음 (예: 1초 뒤에 다음 페이즈로)
        roundStateDispatch({ type: "ANIMATION_STARTED" });
        roundStateDispatch({ type: "SHOW_RESULT" });
        break;

      case "ROUND_ENDED":
        roundStateDispatch({ type: "END_ROUND" });

        reportRoundOutcome({
          isCorrect: roundState.roundResult === ROUND_RESULT.RIGHT,
          userAnswer: roundState.userAnswer!,
        });
        break;
    }
  }, [roundState.phase]);

  const contextValue = useMemo(
    () => ({
      roundState,
      roundStateDispatch,
      backgroundRef,
      visitorRef,
      submitAnswer,
      setCorrectAnswer,
    }),
    [roundState] // state 객체가 바뀔 때만 value가 새로 생성됨
  );

  return (
    <RoundContext.Provider value={contextValue}>
      {children}
    </RoundContext.Provider>
  );
};

export function useRoundManager() {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRoundManager must be used within a RoundProvider");
  }
  return context;
}
