const STATUS_LABEL = {
  analysis: { label: "Em Análise", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  accepted: { label: "Aceito", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  started: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  returning: { label: "Em Devolução", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
};


function LoanCard({ loan, onClick }) {
  const status = STATUS_LABEL[loan.status] ?? STATUS_LABEL.analysis;
  return (
    <div
      onClick={onClick}
      className="bg-zinc-800 border border-zinc-700 hover:border-yellow-500/50 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/5"
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
    </div>
  );
}

export { LoanCard }