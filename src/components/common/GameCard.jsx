import { Clock } from "lucide-react";

function GameCard({ jogo }) {
  return (
    <div className="group relative bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 cursor-pointer">
      {/* Área da imagem / cor */}
      <div className="h-32 bg-linear-to-br flex justify-center items-center relative overflow-hidden">
        <img 
          className="object-center object-cover"
          src={"http://localhost:3000/uploads/game_images/" + jogo.imagePath}
        />
      </div>

      {/* Infos */}
      <div className="p-3 flex flex-col gap-1 pt-10">
        <span className="text-xs text-yellow-500 font-medium tracking-wide uppercase">
          {jogo.category}
        </span>
        <h3 className="text-white font-semibold text-sm leading-tight">
          {jogo.name}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-zinc-400 text-xs">
            👥 {jogo.minPlayers} - {jogo.maxPlayers}
          </span>
          <span className="flex items-center gap-1 text-zinc-400 text-xs">
            <Clock size={10} /> {jogo.minAge}
          </span>
        </div>
        <button className="mt-2 w-full text-xs bg-yellow-500 hover:bg-yellow-300 text-zinc-900 font-bold py-1.5 rounded-lg transition-colors">
          Alugar
        </button>
      </div>
    </div>
  );
}
export { GameCard };
