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
import { BackgroundSpriteHandle } from "../components/sprites/BackgroundSprite";
import { VisitorSpriteHandle } from "../components/sprites/VisitorSprite";
import { useStageManager } from "./use-stage-manager";

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
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

const roundPhase = [
  "NONE",
  "ROUND_START",
  "PRESENTING_QUESTION",
  "ANSWER_SUBMITTED",
  // "SHOW_RESULT",
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
};

export const RoundProvider = ({ children }: { children: ReactNode }) => {
  const { curStagePhase, reportRoundOutcome, curRoundIdx } = useStageManager();
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
    if (curStagePhase === "NONE" || curStagePhase === "PREPARE") {
      setRoundPhaseIdx(0);
    } else if (curStagePhase === "ROUNDS_IN_PROGRESS") {
      // 라운드 시작
      setRoundPhaseIdx(1);
    }
  }, [curStagePhase, curRoundIdx]);

  useEffect(() => {
    // 에니메이션 실행 함수
    const startAnimation = (func: (...args: unknown[]) => unknown) => {
      updatePendingAnimationsCount("increment");
      func();
    };

    const isCorrect = (userAnswer: boolean) => {
      return correctAnswer === userAnswer;
    };

    if (curRoundPhase === "NONE") {
      resetStates();
    } else if (curRoundPhase === "ROUND_START") {
      backgroundRef.current!.playIdleAnimation();
      // visitor 등장 -> visitor appear가 종료되어야 다음 페이즈로 넘어간다.
      startAnimation(() => setIsVisibleVisitor(true));
      // footer empty?
    } else if (curRoundPhase === "PRESENTING_QUESTION") {
      // 문제를 출제한다.
      // visitor 말풍선 text
      setIsVisibleAnswer(true);
      // footer text
      setIsVisibleActionBar(true);
    } else if (curRoundPhase === "ANSWER_SUBMITTED") {
      startAnimation(() => visitorRef.current?.setStatus("disappear"));
      setIsVisibleAnswer(false);
      setIsVisibleActionBar(false);

      if (!userAnswer) {
        // 유저 answer이 guard 일 경우
        startAnimation(() => backgroundRef?.current?.playGuardAnimation());
      }
    } else if (curRoundPhase === "ROUND_ENDED") {
      reportRoundOutcome({ isCorrect: isCorrect(userAnswer!) });
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
