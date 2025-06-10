import { useRef } from "react";
import Image from "next/image";

const MD_MIN_WIDHT = 0.7;
const MD_MIN_HEIGHT = 0.3;

const MIN_WIDHT = 0.5;
const MIN_HEIGHT = 0.25;

const MAX_WIDHT = 0.8;
const MAX_HEIGHT = 0.4;

interface ResizableContainerProps {
  children: React.ReactNode;
  hidden: boolean;
}

const ResizableContainer = ({ children, hidden }: ResizableContainerProps) => {
  const originalSize = useRef({ width: MIN_WIDHT, height: MIN_HEIGHT }); // % 기준 (w-[70%], h-1/3)
  const boxRef = useRef<HTMLDivElement>(null);

  // 드래그 핸들
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isTouch = "touches" in e;
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    const startSize = {
      ...originalSize.current,
    };

    if (boxRef.current?.style.width) {
      startSize.width =
        parseFloat(boxRef.current!.style.width.replace("%", "")) / 100;
      startSize.height =
        parseFloat(boxRef.current!.style.height.replace("%", "")) / 100;
    }

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!boxRef.current) return;
      const moveX =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
      const moveY =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientY
          : moveEvent.clientY;

      const rect = boxRef.current.getBoundingClientRect();

      const dx = moveX - startX;
      const dy = moveY - startY;

      // 윈도우 기준 비율 계산
      const deltaW = dx / rect.width;
      const deltaH = dy / rect.height / 2;

      const newWidth = Math.min(
        MAX_WIDHT,
        Math.max(originalSize.current.width, startSize.width + deltaW)
      );
      const newHeight = Math.min(
        MAX_HEIGHT,
        Math.max(originalSize.current.height, startSize.height - deltaH)
      );

      if (boxRef.current) {
        boxRef.current.style.width = `${newWidth * 100}%`;
        boxRef.current.style.height = `${newHeight * 100}%`;
      }
    };

    const handleEnd = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);

      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
  };

  const handleClick = (size: "MIN" | "MAX") => {
    if (!boxRef.current) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    let newWidth = 0;
    let newHeight = 0;
    if (size === "MIN") {
      if (isMobile) {
        newWidth = MD_MIN_WIDHT;
        newHeight = MD_MIN_HEIGHT;
      } else {
        newWidth = MIN_WIDHT;
        newHeight = MIN_HEIGHT;
      }
    } else {
      newWidth = MAX_WIDHT;
      newHeight = MAX_HEIGHT;
    }

    boxRef.current.style.width = `${newWidth * 100}%`;
    boxRef.current.style.height = `${newHeight * 100}%`;
  };

  return (
    <div
      ref={boxRef}
      className={`absolute bottom-[45%] left-1/2 transform -translate-x-1/2 ${
        hidden && "hidden"
      } h-1/3 w-[70%] md:h-[25%] md:w-1/2 bg-gray-600 px-2 py-2 rounded-xl shadow-md`}
    >
      <div className="h-5 flex text-white gap-4 justify-end">
        <button
          className="cursor-pointer text-xs hover:opacity-50"
          onClick={() => handleClick("MIN")}
          aria-label="minimize size"
        >
          [MIN]
        </button>
        <button
          className="cursor-pointer text-xs hover:opacity-50"
          onClick={() => handleClick("MAX")}
          aria-label="maximize size"
        >
          [MAX]
        </button>

        {/* 드래그 핸들 오른쪽 대각선 */}
        <button
          className="w-3 h-3 cursor-sw-resize"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          aria-label="sizing handle"
        >
          <Image
            src="/assets/ui/resize.png"
            alt="resize"
            width={12}
            height={12}
            loading="eager"
            priority={true}
          />
        </button>
      </div>
      <div className="relative h-[calc(100%-24px)] w-full">{children}</div>
      {/* 말풍선 꼬리 */}
      <div className="absolute left-1/2 bottom-[-7px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-600"></div>
    </div>
  );
};

export default ResizableContainer;
