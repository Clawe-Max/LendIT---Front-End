import { TriangleAlert } from "lucide-react";
import { cn } from "../../lib/utils";

const ErrorMessage = ({ message, className }) => {
  if (!message) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm font-semibold text-red-400",
        className
      )}
    >
      <TriangleAlert className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
};

export { ErrorMessage };
