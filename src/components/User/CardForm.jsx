import { cn } from "../../lib/utils";

const CardForm = ({ title, children, className }) => {
  return (
    <div className="flex flex-col gap-8 w-4/5 text-white">
      <h1 className="text-4xl">{title}</h1>
      <div
        className={cn(
          "bg-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-2 justify-start",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { CardForm };
