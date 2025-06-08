import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const SCENE_IDS = {
  MAIN: "Main",
  QUIZ_STAGE: "QuizStage",
} as const;

export type SceneId = (typeof SCENE_IDS)[keyof typeof SCENE_IDS];

interface AppState {
  isSoundOn: boolean;
  // scene 상태
  activeScene: SceneId; // 정의한 SceneId 타입을 사용
  setActiveScene: (scene: SceneId) => void;
  dontShowAgain: boolean;
  setDontShowAgain: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // --- 스토어의 전체 상태 및 액션 정의 ---
      isSoundOn: true,
      activeScene: SCENE_IDS.MAIN,
      dontShowAgain: false,

      setActiveScene: (scene) => set({ activeScene: scene }),
      // dontShowAgain 상태를 true로 설정하는 액션
      setDontShowAgain: (state) => set({ dontShowAgain: state }),
    }),
    {
      name: "type-guard-game-settings", // localStorage에 저장될 키
      storage: createJSONStorage(() => localStorage),
      // partialize: localStorage에 저장할 상태만 선택합니다.
      partialize: (state) => ({
        isSoundOn: state.isSoundOn, // ✨ isSoundOn도 저장하도록 추가
        dontShowAgain: state.dontShowAgain,
      }),
    }
  )
);
