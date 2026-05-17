import { Clock } from "lucide-react";

function GameCard({ jogo }) {
  return (
    <div className="group relative bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 cursor-pointer">
      {/* Área da imagem / cor */}
      <div
        className={`h-32 bg-gradient-to-br ${jogo.cor} flex items-center justify-center relative`}
      >
        <span className="text-5xl">{jogo.emoji}</span>
      </div>

      {/* Infos */}
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs text-yellow-500 font-medium tracking-wide uppercase">
          {jogo.categoria}
        </span>
        <h3 className="text-white font-semibold text-sm leading-tight">
          {jogo.nome}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-zinc-400 text-xs">
            👥 {jogo.jogadores}
          </span>
          <span className="flex items-center gap-1 text-zinc-400 text-xs">
            <Clock size={10} /> {jogo.duracao}
          </span>
        </div>
        <button className="mt-2 w-full text-xs bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-1.5 rounded-lg transition-colors">
          Alugar
        </button>
      </div>
    </div>
  );
}
export { GameCard };
