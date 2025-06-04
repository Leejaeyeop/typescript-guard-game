"use client";

import { MenuOverlay, useMenuOverlay } from "./MenuOverlay";
import { MenuButton } from "../button/MenuButton";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";

function MainMenuContent() {
  const { pushMenuContext } = useMenuOverlay();

  return (
    <>
      <MenuButton onClick={() => pushMenuContext(<SelectDifficultyLevel />)}>
        Play Game
      </MenuButton>
      <MenuButton>Credit</MenuButton>
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
