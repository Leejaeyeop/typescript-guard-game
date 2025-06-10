"use client";

import { MenuOverlay, useMenuOverlay } from "../MenuOverlay";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import CreditMenu from "./CreditMenu";
import { MenuButton } from "@/components/ui/button/MenuButton";

function MainMenuContent() {
  const { pushMenuContext } = useMenuOverlay();

  return (
    <>
      <MenuButton onClick={() => pushMenuContext(<SelectDifficultyLevel />)}>
        Play Game
      </MenuButton>
      <MenuButton onClick={() => pushMenuContext(<CreditMenu />)}>
        Credit
      </MenuButton>
    </>
  );
}

export function MainMenu() {
  return (
    <MenuOverlay>
      <MainMenuContent></MainMenuContent>
    </MenuOverlay>
  );
}
