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
  useCallback,
} from "react";
import { useStageManager } from "../stage/StageProvider";
import { BackgroundSpriteHandle } from "@/features/game-canvas/components/sprites/BackgroundSprite";
import { VisitorSpriteHandle } from "@/features/game-canvas/components/sprites/VisitorSprite";
import { RoundState } from "./RoundTypes";
import { Action, roundReducer } from "./RoundReducer";

// --- 타입 및 상수 정의 ---

type RoundContextType = {
  roundState: RoundState;
  roundStateDispatch: Dispatch<Action>;
  backgroundRef: RefObject<BackgroundSpriteHandle | null>;
  visitorRef: Ref<VisitorSpriteHandle | null>;
  submitAnswer: (answer: boolean) => void;
  setCorrectAnswer: (answer: boolean) => void;
};

export const ROUND_RESULT = {
  NONE: "NONE",
  RIGHT: "RIGHT",
  WRONG: "WRONG",
} as const;

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export const initialState: RoundState = {
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
  const setCorrectAnswer = useCallback(
    (answer: boolean) =>
      roundStateDispatch({ type: "SET_CORRECT_ANSWER", payload: answer }),
    []
  );

  // 상위 컨텍스트(Stage)의 상태를 구독하여 라운드 상태 제어
  useEffect(() => {
    if (stageState.phase === "ROUNDS_IN_PROGRESS") {
      roundStateDispatch({ type: "START_ROUND" });
    } else if (
      stageState.phase === "NONE" ||
      stageState.phase === "PREPARE" ||
      stageState.phase === "STAGE_RESULTS"
    ) {
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
    // NOTE: we intentionally run this effect only when `roundState.phase` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundState.phase]);

  const contextValue = useMemo<RoundContextType>(
    () => ({
      roundState,
      roundStateDispatch,
      backgroundRef,
      visitorRef,
      submitAnswer,
      setCorrectAnswer,
    }),
    [roundState, setCorrectAnswer] // state 객체가 바뀔 때만 value가 새로 생성됨
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
