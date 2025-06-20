"use client";

import { MenuOverlay, useMenuOverlay } from "../MenuOverlay";
import { SelectDifficultyLevel } from "./SelectDifficultyLevelMenu";
import CreditMenu from "./CreditMenu";
import { MenuButton } from "@/components/ui/button/MenuButton";
import { SettingMenu } from "./SettingMenu";
import { MenuTitle } from "@/components/ui/slot/MenuTitle";
import Image from "next/image";

function MainMenuContent() {
  const { pushMenuContext } = useMenuOverlay();

  return (
    <>
      <MenuTitle className="mb-5" asChild>
        <Image
          src="/assets/ui/logo.webp"
          alt="logo"
          width={300}
          height={200}
          priority={true}
        />
      </MenuTitle>
      <MenuButton
        aria-label="Start Game"
        onClick={() => pushMenuContext(<SelectDifficultyLevel />)}
      >
        Start Game
      </MenuButton>
      <MenuButton
        aria-label="Settings"
        onClick={() => pushMenuContext(<SettingMenu />)}
      >
        Settings
      </MenuButton>
      <MenuButton
        aria-label="Credit"
        onClick={() => pushMenuContext(<CreditMenu />)}
      >
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
