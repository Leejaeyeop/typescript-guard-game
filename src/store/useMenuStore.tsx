import { MainMenu } from "@/components/overlay/menu/MainMenu";
import { ReactNode } from "react";
import { create } from "zustand";

// 스토어의 상태와 액션에 대한 타입 정의
interface ManuState {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  menuOverlay: ReactNode | null;
  setMenuOverlay: (content: ReactNode) => void;
}

// 스토어 생성
export const useMenuStore = create<ManuState>((set) => ({
  isMenuOpen: true,
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  menuOverlay: <MainMenu />,
  setMenuOverlay: (content: ReactNode) => set({ menuOverlay: content }),
}));
