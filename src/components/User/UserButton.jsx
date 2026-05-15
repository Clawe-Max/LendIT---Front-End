import { cn } from "../../lib/utils";

const UserButton = ({ children, className, ...rest }) => {
  return (
    <button
      {...rest}
      className={cn(
        "flex py-2 px-4  bg-zinc-900 shadow-xl/30 rounded-2xl text-neutral-500 font-semibold active:scale-95 cursor-pointer hover:scale-105",
        className,
      )}
    >
      {children}
    </button>
  );
};
export { UserButton };
