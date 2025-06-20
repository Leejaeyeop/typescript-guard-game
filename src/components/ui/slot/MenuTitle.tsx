import React from "react";

interface MenuTitleProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function MenuTitle({
  asChild = false,
  className = "",
  children,
  ...restProps
}: MenuTitleProps) {
  if (asChild) {
    if (
      React.Children.count(children) !== 1 ||
      !React.isValidElement(children)
    ) {
      console.error(
        'The MenuTitle component with "asChild" requires a single valid React element as a child.'
      );
      return null;
    }

    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >; // 명시적으로 단언

    return React.cloneElement(child, {
      ...child.props, // 먼저 복사
      ...restProps, // 외부에서 전달된 props는 덮어쓰기
      style: {
        ...child.props.style,
        ...restProps.style, // 외부 스타일이 우선 적용되도록
      },
      className: [child.props.className, className].filter(Boolean).join(" "),
    });
  }

  return (
    <div className={"text-3xl text-center " + className} {...restProps}>
      {children}
    </div>
  );
}

MenuTitle.displayName = "MenuTitle";

export { MenuTitle };
