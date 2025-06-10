import Image from "next/image";

interface ActionButtonProps {
  label: string; // 스크린 리더가 읽을 명확한 레이블
  imageSrc: string;
  onClick: () => void;
  disabled: boolean;
}

export function ActionButton({
  label,
  imageSrc,
  onClick,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className="w-1/5 relative transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
    >
      <Image
        src={imageSrc}
        alt="" // 이미지는 순전히 장식용이므로 alt는 비워둠
        width={500}
        height={100}
        priority={true} // LCP(Largest Contentful Paint)에 해당할 수 있으므로 유지
      />
      {/* 시각적으로는 숨겨지지만 스크린 리더는 읽을 수 있는 텍스트 */}
      <span className="sr-only">{label}</span>
    </button>
  );
}
