import Modal from "../common/Modal";

const variantClass = {
    red: "bg-red-600 hover:bg-red-500",
    green: "bg-green-600 hover:bg-green-500",
    yellow: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900",
    blue: "bg-blue-600 hover:bg-blue-500",
    purple: "bg-purple-600 hover:bg-purple-500",
};

function ConfirmModal({ isOpen, onClose, onConfirm, loading, title, message, confirmLabel, confirmVariant = "red" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-zinc-300 text-sm mb-6">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`${variantClass[confirmVariant]} text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50`}
        >
          {loading ? "Aguarde..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export { ConfirmModal }