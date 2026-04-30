import { cn } from "../../lib/utils";

const UserButton = ({ buttonName, className }) => {
  return (
    <button
      className={cn(
        "flex py-2 px-4  bg-yellow-950 shadow-xl/30 rounded-2xl text-neutral-500 font-semibold active:scale-95 cursor-pointer",
        className,
      )}
    >
      {buttonName}
    </button>
  );
};
export { UserButton };
