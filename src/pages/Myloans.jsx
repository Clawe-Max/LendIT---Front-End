import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import LoadingSpinner from "../common/LoadingSpinner";
import { PackageSearch } from "lucide-react";

// ⚠️ Ajuste a rota quando o backend estiver pronto
const LOANS_URL = "/loan/myLoans";

const STATUS_LABEL = {
  analysis: { label: "Em Análise", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  accepted: { label: "Aceito", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  started: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  returning: { label: "Em Devolução", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
};

// Dados mockados — remova quando a API estiver pronta
const MOCK_LOANS = [
  { id: 1, gameName: "Catan", status: "analysis", ownerName: "João", returnDate: "2026-07-01" },
  { id: 2, gameName: "Dixit", status: "accepted", ownerName: "Maria", returnDate: "2026-06-20" },
  { id: 3, gameName: "Coup", status: "started", ownerName: "Pedro", returnDate: "2026-06-15" },
];

function LoanCard({ loan, onClick }) {
  const status = STATUS_LABEL[loan.status] ?? STATUS_LABEL.analysis;
  return (
    <div
      onClick={onClick}
      className="bg-zinc-800 border border-zinc-700 hover:border-yellow-500/50 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/5"
    >
      <div className="flex flex-col gap-1">
        <span className="text-white font-semibold">{loan.gameName ?? loan.game?.name ?? "—"}</span>
        <span className="text-zinc-400 text-xs">Dono: {loan.ownerName ?? loan.owner?.name ?? "—"}</span>
        {loan.returnDate && (
          <span className="text-zinc-500 text-xs">
            Devolução: {new Date(loan.returnDate).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${status.bg} ${status.color}`}>
        {status.label}
      </span>
    </div>
  );
}

export function MyLoans() {
  const navigate = useNavigate();

  // ⚠️ Troque MOCK_LOANS por dados reais quando a API estiver pronta:
  // const { data, loading, error } = useFetch(LOANS_URL);
  // const loans = data?.data ?? data ?? [];
  const loans = MOCK_LOANS;
  const loading = false;
  const error = null;

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <p className="text-zinc-400 text-sm text-center py-8">
        Não foi possível carregar os empréstimos.
      </p>
    );
  }

  if (!loans.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-zinc-500">
        <PackageSearch size={40} className="text-zinc-600" />
        <p className="text-sm">Você ainda não tem empréstimos.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl">

      {loans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          onClick={() => navigate(`/loan/${loan.id}`)}
        />
      ))}
    </div> // 
  );
}