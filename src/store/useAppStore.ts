import { create } from "zustand";

// 스토어의 상태와 액션에 대한 타입 정의
interface AppState {
  isSoundOn: boolean;
  toggleSound: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (state: boolean) => void;
  // 다른 전역 상태 및 액션 추가 가능
  // 예: userPreferences: object;
  // 예: setUserPreference: (key: string, value: any) => void;
}

// 스토어 생성
export const useAppStore = create<AppState>((set) => ({
  isSoundOn: true, // 초기 사운드 상태
  setIsMenuOpen: (value) => set({ isMenuOpen: value }),
  isMenuOpen: true,
  toggleSound: () => set((state) => ({ isSoundOn: !state.isSoundOn })),
  // 다른 상태 초기값 및 액션 구현
}));
