export function DeleteButton({ user, onDelete }) {
  return (
    <button
      onClick={() => onDelete(user)}
      className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-red-900 border border-red-900 rounded-lg hover:bg-red-400 hover:border-red-400  transition-colors active:scale-95 cursor-pointer"
    >
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" />
      </svg>
      Deletar Usuário
    </button>
  );
}
