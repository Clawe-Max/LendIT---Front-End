import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Trash2,
  CheckCircle,
  XCircle,
  PlayCircle,
  RotateCcw,
  PackageCheck,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import api from "../api/axios";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { UserContext } from "../user/UserContext";

const LOAN_URL = "/loan";

// Status possíveis: "analysis" | "accepted" | "started" | "returning"
const STATUS_LABEL = {
  analysis: { label: "Em Análise", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  accepted: { label: "Aceito", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  started: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  returning: { label: "Em Devolução", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
};

function ActionButton({ onClick, icon: Icon, label, variant = "default", disabled = false }) {
  const variants = {
    default: "bg-zinc-700 hover:bg-zinc-600 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold",
    red: "bg-red-600 hover:bg-red-500 text-white",
    green: "bg-green-600 hover:bg-green-500 text-white",
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    purple: "bg-purple-600 hover:bg-purple-500 text-white",
  };
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

function ConfirmModal({ isOpen, onClose, onConfirm, loading, title, message, confirmLabel, confirmVariant = "red" }) {
  const variantClass = {
    red: "bg-red-600 hover:bg-red-500",
    green: "bg-green-600 hover:bg-green-500",
    yellow: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900",
    blue: "bg-blue-600 hover:bg-blue-500",
    purple: "bg-purple-600 hover:bg-purple-500",
  };
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

function LoanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { data, loading, error, refetch } = useFetch(`${LOAN_URL}/${id}`);

  // Estados dos modais
  const [modal, setModal] = useState(null); // "delete" | "cancel" | "accept" | "start" | "startReturn" | "confirmReturn" | "confirmOverdue" | "editDate"
  const [actionLoading, setActionLoading] = useState(false);
  const [newDate, setNewDate] = useState("");

  function openModal(name) { setModal(name); }
  function closeModal() { setModal(null); }

  async function handleAction(apiCall) {
    try {
      setActionLoading(true);
      await apiCall();
      refetch();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Empréstimo não encontrado.</p>
        <button onClick={() => navigate(-1)} className="text-sm text-yellow-500 hover:text-yellow-400 underline">
          Voltar
        </button>
      </div>
    );
  }

  // Ajuste os campos conforme o que a API retornar
  const loan = data.data ?? data;
  const status = loan.status; // "analysis" | "accepted" | "started" | "returning"
  const statusInfo = STATUS_LABEL[status] ?? STATUS_LABEL.analysis;

  // ⚠️ Ajuste os IDs conforme o que a API retornar
  const currentUserId = user?.data?.id;
  const isOwner = currentUserId === loan.ownerId;
  const isReceiver = currentUserId === loan.receiverId;

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-8 max-w-3xl mx-auto">

      {/* Cabeçalho */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-yellow-400 transition-colors mb-4"
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Empréstimo #{loan.id}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Jogo: <span className="text-white font-medium">{loan.gameName ?? loan.game?.name ?? "—"}</span>
            </p>
          </div>
          {/* Badge de status */}
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Informações do empréstimo */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-zinc-500">Dono</span>
          <p className="text-white font-medium mt-0.5">{loan.ownerName ?? loan.owner?.name ?? "—"}</p>
        </div>
        <div>
          <span className="text-zinc-500">Recebedor</span>
          <p className="text-white font-medium mt-0.5">{loan.receiverName ?? loan.receiver?.name ?? "—"}</p>
        </div>
        <div>
          <span className="text-zinc-500">Data de início</span>
          <p className="text-white font-medium mt-0.5">
            {loan.startDate ? new Date(loan.startDate).toLocaleDateString("pt-BR") : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500">Data de devolução</span>
          <p className="text-white font-medium">{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString("pt-BR") : "—"}</p>
          {/* Recebedor pode editar a data em análise */}
          {isReceiver && status === "analysis" && (
            <button
              onClick={() => openModal("editDate")}
              className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400 transition-colors mt-0.5 w-fit"
            >
              <CalendarDays size={12} />
              Alterar data
            </button>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-wrap gap-3">

        {/* CHAT — análise e aceito */}
        {(status === "analysis" || status === "accepted") && (
          <ActionButton
            onClick={() => navigate("/chat")}
            icon={MessageCircle}
            label="Ir para o Chat"
            variant="default"
          />
        )}

        {/* EM ANÁLISE */}
        {status === "analysis" && (
          <>
            {/* Dono pode aceitar */}
            {isOwner && (
              <ActionButton
                onClick={() => openModal("accept")}
                icon={CheckCircle}
                label="Aceitar Empréstimo"
                variant="green"
              />
            )}
            {/* Ambos podem deletar */}
            <ActionButton
              onClick={() => openModal("delete")}
              icon={Trash2}
              label="Deletar"
              variant="red"
            />
          </>
        )}

        {/* ACEITO */}
        {status === "accepted" && (
          <>
            {/* Ambos podem cancelar */}
            <ActionButton
              onClick={() => openModal("cancel")}
              icon={XCircle}
              label="Cancelar"
              variant="red"
            />
            {/* Ambos podem iniciar */}
            <ActionButton
              onClick={() => openModal("start")}
              icon={PlayCircle}
              label="Iniciar Empréstimo"
              variant="yellow"
            />
          </>
        )}

        {/* INICIADO */}
        {status === "started" && (
          <>
            {/* Recebedor pode iniciar retorno */}
            {isReceiver && (
              <ActionButton
                onClick={() => openModal("startReturn")}
                icon={RotateCcw}
                label="Iniciar Devolução"
                variant="blue"
              />
            )}
          </>
        )}

        {/* EM DEVOLUÇÃO */}
        {status === "returning" && (
          <>
            {/* Dono pode confirmar devolução ou atraso */}
            {isOwner && (
              <>
                <ActionButton
                  onClick={() => openModal("confirmReturn")}
                  icon={PackageCheck}
                  label="Confirmar Devolução"
                  variant="green"
                />
                <ActionButton
                  onClick={() => openModal("confirmOverdue")}
                  icon={AlertTriangle}
                  label="Confirmar Atraso"
                  variant="purple"
                />
              </>
            )}
          </>
        )}
      </div>

      {/* ── Modais de confirmação ── */}

      <ConfirmModal
        isOpen={modal === "delete"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.delete(`${LOAN_URL}/${id}`))}
        loading={actionLoading}
        title="Deletar Empréstimo"
        message="Tem certeza que deseja deletar este empréstimo? Esta ação não pode ser desfeita."
        confirmLabel="Deletar"
        confirmVariant="red"
      />

      <ConfirmModal
        isOpen={modal === "cancel"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/cancel/${id}`))}
        loading={actionLoading}
        title="Cancelar Empréstimo"
        message="Tem certeza que deseja cancelar? O empréstimo voltará para análise."
        confirmLabel="Cancelar Empréstimo"
        confirmVariant="red"
      />

      <ConfirmModal
        isOpen={modal === "accept"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/accept/${id}`))}
        loading={actionLoading}
        title="Aceitar Empréstimo"
        message="Confirma que deseja aceitar este empréstimo?"
        confirmLabel="Aceitar"
        confirmVariant="green"
      />

      <ConfirmModal
        isOpen={modal === "start"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/start/${id}`))}
        loading={actionLoading}
        title="Iniciar Empréstimo"
        message="Confirma que deseja iniciar o empréstimo?"
        confirmLabel="Iniciar"
        confirmVariant="yellow"
      />

      <ConfirmModal
        isOpen={modal === "startReturn"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/startReturn/${id}`))}
        loading={actionLoading}
        title="Iniciar Devolução"
        message="Confirma que deseja iniciar a devolução do jogo?"
        confirmLabel="Iniciar Devolução"
        confirmVariant="blue"
      />

      <ConfirmModal
        isOpen={modal === "confirmReturn"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/confirmReturn/${id}`))}
        loading={actionLoading}
        title="Confirmar Devolução"
        message="Confirma que o jogo foi devolvido corretamente?"
        confirmLabel="Confirmar"
        confirmVariant="green"
      />

      <ConfirmModal
        isOpen={modal === "confirmOverdue"}
        onClose={closeModal}
        onConfirm={() => handleAction(() => api.post(`${LOAN_URL}/confirmOverdue/${id}`))}
        loading={actionLoading}
        title="Confirmar Atraso"
        message="Confirma que houve atraso na devolução do jogo?"
        confirmLabel="Confirmar Atraso"
        confirmVariant="purple"
      />

      {/* Modal de editar data — só recebedor em análise */}
      <Modal isOpen={modal === "editDate"} onClose={closeModal} title="Alterar Data de Devolução">
        <div className="flex flex-col gap-4">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeModal}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              disabled={!newDate || actionLoading}
              onClick={() =>
                handleAction(() =>
                  // ⚠️ Ajuste a rota e o campo conforme a API
                  api.patch(`${LOAN_URL}/${id}`, { returnDate: newDate })
                )
              }
              className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { LoanPage };