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
  // correctCount
  correctCount: number;
  // 현재 라운드 idx
  curRoundIdx: number;
  setCurRoundIdx: Dispatch<SetStateAction<number>>;
  // 퀴즈들
  quizzes: Quiz[];
  curStagePhase: (typeof stagePhase)[number];
  setStagePhaseIdx: Dispatch<SetStateAction<number>>;
  setStageDifficultyLevel: Dispatch<SetStateAction<DifficultyLevel | null>>;
  curRoundQuiz: Quiz;
  reportRoundOutcome: (result: { isCorrect: boolean }) => void;
  isVisibleTopHUD: boolean;
  initStage: () => void;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  lifePoints: number;
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
  correctCount: 0,
  curRoundIdx: 0,
  quizzes: [],
  isVisibleTopHUD: false,
  isPaused: false,
  lifePoints: 5,
};
const StageContext = createContext<StageContextType | undefined>(undefined);

// 전체 문제 갯수
export const TOTAL_NUMBER_OF_QUESTIONS = 20;

interface StageProviderProps {
  children: ReactNode;
  totalQuizzes: Quiz[];
}

export const StageProvider = ({
  children,
  totalQuizzes,
}: StageProviderProps) => {
  // 스테이지 페이즈
  const [stagePhaseIdx, setStagePhaseIdx] = useState(
    initialStageState.stagePhaseIdx
  );
  const { activeScene } = useAppStore();

  // 스테이지 난이도
  const [stageDifficultyLevel, setStageDifficultyLevel] =
    useState<DifficultyLevel | null>(initialStageState.stageDifficultyLevel);
  const [correctCount, setCorrectCount] = useState(
    initialStageState.correctCount
  );
  const [isVisibleTopHUD, setIsVisibleTopHUD] = useState(
    initialStageState.isVisibleTopHUD
  );
  const [curRoundIdx, setCurRoundIdx] = useState(initialStageState.curRoundIdx);
  const [isPaused, setIsPaused] = useState(initialStageState.isPaused);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lifePoints, setLifePoints] = useState(initialStageState.lifePoints);

  const { openMenu, setMenuOverlay } = useMenuStore();

  // reset 로직
  const resetStates = () => {
    setCorrectCount(initialStageState.correctCount);
    setIsVisibleTopHUD(initialStageState.isVisibleTopHUD);
    setCurRoundIdx(initialStageState.curRoundIdx);
    setQuizzes(initialStageState.quizzes);
    setIsPaused(initialStageState.isPaused);
    setLifePoints(initialStageState.lifePoints);
  };

  const initStage = () => {
    setStagePhaseIdx(1);
  };

  const curStagePhase = useMemo(() => {
    return stagePhase[stagePhaseIdx];
  }, [stagePhaseIdx]);

  const curRoundQuiz = useMemo<Quiz>(() => {
    return quizzes[curRoundIdx];
  }, [quizzes, curRoundIdx]);

  const reportRoundOutcome = ({ isCorrect }: { isCorrect: boolean }) => {
    // 점수 획득
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setLifePoints(lifePoints - 1);

      // 라운드 종료
      if (lifePoints === 1) {
        setStagePhaseIdx(stagePhaseIdx + 1);
        return;
      }
    }

    if (curRoundIdx === quizzes.length - 1) {
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
    switch (curStagePhase) {
      case "NONE": {
        resetStates();
        // api 호출
        break;
      }

      case "PREPARE": {
        // 재시작 / 다음 스테이지 바로 시작 등을 상정
        resetStates();
        if (totalQuizzes.length === 0) {
          window.alert("Quiz data does not exist.");
          return;
        }

        // test api 호출
        setQuizzes(totalQuizzes);
        setIsVisibleTopHUD(true);

        // 다음 페이즈 시작
        setStagePhaseIdx(2);
        break;
      }

      case "STAGE_START": {
        // option 아이콘 생성
        // 만약 intro 있으면 기타 등등...
        setStagePhaseIdx(3);
        break;
      }

      case "ROUNDS_IN_PROGRESS": {
        // 현재 로직 없음
        break;
      }

      case "STAGE_RESULTS": {
        setIsVisibleTopHUD(false);
        let isFailed = false;
        // 스테이지 실패 (라이프 포인트 0)
        if (lifePoints === 0) {
          isFailed = true;
        }
        setMenuOverlay(
          <ResultMenu
            isFailed={isFailed}
            TotalNumberOfQuestions={TOTAL_NUMBER_OF_QUESTIONS}
            correctCount={correctCount}
          />
        );

        openMenu();
        break;
      }

      default:
        break;
    }
  }, [curStagePhase]);

  return (
    <StageContext.Provider
      value={{
        quizzes,
        curRoundIdx,
        setCurRoundIdx,
        curStagePhase,
        correctCount,
        setStagePhaseIdx,
        setStageDifficultyLevel,
        curRoundQuiz,
        reportRoundOutcome,
        isVisibleTopHUD,
        initStage,
        isPaused,
        setIsPaused,
        lifePoints,
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
