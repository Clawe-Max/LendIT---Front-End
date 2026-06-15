import { useNavigate } from "react-router-dom"; //loan card atualizado
import {
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
import { ActionButton } from "./ActionButton";
import { ConfirmModal } from "./ConfirmModal";
import { DatePicker } from "../common/DatePicker";
import { useState } from "react";
import api from "../../api/axios";
import Modal from "../common/Modal";

const STATUS_LABEL = {
  ANALYSIS:       { label: "Em Análise",    color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  ACCEPTED:       { label: "Aceito",        color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30"  },
  ONGOING:        { label: "Em Andamento",  color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30"    },
  RETURN_PENDING: { label: "Em Devolução",  color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30"},
  OVERDUE:        { label: "Atrasado",      color: "text-red-400",    bg: "bg-red-600/20 border-red-400/30"      },
  FINALIZED:      { label: "Finalizado",    color: "text-zinc-400",   bg: "bg-zinc-600/20 border-zinc-400/30"    },
};

const LOAN_URL = "/loan";

const defaultFormData = { startDate: "", deadline: "" };

function LoanCard({ loan, user, refetch }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [dates, setDates] = useState(null);
  const [error, setError] = useState(null);

  function openModal(name) {
    setModal(name);
    if (name === "editDate") {
      setFormData({
        startDate: loan.startDate ? loan.startDate.split("T")[0] : "",
        deadline:  loan.deadline  ? loan.deadline.split("T")[0]  : "",
      });
      api.get(`/games/date/${loan.gameId}`)
        .then((res) => setDates(res.data.data))
        .catch((err) => console.error("Erro ao buscar datas inválidas", err));
    }
  }

  function closeModal() {
    setModal(null);
    setError(null);
    setDates(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }

  async function handleAction(apiCall) {
    try {
      setActionLoading(true);
      await apiCall();
      closeModal();
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  const id             = loan.id;
  const currentUserId  = user.data.Id;
  const isLoaner       = currentUserId === loan.loanerId;
  const isReceiver     = currentUserId === loan.receiverId;
  const status         = STATUS_LABEL[loan.status] ?? STATUS_LABEL.ANALYSIS;
  const canEditDate    = isReceiver && (loan.status === "ANALYSIS" || loan.status === "ACCEPTED");

  return (
    <div className="bg-zinc-800 border border-zinc-700 hover:border-yellow-500/30 rounded-xl p-4 flex flex-col gap-4 transition-all">

      {/* Linha superior: infos + badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold text-base">{loan.game ?? "—"}</span>
          <span className="text-zinc-400 text-sm">Dono: {loan.owner ?? "—"}</span>
          <div className="flex gap-4 mt-1">
            <span className="text-zinc-500 text-xs">
              Início: {new Date(loan.startDate).toLocaleDateString("pt-BR")}
            </span>
            <span className="text-zinc-500 text-xs">
              Devolução: {new Date(loan.deadline).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Badge de status */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Linha inferior: botões de ação */}
      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-700 pt-3">

        {/* Chat — análise e aceito */}
        {(loan.status === "ANALYSIS" || loan.status === "ACCEPTED") && (
          <ActionButton
            onClick={() => navigate("/chat")}
            icon={MessageCircle}
            label="Chat"
            variant="default"
          />
        )}

        {/* Alterar datas — recebedor em análise ou aceito */}
        {canEditDate && (
          <button
            onClick={() => openModal("editDate")}
            className="flex items-center gap-1.5 text-xs text-yellow-500 hover:text-yellow-300 transition-colors px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg cursor-pointer"
          >
            <CalendarDays size={14} />
            Alterar Datas
          </button>
        )}

        {/* EM ANÁLISE */}
        {loan.status === "ANALYSIS" && (
          <>
            {isLoaner && (
              <ActionButton
                onClick={() => openModal("accept")}
                icon={CheckCircle}
                label="Aceitar"
                variant="green"
              />
            )}
            <ActionButton
              onClick={() => openModal("delete")}
              icon={Trash2}
              label="Deletar"
              variant="red"
            />
          </>
        )}

        {/* ACEITO */}
        {loan.status === "ACCEPTED" && (
          <>
            <ActionButton
              onClick={() => openModal("start")}
              icon={PlayCircle}
              label="Iniciar Empréstimo"
              variant="yellow"
            />
            <ActionButton
              onClick={() => openModal("cancel")}
              icon={XCircle}
              label="Cancelar"
              variant="red"
            />
          </>
        )}

        {/* EM ANDAMENTO */}
        {loan.status === "ONGOING" && isReceiver && (
          <ActionButton
            onClick={() => openModal("startReturn")}
            icon={RotateCcw}
            label="Iniciar Devolução"
            variant="blue"
          />
        )}

        {/* EM DEVOLUÇÃO */}
        {loan.status === "RETURN_PENDING" && isLoaner && (
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

        {/* FINALIZADO — pode deletar */}
        {loan.status === "FINALIZED" && (
          <ActionButton
            onClick={() => openModal("delete")}
            icon={Trash2}
            label="Deletar"
            variant="red"
          />
        )}
      </div>

      {/* ── Modais ── */}
      <ConfirmModal
        isOpen={modal === "delete"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.delete(`${LOAN_URL}/${id}`))}
        loading={actionLoading}
        title="Deletar Empréstimo"
        message="Tem certeza que deseja deletar este empréstimo? Esta ação não pode ser desfeita."
        confirmLabel="Deletar"
        confirmVariant="red"
      />
      <ConfirmModal
        isOpen={modal === "cancel"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/cancel/${id}`))}
        loading={actionLoading}
        title="Cancelar Empréstimo"
        message="Tem certeza que deseja cancelar? O empréstimo voltará para análise."
        confirmLabel="Cancelar Empréstimo"
        confirmVariant="red"
      />
      <ConfirmModal
        isOpen={modal === "accept"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/accept/${id}`))}
        loading={actionLoading}
        title="Aceitar Empréstimo"
        message="Confirma que deseja aceitar este empréstimo?"
        confirmLabel="Aceitar"
        confirmVariant="green"
      />
      <ConfirmModal
        isOpen={modal === "start"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/start/${id}`))}
        loading={actionLoading}
        title="Iniciar Empréstimo"
        message="Confirma que deseja iniciar o empréstimo?"
        confirmLabel="Iniciar"
        confirmVariant="yellow"
      />
      <ConfirmModal
        isOpen={modal === "startReturn"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/startReturn/${id}`))}
        loading={actionLoading}
        title="Iniciar Devolução"
        message="Confirma que deseja iniciar a devolução do jogo?"
        confirmLabel="Iniciar Devolução"
        confirmVariant="blue"
      />
      <ConfirmModal
        isOpen={modal === "confirmReturn"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/confirmReturn/${id}`))}
        loading={actionLoading}
        title="Confirmar Devolução"
        message="Confirma que o jogo foi devolvido corretamente?"
        confirmLabel="Confirmar"
        confirmVariant="green"
      />
      <ConfirmModal
        isOpen={modal === "confirmOverdue"}
        onClose={closeModal}
        onConfirm={() => handleAction(async () => await api.patch(`${LOAN_URL}/confirmOverdue/${id}`))}
        loading={actionLoading}
        title="Confirmar Atraso"
        message="Confirma que houve atraso na devolução do jogo?"
        confirmLabel="Confirmar Atraso"
        confirmVariant="purple"
      />

      {/* Modal de editar datas */}
      {canEditDate && (
        <Modal isOpen={modal === "editDate"} onClose={closeModal} title="Alterar Datas do Empréstimo">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-400 text-xs font-semibold">Data de Início</label>
              <DatePicker
                name="startDate"
                placeholder="Selecione a data de início"
                datesToDisable={dates}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-400 text-xs font-semibold">Data de Devolução</label>
              <DatePicker
                name="deadline"
                placeholder="Selecione a data de devolução"
                datesToDisable={dates}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!formData.startDate || !formData.deadline || actionLoading}
                onClick={() =>
                  handleAction(async () =>
                    await api.patch(`${LOAN_URL}/${id}`, {
                      startDate: formData.startDate,
                      deadline:  formData.deadline,
                    })
                  )
                }
                className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export { LoanCard };