import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = 48, className = "" }) => {
  return (
    <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <Loader2
        size={size}
        color="yellow"
        className={`animate-spin${className}`}
      />
    </div>
  );
};

export default LoadingSpinner;
