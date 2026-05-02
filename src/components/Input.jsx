import { cn } from "../lib/utils";

const Input = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={cn(
        "w-full p-3 outline-none focus:ring-2 bg-amber-50 font-bold text-zinc-800 placeholder-zinc-500 focus:ring-offset-lime-200 rounded-xl placeholder:font-bold",
        className,
      )}
    />
  );
};

export { Input };
