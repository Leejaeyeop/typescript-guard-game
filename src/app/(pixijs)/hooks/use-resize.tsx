import { RefObject, useEffect } from "react";
import { MIN_SIZE } from "../constants/sizes";

export const useResize = (domRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    // 2. 높이를 계산하고 설정하는 함수
    const adjustAppContainerHeight = () => {
      if (!domRef.current) return;

      const parentWidth = domRef.current.parentElement!.offsetWidth; // 부모 요소의 실제 너비
      const viewportHeight = window.innerHeight; // 뷰포트의 실제 높이

      // w-full (부모 너비) 와 100vh (뷰포트 높이) 중 더 작은 값
      let minDimension = Math.min(parentWidth, viewportHeight);

      if (minDimension < MIN_SIZE) {
        minDimension = MIN_SIZE;
      }

      domRef.current.style.width = minDimension + "px";
      domRef.current.style.height = minDimension + "px";
    };
    // 컴포넌트 마운트 시 초기 높이 설정
    adjustAppContainerHeight();

    // 윈도우 리사이즈 이벤트에 리스너 등록
    window.addEventListener("resize", adjustAppContainerHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제 (클린업 함수)
    return () => {
      window.removeEventListener("resize", adjustAppContainerHeight);
    };
  }, [domRef]);
};
