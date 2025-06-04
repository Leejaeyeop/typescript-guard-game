type MenuButtonProps = React.ComponentProps<"button">;

export function MenuButton({ children, className, ...rest }: MenuButtonProps) {
  return (
    <button
      className={
        `text-center border-2 w-full border-black hover:cursor-pointer ` +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
