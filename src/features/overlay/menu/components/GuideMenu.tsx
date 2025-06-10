import { useMenuStore } from "@/store/useMenuStore";
import { MenuOverlay } from "../MenuOverlay";
import { MainMenu } from "./MainMenu";
import { useAppStore } from "@/store/useAppStore";
import { MenuButton } from "@/components/ui/button/MenuButton";

function GuideMenuContent() {
  const { setMenuOverlay } = useMenuStore();
  const { dontShowAgain, setDontShowAgain } = useAppStore();

  return (
    <>
      <section className="flex flex-col justify-center items-center text-center w-full">
        <h1 className="text-black text-2xl sm:text-4xl font-bold mb-3">
          Welcome to Type Guard
        </h1>

        <p className="text-black-300 text-base sm:text-lg">
          You are the last line of defense for Type World, a realm built on
          clean, type-safe code. Your mission is to protect it from the chaos of
          <strong className="text-red-500">
            {" "}
            compile-time and runtime errors.
          </strong>
        </p>

        <h2 className="text-black-400 text-xl sm:text-2xl font-bold border-b border-black-600 pb-3 mt-8">
          How to Play
        </h2>

        <ul className="list-none p-0 mt-5 text-left text-sm sm:text-base space-y-3">
          <li className="bg-black-700/50 p-4 rounded-lg border-l-4 border-black-600">
            Visitors will approach the gate and present their code for
            inspection.
          </li>
          <li className="bg-black-700/50 p-4 rounded-lg border-l-4 border-black-600">
            If the code is valid and type-safe, click the{" "}
            <strong className="text-green-500">Pass</strong> button to let them
            through.
          </li>
          <li className="bg-black-700/50 p-4 rounded-lg border-l-4 border-black-600">
            If the code contains a type error or would cause an issue, click the{" "}
            <strong className="text-gray-400">Guard</strong> button to block
            them and protect the realm.
          </li>
        </ul>

        <p className="text-black-500 italic mt-8 text-sm sm:text-base">
          Your sharp eyes and knowledge of TypeScript are all that stand between
          order and chaos. Good luck, guard!
        </p>
      </section>

      <div className="flex mt-2">
        <input
          type="checkbox"
          id="dont-show-again"
          className="h-4 w-5 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500"
          checked={dontShowAgain}
          onChange={() => setDontShowAgain(!dontShowAgain)}
        />
        <label
          htmlFor="dont-show-again"
          className="ml-1 text-xs sm:text-sm text-black select-none"
        >
          Don&apos;t show again
        </label>
      </div>

      <MenuButton onClick={() => setMenuOverlay(<MainMenu />)}>
        Click to Play
      </MenuButton>
    </>
  );
}

export function GuideMenu() {
  return (
    <MenuOverlay>
      <GuideMenuContent></GuideMenuContent>
    </MenuOverlay>
  );
}

export default GuideMenu;
