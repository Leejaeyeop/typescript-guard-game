import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { Quiz } from "@/types/quiz";
import { DifficultyLevel } from "@/types/difficultyLevel";
import { useMenuStore } from "@/store/useMenuStore";
import { SCENE_IDS, useAppStore } from "@/store/useAppStore";
import { getRandomQuizzesByDifficulty } from "@/utils/quizUtils";
import { StageResultMenu } from "@/features/overlay/menu/components/StageResultMenu";

// --- Types and Constants ---
type STAGE_PHASES = [
  "NONE",
  "PREPARE",
  "STAGE_START",
  "ROUNDS_IN_PROGRESS",
  "STAGE_RESULTS",
  "STAGE_CONCLUDED",
];

type StagePhase = STAGE_PHASES[number];

type UserAnswerResult = { wasCorrect: boolean; userAnswer: boolean } & Quiz;

type StageState = {
  phase: StagePhase;
  difficultyLevel: DifficultyLevel | null;
  quizzes: Quiz[];
  correctCount: number;
  currentRoundIndex: number;
  lifePoints: number;
  isPaused: boolean;
  isVisibleTopHUD: boolean;
};

type StageContextType = {
  stageState: StageState;
  stageStateDispatch: Dispatch<Action>;
  currentQuiz: Quiz;
  userAnswerResults: RefObject<UserAnswerResult[]>;
  initStage: () => void;
  reportRoundOutcome: (result: {
    isCorrect: boolean;
    userAnswer: boolean;
  }) => void;
  setStageDifficulty: (level: DifficultyLevel) => void;
};

// --- Reducer and Actions ---

type Action =
  | { type: "RESET_TO_NONE" }
  | { type: "SET_DIFFICULTY"; payload: DifficultyLevel }
  | { type: "INIT_STAGE" }
  | {
      type: "PREPARE_STAGE";
      payload: { allQuizzes: Quiz[]; difficulty: DifficultyLevel };
    }
  | { type: "START_STAGE" }
  | {
      type: "REPORT_ROUND_OUTCOME";
      payload: { isCorrect: boolean; userAnswer: boolean };
    }
  | { type: "TOGGLE_PAUSE"; payload: boolean };

const initialState: StageState = {
  phase: "NONE",
  difficultyLevel: null,
  quizzes: [],
  correctCount: 0,
  currentRoundIndex: 0,
  lifePoints: 3,
  isPaused: false,
  isVisibleTopHUD: false,
};

function stageReducer(stageState: StageState, action: Action): StageState {
  switch (action.type) {
    case "RESET_TO_NONE":
      return { ...initialState };
    case "SET_DIFFICULTY":
      return { ...stageState, difficultyLevel: action.payload };
    case "INIT_STAGE":
      return { ...stageState, phase: "PREPARE" };
    case "PREPARE_STAGE":
      return {
        ...initialState, // Reset stats for a new stage
        difficultyLevel: action.payload.difficulty,
        quizzes: getRandomQuizzesByDifficulty(
          action.payload.allQuizzes,
          action.payload.difficulty
        ),
        phase: "STAGE_START",
        isVisibleTopHUD: true,
      };
    case "START_STAGE":
      return { ...stageState, phase: "ROUNDS_IN_PROGRESS" };
    case "REPORT_ROUND_OUTCOME": {
      const { isCorrect } = action.payload;
      const newCorrectCount = isCorrect
        ? stageState.correctCount + 1
        : stageState.correctCount;
      const newLifePoints = isCorrect
        ? stageState.lifePoints
        : stageState.lifePoints - 1;

      const isLastQuiz =
        stageState.currentRoundIndex === stageState.quizzes.length - 1;
      const isGameOver = newLifePoints === 0;

      if (isLastQuiz || isGameOver) {
        return {
          ...stageState,
          correctCount: newCorrectCount,
          lifePoints: newLifePoints,
          phase: "STAGE_RESULTS",
          isVisibleTopHUD: false,
        };
      }
      return {
        ...stageState,
        correctCount: newCorrectCount,
        lifePoints: newLifePoints,
        currentRoundIndex: stageState.currentRoundIndex + 1,
      };
    }
    case "TOGGLE_PAUSE":
      return { ...stageState, isPaused: action.payload };
    default:
      throw new Error("Unhandled action type in stageReducer");
  }
}

// --- Context and Provider ---

const StageContext = createContext<StageContextType | undefined>(undefined);

interface StageProviderProps {
  children: ReactNode;
  totalQuizzes: Quiz[];
}

export const StageProvider = ({
  children,
  totalQuizzes,
}: StageProviderProps) => {
  const [stageState, stageStateDispatch] = useReducer(
    stageReducer,
    initialState
  );
  const { activeScene } = useAppStore();
  const { openMenu, setMenuOverlay } = useMenuStore();

  const userAnswerResults = useRef<UserAnswerResult[]>([]);

  const currentQuiz = useMemo<Quiz>(() => {
    return stageState.quizzes[stageState.currentRoundIndex];
  }, [stageState.quizzes, stageState.currentRoundIndex]);

  // Handler functions to simplify dispatching from components
  const initStage = () => stageStateDispatch({ type: "INIT_STAGE" });
  const setStageDifficulty = (level: DifficultyLevel) =>
    stageStateDispatch({ type: "SET_DIFFICULTY", payload: level });

  const reportRoundOutcome = useCallback(
    ({
      isCorrect,
      userAnswer,
    }: {
      isCorrect: boolean;
      userAnswer: boolean;
    }) => {
      userAnswerResults.current.push({
        ...currentQuiz,
        wasCorrect: isCorrect,
        userAnswer,
      });

      stageStateDispatch({
        type: "REPORT_ROUND_OUTCOME",
        payload: { isCorrect, userAnswer },
      });
    },
    [currentQuiz]
  );

  // Effect for handling scene changes from the app store
  useEffect(() => {
    if (activeScene === SCENE_IDS.MAIN) {
      stageStateDispatch({ type: "RESET_TO_NONE" });
      userAnswerResults.current = [];
    }
  }, [activeScene]);

  // Effect for handling logic based on the current stage phase (Side Effects)
  useEffect(() => {
    switch (stageState.phase) {
      case "PREPARE":
        if (totalQuizzes.length === 0 || !stageState.difficultyLevel) {
          window.alert("Quiz data or difficulty level is missing.");
          stageStateDispatch({ type: "RESET_TO_NONE" });
          return;
        }

        stageStateDispatch({
          type: "PREPARE_STAGE",
          payload: {
            allQuizzes: totalQuizzes,
            difficulty: stageState.difficultyLevel,
          },
        });
        userAnswerResults.current = [];

        break;

      case "STAGE_START":
        // This is a great place for intro animations, then dispatching the next phase.
        stageStateDispatch({ type: "START_STAGE" });
        break;

      case "STAGE_RESULTS": {
        const isFailed = stageState.lifePoints === 0;
        setMenuOverlay(
          <StageResultMenu
            isFailed={isFailed}
            TotalNumberOfQuestions={stageState.quizzes.length}
            correctCount={stageState.correctCount}
          />
        );
        openMenu();
        break;
      }
    }
    // NOTE: we intentionally run this effect only when `stageState.phase` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageState.phase]);

  const contextValue = useMemo(
    () => ({
      stageState,
      stageStateDispatch,
      currentQuiz,
      userAnswerResults,
      initStage,
      reportRoundOutcome,
      setStageDifficulty,
    }),
    [stageState, currentQuiz, reportRoundOutcome]
  );

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  );
};

export function useStageManager() {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error("useStageManager must be used within a StageProvider");
  }
  return context;
}
