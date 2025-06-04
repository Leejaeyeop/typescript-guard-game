import { create } from "zustand";

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
}

export const useAppStore = create<AppState>((set) => ({
  isSoundOn: true, // 초기 사운드 상태
  activeScene: SCENE_IDS.MAIN, // 초기 활성 장면
  setActiveScene: (scene) => set({ activeScene: scene }),
}));
