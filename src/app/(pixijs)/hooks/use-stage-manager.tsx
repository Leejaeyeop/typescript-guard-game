import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Quiz } from "@/types/quiz";
import { DifficultyLevel } from "@/types/difficultyLevel";
import { useMenuStore } from "@/store/useMenuStore";
import { ResultMenu } from "@/components/overlay/menu/ResultMenu";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";

type StageContextType = {
  // score
  score: number;
  // 현재 라운드 idx
  curRoundIdx: number;
  setCurRoundIdx: Dispatch<SetStateAction<number>>;
  // 퀴즈들
  quizes: Quiz[];
  curStagePhase: (typeof stagePhase)[number];
  setStagePhaseIdx: Dispatch<SetStateAction<number>>;
  setStageDifficultyLevel: Dispatch<SetStateAction<DifficultyLevel | null>>;
  curRoundQuiz: Quiz;
  reportRoundOutcome: (result: { isCorrect: boolean }) => void;
  isVisibleOption: boolean;
  initStage: () => void;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
};

const stagePhase = [
  "NONE",
  "PREPARE",
  "STAGE_START",
  "ROUNDS_IN_PROGRESS",
  "STAGE_RESULTS",
  "STAGE_CONCLUDED",
] as const;

const initialStageState = {
  stagePhaseIdx: 0,
  stageDifficultyLevel: null,
  score: 0,
  curRoundIdx: 0,
  quizes: [],
  isVisibleOption: false,
  isPaused: false,
};

const StageContext = createContext<StageContextType | undefined>(undefined);

export const StageProvider = ({ children }: { children: ReactNode }) => {
  // 스테이지 페이즈
  const [stagePhaseIdx, setStagePhaseIdx] = useState(
    initialStageState.stagePhaseIdx
  );
  const { activeScene } = useAppStore();

  // 스테이지 난이도
  const [stageDifficultyLevel, setStageDifficultyLevel] =
    useState<DifficultyLevel | null>(initialStageState.stageDifficultyLevel);
  const [score, setScore] = useState(initialStageState.score);
  const [isVisibleOption, setIsVisibleOption] = useState(
    initialStageState.isVisibleOption
  );
  const [curRoundIdx, setCurRoundIdx] = useState(initialStageState.curRoundIdx);
  const [isPaused, setIsPaused] = useState(initialStageState.isPaused);
  const [quizes, setQuizes] = useState<Quiz[]>([]);

  const { openMenu, setMenuOverlay } = useMenuStore();

  // reset 로직
  const resetStates = () => {
    setScore(initialStageState.score);
    setIsVisibleOption(initialStageState.isVisibleOption);
    setCurRoundIdx(initialStageState.curRoundIdx);
    setQuizes(initialStageState.quizes);
    setIsPaused(false);
  };

  const initStage = () => {
    setStagePhaseIdx(1);
  };

  const curStagePhase = useMemo(() => {
    return stagePhase[stagePhaseIdx];
  }, [stagePhaseIdx]);

  const curRoundQuiz = useMemo<Quiz>(() => {
    return quizes[curRoundIdx];
  }, [quizes, curRoundIdx]);

  const reportRoundOutcome = ({ isCorrect }: { isCorrect: boolean }) => {
    // 점수 획득
    if (isCorrect) {
      setScore(score + 1);
    }
    if (curRoundIdx === quizes.length - 1) {
      // 퀴즈가 전부 종료됨
      setStagePhaseIdx(stagePhaseIdx + 1);
    } else {
      // 다음 퀴즈로 넘어감
      setCurRoundIdx(curRoundIdx + 1);
    }
  };

  // main menu scene 설정 직후
  useEffect(() => {
    if (activeScene === SCENE_IDS.MAIN) {
      // none
      setStagePhaseIdx(0);
    }
  }, [activeScene]);

  useEffect(() => {
    // 메인 메뉴
    if (curStagePhase === "NONE") {
      resetStates();
      // api 호출
    } else if (curStagePhase === "PREPARE") {
      // 재시작 / 다음 스테이지 바로 사작 등을 상정
      resetStates();
      // test api 호출
      fetch(`https://jsonplaceholder.typicode.com/posts/30`).then(() => {
        setQuizes([
          {
            id: 1,
            question: `type Foo = string\nconst foo:Foo = 123`,
          },
          {
            id: 2,
            question: `const a: number = 123;`,
          },
          {
            id: 3,
            question: `const a: string | number = 123;`,
          },
        ]);
        setIsVisibleOption(true);

        // 다음 페이즈 시작
        setStagePhaseIdx(2);
      });
    } else if (curStagePhase === "STAGE_START") {
      // option 아이콘 생성
      // 만약 intro 있으면 기타등...
      setStagePhaseIdx(3);
    } else if (curStagePhase === "ROUNDS_IN_PROGRESS") {
    } else if (curStagePhase === "STAGE_RESULTS") {
      setMenuOverlay(<ResultMenu />);
      openMenu();
    }
  }, [curStagePhase]);

  return (
    <StageContext.Provider
      value={{
        quizes,
        curRoundIdx,
        setCurRoundIdx,
        curStagePhase,
        score,
        setStagePhaseIdx,
        setStageDifficultyLevel,
        curRoundQuiz,
        reportRoundOutcome,
        isVisibleOption,
        initStage,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </StageContext.Provider>
  );
};

export function useStageManager() {
  const context = useContext(StageContext);

  if (!context) {
    throw new Error("useRoundManager must be used within a CounterProvider");
  }
  return context;
}
