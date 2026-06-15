import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight, Gamepad2, Loader2 } from "lucide-react";
import api from "../../api/axios";

const FINE_URL = "/fine/me";

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export default function MyDebit() {
  const [debits, setDebits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDebits() {
      try {
        setLoading(true);
        const res = await api.get(FINE_URL);
        setDebits(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        const message =
          err.response?.data?.message || "Erro ao buscar débitos.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchDebits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 size={20} className="animate-spin mr-2" />
        <span className="text-sm">Carregando débitos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-400">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (debits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Gamepad2 size={40} className="mb-3 opacity-40" />
        <p className="text-sm">Nenhum débito encontrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Total em multas
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {formatCurrency(debits.reduce((acc, d) => acc + (d.value ?? 0), 0))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Débitos
          </p>
          <p className="text-lg font-semibold text-gray-200">
            {debits.length} {debits.length === 1 ? "jogo" : "jogos"}
          </p>
        </div>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {debits.map((debit) => {
          const overdue = isOverdue(debit.deadline);
          return (
            <li
              key={debit.id}
              className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.05)")
              }
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-md"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">
                    {debit.gameName?.toUpperCase() ?? "JOGO DESCONHECIDO"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Prazo: {formatDate(debit.deadline)}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: overdue ? "#e05c5c" : "#4caf7d" }}
                  >
                    {overdue ? "Prazo vencido" : "No prazo"}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-yellow-400">
                  {formatCurrency(debit.value)}
                </span>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { MyDebit };
