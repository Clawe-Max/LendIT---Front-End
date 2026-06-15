import { useNavigate } from "react-router-dom";
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
import { ActionButton } from "./ActionButton";
import { ConfirmModal } from "./ConfirmModal";
import { DatePicker } from "../common/DatePicker";
import { useState } from "react";
import api from "../../api/axios";
import Modal from "../common/Modal";


const STATUS_LABEL = {
  ANALYSIS: { label: "Em Análise", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  ACCEPTED: { label: "Aceito", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  ONGOING: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  RETURN_PENDING: { label: "Em Devolução", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
  OVERDUE: { label: "Atrazado", bg: "bg-red-600/20 text-red-400", text: "text-red-400" },
  FINALIZED: { label: "Finalizado", bg: "bg-zinc-600/20 text-zinc-400", text: "text-zinc-400" }
};

const LOAN_URL = "/loan"

const defaultFormData = {
  startDate: "",
  deadline: ""
}

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
        deadline: loan.deadline ? loan.deadline.split("T")[0] : ""
      });
      
      api.get(`/games/date/${loan.gameId}`).then((res) => {
        setDates(res.data.data);
      })
      .catch((err) => console.error("Erro ao buscar datas inválidas", err));
    }
  }

  function closeModal() { 
    setModal(null); 
    setError(null);
    setDates(null); // Limpa as datas ao fechar
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({...state, [name]: value}));
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

  const id = loan.id
  const currentUserId = user.data.Id;
  const isLoaner = currentUserId === loan.loanerId;
  console.log(isLoaner)
  const isReceiver = currentUserId === loan.receiverId;
  console.log(isReceiver)
  const status = STATUS_LABEL[loan.status];

  return (
    <div>
      <div
        className="bg-zinc-800 border border-zinc-700 hover:border-yellow-500/50 rounded-xl p-4 flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/5"
      >
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold">{loan.game ?? "—"}</span>
          <span className="text-zinc-400 font-semibold">Dono: {loan.owner ?? "—"}</span>
          <span className="text-zinc-500 text-xs">
            Data inical: {new Date(loan.startDate).toLocaleDateString("pt-BR")}
          </span>
          <span className="text-zinc-500 text-xs">
            Devolução: {new Date(loan.deadline).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${status.bg} ${status.color}`}>
          {status.label}
        </span>

        {/* CHAT — análise e aceito */}
        {(loan.status === "ANALYSIS" || loan.status === "ACCEPTED") && (
          <ActionButton
            onClick={() => navigate("/chat")}
            icon={MessageCircle}
            label="Chat"
            variant="default"
          />
        )}

        {/* Botão de abrir modal de alterar datas */}
        {((isReceiver && (loan.status === "ANALYSIS" || loan.status === "ACCEPTED"))) &&(
          <button
            onClick={() => openModal("editDate")}
            className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-300 transition-colors mt-0.5 w-fit hover: cursor-pointer"
          >
            <CalendarDays size={20} />
          </button>
        )}

        {/* EM ANÁLISE */}
        {loan.status === "ANALYSIS" && (
          <>
            {/* Dono pode aceitar */}
            {isLoaner && (
              <ActionButton
                onClick={() => openModal("accept")}
                icon={CheckCircle}
                label="Aceitar Empréstimo"
                variant="green"
              />
            )}
          </>
        )}

        {(loan.status === "ANALYSIS" || loan.status === "FINALIZED") && (
          <>
            {/* Pode deletar */}
            <ActionButton
              onClick={() => openModal("delete")}
              icon={Trash2}
              variant="red"
            />
          </>
        )}

        {/* ACEITO */}
        {loan.status === "ACCEPTED" && (
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
        {loan.status === "ONGOING" && (
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
        {loan.status === "RETURN_PENDING" && (
          <>
            {/* Dono pode confirmar devolução ou atraso */}
            {isLoaner && (
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

      <div>
        {/* ── Modais de confirmação ── */}
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

        {/* Modal de editar data — só recebedor em análise */}
        { ((isReceiver && (loan.status === "ANALYSIS" || loan.status === "ACCEPTED"))) && (
          <Modal isOpen={modal === "editDate"} onClose={closeModal} title="Alterar Data de Devolução">
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
                        deadline: formData.deadline 
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
    </div>
  );
}

export { LoanCard }