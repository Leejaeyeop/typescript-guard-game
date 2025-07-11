// The refactored ActionBar component

import { ActionButton } from "@/components/ui/button/ActionButton";
import { useRoundManager } from "@/contexts/round/RoundProvider";
import passButton from "@/assets/ui/button/pass_button.webp";
import guardButton from "@/assets/ui/button/guard_button.webp";

interface ActionBarProps {
  isActionDisabled: boolean;
}
export function ActionBar({ isActionDisabled }: ActionBarProps) {
  const { submitAnswer } = useRoundManager();

  return (
    <footer className="absolute bottom-0 w-full h-1/6">
      {/* 두 버튼을 그룹으로 묶고, 그룹의 목적을 설명하는 레이블 제공 */}
      <div
        role="group"
        aria-labelledby="action-bar-heading"
        className="h-full w-full flex justify-center items-center gap-[5%]"
      >
        {/* 스크린 리더 사용자에게 그룹의 목적을 알려주는 숨은 제목 */}
        <h2 id="action-bar-heading" className="sr-only">
          select action
        </h2>
        <ActionButton
          label="pass"
          imageSrc={passButton}
          onClick={() => submitAnswer(true)}
          disabled={isActionDisabled}
        />
        <ActionButton
          label="guard"
          imageSrc={guardButton}
          onClick={() => submitAnswer(false)}
          disabled={isActionDisabled}
        />
      </div>
    </footer>
  );
}
