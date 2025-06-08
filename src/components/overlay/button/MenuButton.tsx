type MenuButtonProps = React.ComponentProps<"button">;

export function MenuButton({ children, className, ...rest }: MenuButtonProps) {
  return (
    <button
      className={
        `text-center border-2 w-full border-black hover:cursor-pointer hover:-translate-y-1 hover:scale-105 ` +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
