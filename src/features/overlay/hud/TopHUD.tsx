import { useMenuStore } from "@/store/useMenuStore";
import { useShallow } from "zustand/shallow";
import { useStageManager } from "@/contexts/StageProvider";
import Image from "next/image";
import { PauseMenu } from "../menu/components/PauseMenu";

export function TopHUD() {
  const { setMenuOverlay, openMenu } = useMenuStore(
    useShallow((state) => ({
      setMenuOverlay: state.setMenuOverlay,
      openMenu: state.openMenu,
    }))
  );

  const { stageState } = useStageManager();

  const handleOpenPauseMenu = () => {
    openMenu();
    setMenuOverlay(<PauseMenu />);
  };

  return (
    <header className="absolute top-0 left-0 w-full h-[10vh] flex items-center justify-between px-6 text-white z-10">
      {/* 왼쪽: 게임 상태 정보 */}
      <div className="flex items-center space-x-6 text-lg font-semibold">
        {/* 라이프 포인트 */}
        <div
          className="flex items-center gap-1"
          role="status" // 이 영역이 동적으로 변하는 상태 정보임을 명시
          aria-live="polite" // 내용이 변경되면 스크린 리더가 부드럽게 알림
          aria-label={`the rest of points: ${stageState.lifePoints}`}
        >
          <span aria-hidden="true">❤️ x </span>{" "}
          {/* 이모지는 시각적 요소이므로 스크린 리더가 읽지 않도록 처리 */}
          <span>{stageState.lifePoints}</span>
        </div>

        {/* 퀴즈 진행도 */}
        <div
          className="tabular-nums" // 숫자 너비를 고정하여 값이 바뀔 때 UI가 떨리는 현상 방지
          role="status"
          aria-live="polite"
          aria-label={`Quiz progress: of ${
            stageState.currentRoundIndex + 1
          } of  ${stageState.quizzes.length}`}
        >
          <span>{stageState.currentRoundIndex + 1}</span>
          <span aria-hidden="true"> / </span>
          <span>{stageState.quizzes.length}</span>
        </div>
      </div>

      {/* 오른쪽: 옵션 버튼 */}
      <button
        type="button"
        aria-label="open pause menu" // 버튼의 명확한 동작 설명
        className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-opacity-75"
        onClick={handleOpenPauseMenu}
      >
        <Image
          src="/assets/ui/option.webp"
          alt="" // 버튼에 aria-label이 있으므로 이미지는 장식용(decorative)
          width={40}
          height={40}
          priority={true}
        />
      </button>
    </header>
  );
}
