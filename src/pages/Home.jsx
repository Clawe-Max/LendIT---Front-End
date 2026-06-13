import { DicesIcon, Star, Clock, TrendingUp } from "lucide-react";
import { GameCard } from "../components/common/GameCard";
import { useContext } from "react";
import { GameContext } from "../games/GameContext";

// Jogos mockados — substitua depois por api.get(...)
const JOGOS_DESTAQUE = [
  {
    id: 1,
    nome: "Catan",
    categoria: "Estratégia",
    jogadores: "3-4",
    duracao: "60-120 min",
    avaliacao: 4.8,
    cor: "from-amber-700 to-yellow-900",
    emoji: "🏝️",
  },
  {
    id: 2,
    nome: "Dixit",
    categoria: "Criatividade",
    jogadores: "3-6",
    duracao: "30 min",
    avaliacao: 4.6,
    cor: "from-purple-800 to-indigo-900",
    emoji: "🃏",
  },
  {
    id: 3,
    nome: "Coup",
    categoria: "Blefe",
    jogadores: "2-6",
    duracao: "15 min",
    avaliacao: 4.5,
    cor: "from-zinc-700 to-zinc-900",
    emoji: "👑",
  },
  {
    id: 4,
    nome: "Pandemic",
    categoria: "Cooperativo",
    jogadores: "2-4",
    duracao: "45-60 min",
    avaliacao: 4.7,
    cor: "from-red-800 to-rose-950",
    emoji: "🦠",
  },
  {
    id: 5,
    nome: "Ticket to Ride",
    categoria: "Família",
    jogadores: "2-5",
    duracao: "30-60 min",
    avaliacao: 4.6,
    cor: "from-blue-800 to-sky-950",
    emoji: "🚂",
  },
  {
    id: 6,
    nome: "7 Wonders",
    categoria: "Civilização",
    jogadores: "2-7",
    duracao: "30 min",
    avaliacao: 4.7,
    cor: "from-emerald-800 to-green-950",
    emoji: "🏛️",
  },
];

const CATEGORIAS = [
  { nome: "Tabletop", codigo: "TABLETOP", emoji: "🏓"},
  { nome: "Tabuleiro", codigo: "BOARD", emoji: "♟️"},
  { nome: "Cartas", codigo: "CARD", emoji: "♠️"},
  { nome: "Quebra-cabeça", codigo: "PUZZLE", emoji: "🧩"},
  { nome: "Cartucho", codigo: "CARTRIDGES", emoji: "🕹️"},
  { nome: "Disco", codigo: "DISC", emoji: "💿"},
];
function Home() {

  const destaque = false;
  const { handleChangeCategory, foundGames, handleSearch, category, setCategory } = useContext(GameContext);

  return (
    <div className="min-h-[calc(100vh-52px)] bg-zinc-900 text-white px-6 py-8 max-w-5xl mx-auto">
      {/* Boas-vindas */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <DicesIcon size={20} className="text-yellow-500" />
          <span className="text-yellow-500 text-sm font-medium tracking-widest uppercase">
            Bem-vindo ao LendIT
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight">
          Sua próxima noite de jogos{" "}
          <span className="text-yellow-500">começa aqui.</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-lg">
          Alugue jogos de tabuleiro por um preço justo, jogue com quem você
          gosta e devolva quando terminar. Simples assim.
        </p>
      </div>

      {/* Categorias rápidas */}
      <div className="mb-10 select-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
            <TrendingUp size={16} className="text-yellow-500" />
            Categorias
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIAS.map((cat) => (
            <div
              key={cat.nome}
              className={`border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-yellow-500/50 hover:bg-zinc-750 transition-all cursor-pointer group ${cat.nome == category ? 'border-yellow-500/50 bg-zinc-750': 'border-zinc-700 bg-zinc-800'}`}
              value={cat.nome}
              onClick={() => {handleChangeCategory(cat.codigo); setCategory(cat.nome); handleSearch()}}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <p className={`text-sm font-medium group-hover:text-yellow-400 transition-colors ${category == cat.nome ? 'text-yellow-400': 'text-white'}`}>
                  {cat.nome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jogos em destaque */}
      {destaque && (

        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              Jogos em Destaque
            </h2>
          </div>

          {/* Aviso de dados mockados — remova quando a API estiver pronta */}
          

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {JOGOS_DESTAQUE.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </div>
      )}

      <div>
          <div className="flex items-center mb-4">
            <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              Resultados
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {foundGames.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </div>
    </div>
  );
}

export { Home };
