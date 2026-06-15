const variants = {
    default: "bg-zinc-700 hover:bg-zinc-600 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold",
    red: "bg-red-600 hover:bg-red-500 text-white",
    green: "bg-green-600 hover:bg-green-500 text-white",
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    purple: "bg-purple-600 hover:bg-purple-500 text-white",
};

function ActionButton({ onClick, icon: Icon, label, variant = "default", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export { ActionButton }