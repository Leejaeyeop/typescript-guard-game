"use client";

import {
  useRef,
  useState,
  createContext,
  ReactNode,
  Ref,
  useContext,
  RefObject,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { useStageManager } from "./use-stage-manager";
import { BackgroundSpriteHandle } from "@/components/canvas/sprites/BackgroundSprite";
import { VisitorSpriteHandle } from "@/components/canvas/sprites/VisitorSprite";

const ROUND_RESULT = {
  NONE: "NONE",
  RIGHT: "RIGHT",
  WRONG: "WRONG",
} as const;

export type RoundResult = (typeof ROUND_RESULT)[keyof typeof ROUND_RESULT];

type RoundContextType = {
  curRoundPhase: (typeof roundPhase)[number];
  backgroundRef: RefObject<BackgroundSpriteHandle | null>;
  setRoundPhaseIdx: Dispatch<SetStateAction<number>>;
  visitorRef: Ref<VisitorSpriteHandle | null>;
  isVisibleVisitor: boolean;
  isVisibleAnswer: boolean;
  isVisibleActionBar: boolean;
  setIsVisibleVisitor: Dispatch<SetStateAction<boolean>>;
  submitAnswer: (answer: boolean) => void;
  setCorrectAnswer: (answer: boolean) => void;
  updatePendingAnimationsCount: (action: "increment" | "decrement") => void;
  isVisibleRoundResult: boolean;
  setIsVisibleRoundResult: Dispatch<SetStateAction<boolean>>;
  roundResult: RoundResult;
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

const roundPhase = [
  "NONE",
  "ROUND_START",
  "PRESENTING_QUESTION",
  "ANSWER_SUBMITTED",
  "SHOW_RESULT",
  "ROUND_ENDED",
] as const;

const initialRoundState = {
  roundPhaseIdx: 0,
  userAnswer: null as boolean | null,
  correctAnswer: null as boolean | null,
  isVisibleAnswer: false,
  isVisibleActionBar: false,
  isVisibleVisitor: false,
  pendingAnimationsCount: 0,
  isVisibleRoundResult: false,
  roundResult: ROUND_RESULT.NONE,
};

export const RoundProvider = ({ children }: { children: ReactNode }) => {
  const { stageState, reportRoundOutcome } = useStageManager();
  // 현재 round 페이즈
  const [roundPhaseIdx, setRoundPhaseIdx] = useState(
    initialRoundState.roundPhaseIdx
  );

  const [isVisibleAnswer, setIsVisibleAnswer] = useState(
    initialRoundState.isVisibleAnswer
  );
  const [isVisibleActionBar, setIsVisibleActionBar] = useState(
    initialRoundState.isVisibleActionBar
  );
  // 사용자 응답 값
  const [userAnswer, setUserAnswer] = useState(initialRoundState.userAnswer);
  // 정답 값
  const [correctAnswer, setCorrectAnswer] = useState(
    initialRoundState.correctAnswer
  );
  // visitor
  const [isVisibleVisitor, setIsVisibleVisitor] = useState(
    initialRoundState.isVisibleVisitor
  );
  // result - right
  const [isVisibleRoundResult, setIsVisibleRoundResult] = useState(
    initialRoundState.isVisibleRoundResult
  );
  const [roundResult, setRoundResult] = useState<RoundResult>(
    initialRoundState.roundResult
  );

  // 에니메이션 대기 카운트
  const [, setPendingAnimationsCount] = useState(
    initialRoundState.pendingAnimationsCount
  );

  const backgroundRef = useRef<BackgroundSpriteHandle>(null);
  const visitorRef = useRef<VisitorSpriteHandle>(null);

  const updatePendingAnimationsCount = (
    action: "increment" | "decrement" | "reset"
  ) => {
    setPendingAnimationsCount((prev) => {
      const next = action === "increment" ? prev + 1 : Math.max(prev - 1, 0);

      // "🎉 모든 애니메이션 완료"
      if (prev > 0 && next === 0) {
        // 👉 여기에 후처리 로직 삽입 (예: 상태 변경, 이벤트 호출 등)
        setRoundPhaseIdx(roundPhaseIdx + 1);
      }

      return next;
    });
  };

  // reset 로직
  const resetStates = () => {
    setUserAnswer(initialRoundState.userAnswer);
    setCorrectAnswer(initialRoundState.correctAnswer);
    setIsVisibleAnswer(initialRoundState.isVisibleAnswer);
    setIsVisibleActionBar(initialRoundState.isVisibleActionBar);
    setIsVisibleVisitor(initialRoundState.isVisibleVisitor);
    setPendingAnimationsCount(initialRoundState.pendingAnimationsCount);
    setIsVisibleRoundResult(initialRoundState.isVisibleRoundResult);
    setRoundResult(initialRoundState.roundResult);
  };

  const curRoundPhase = useMemo(() => {
    return roundPhase[roundPhaseIdx];
  }, [roundPhaseIdx]);

  const submitAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setRoundPhaseIdx(roundPhaseIdx + 1);
  };

  // state의 phase 를 구독한다
  useEffect(() => {
    // 리셋 하기
    if (stageState.phase === "NONE" || stageState.phase === "PREPARE") {
      setRoundPhaseIdx(0);
    } else if (stageState.phase === "ROUNDS_IN_PROGRESS") {
      // 라운드 시작
      setRoundPhaseIdx(1);
    }
  }, [stageState.phase, stageState.currentRoundIndex]);

  useEffect(() => {
    // 에니메이션 실행 함수
    const startAnimation = (func: (...args: unknown[]) => unknown) => {
      updatePendingAnimationsCount("increment");
      func();
    };

    const isCorrect = (userAnswer: boolean) => {
      return correctAnswer === userAnswer;
    };

    switch (curRoundPhase) {
      case "NONE": {
        resetStates();
        break;
      }

      case "ROUND_START": {
        backgroundRef.current!.playIdleAnimation();
        startAnimation(() => setIsVisibleVisitor(true));
        break;
      }

      case "PRESENTING_QUESTION": {
        setIsVisibleAnswer(true);
        setIsVisibleActionBar(true);
        break;
      }

      case "ANSWER_SUBMITTED": {
        startAnimation(() => visitorRef.current?.setStatus("disappear"));
        setIsVisibleAnswer(false);
        setIsVisibleActionBar(false);

        if (!userAnswer) {
          startAnimation(() => backgroundRef?.current?.playGuardAnimation());
        }
        break;
      }

      case "SHOW_RESULT": {
        if (isCorrect(userAnswer!)) {
          setRoundResult(ROUND_RESULT.RIGHT);
        } else {
          setRoundResult(ROUND_RESULT.WRONG);
        }

        startAnimation(() => setIsVisibleRoundResult(true));

        break;
      }

      case "ROUND_ENDED": {
        reportRoundOutcome({
          isCorrect: isCorrect(userAnswer!),
          userAnswer: userAnswer!,
        });
        break;
      }

      default:
        break;
    }
  }, [curRoundPhase]);

  return (
    <RoundContext.Provider
      value={{
        setRoundPhaseIdx,
        curRoundPhase,
        backgroundRef,
        visitorRef,
        isVisibleVisitor,
        isVisibleAnswer,
        isVisibleActionBar,
        setIsVisibleVisitor,
        updatePendingAnimationsCount,
        submitAnswer,
        setCorrectAnswer,
        isVisibleRoundResult,
        setIsVisibleRoundResult,
        roundResult,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};

export function useRoundManager() {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRoundManager must be used within a CounterProvider");
  }
  return context;
}
