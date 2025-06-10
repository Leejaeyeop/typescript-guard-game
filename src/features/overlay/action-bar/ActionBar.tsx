// The refactored ActionBar component

import { ActionButton } from "@/components/ui/button/ActionButton";
import { useRoundManager } from "@/contexts/RoundProvider";

export function ActionBar() {
  const { roundState, submitAnswer } = useRoundManager();
  const isActionDisabled = roundState.phase !== "PRESENTING_QUESTION";

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
          imageSrc="/assets/ui/pass_button.webp"
          onClick={() => submitAnswer(true)}
          disabled={isActionDisabled}
        />
        <ActionButton
          label="guard"
          imageSrc="/assets/ui/guard_button.webp"
          onClick={() => submitAnswer(false)}
          disabled={isActionDisabled}
        />
      </div>
    </footer>
  );
}
