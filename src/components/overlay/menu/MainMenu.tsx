"use client";

import { MenuOverlay, useMenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import CreditMenu from "./CreditMenu";

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
