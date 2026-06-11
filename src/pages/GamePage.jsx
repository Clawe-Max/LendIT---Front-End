import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DicesIcon, Tag, Hash, FileText, Users, Clock, Star } from "lucide-react";
import api from "../api/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Mapeamento de cores por categoria — adicione mais conforme precisar
const CATEGORY_COLORS = {
  estrategia: "from-amber-700 to-yellow-900",
  cooperativo: "from-emerald-700 to-green-900",
  familia: "from-blue-700 to-sky-900",
  blefe: "from-purple-700 to-indigo-900",
  default: "from-zinc-600 to-zinc-900",
};

// Emojis por categoria
const CATEGORY_EMOJI = {
  estrategia: "♟️",
  cooperativo: "🤝",
  familia: "👨‍👩‍👧",
  blefe: "🎭",
  default: "🎲",
};

function getCategoryKey(category = "") {
  return category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Dados mockados de fotos — substitua por game.images quando a API retornar
const MOCK_PHOTOS = [
  { label: "Tabuleiro", emoji: "🗺️" },
  { label: "Cartas", emoji: "🃏" },
  { label: "Peças", emoji: "♟️" },
  { label: "Dados", emoji: "🎲" },
];

function GamePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        const response = await api.get(`/games/view/${code}`);
        // Ajuste o caminho conforme o que a API retornar: response.data ou response.data.data
        setGame(response.data?.data ?? response.data);
      } catch (err) {
        setError("Não foi possível carregar o jogo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !game) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4">
        <DicesIcon size={48} className="text-yellow-500 opacity-40" />
        <p className="text-zinc-400">{error ?? "Jogo não encontrado."}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-yellow-500 hover:text-yellow-400 underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  const catKey = getCategoryKey(game.category);
  const gradientClass = CATEGORY_COLORS[catKey] ?? CATEGORY_COLORS.default;
  const emoji = CATEGORY_EMOJI[catKey] ?? CATEGORY_EMOJI.default;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">

      {/* Hero */}
      <div className={`relative w-full bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {/* Overlay com textura sutil */}
        <div className="absolute inset-0 bg-zinc-900/60" />

        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-sm text-zinc-300 hover:text-yellow-400 transition-colors bg-zinc-900/50 px-3 py-1.5 rounded-lg backdrop-blur-sm"
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        {/* Conteúdo do hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Ícone grande do jogo */}
          <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradientClass} border-2 border-yellow-500/30 flex items-center justify-center shadow-2xl shrink-0`}>
            <span className="text-6xl">{emoji}</span>
          </div>

          {/* Título e categoria */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-semibold tracking-widest uppercase">
              <Tag size={11} />
              {game.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-lg">
              {game.name}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-zinc-300 bg-zinc-800/70 px-2.5 py-1 rounded-full">
                <Hash size={11} className="text-yellow-500" />
                Cód: {game.code}
              </span>
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Star size={11} className="fill-yellow-500 text-yellow-500" />
                Destaque
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Coluna esquerda: galeria + descrição */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Galeria de fotos mockada */}
          <section>
            <h2 className="text-base font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <DicesIcon size={15} className="text-yellow-500" />
              Fotos do Jogo
            </h2>

            {/* Foto principal */}
            <div className={`w-full h-56 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center border border-zinc-700 mb-3`}>
              <span className="text-8xl opacity-80">{MOCK_PHOTOS[activePhoto].emoji}</span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {MOCK_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`flex-1 h-16 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all text-xs ${
                    activePhoto === i
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-500"
                  }`}
                >
                  <span className="text-xl">{photo.emoji}</span>
                  <span>{photo.label}</span>
                </button>
              ))}
            </div>

            
          </section>

          {/* Descrição */}
          <section>
            <h2 className="text-base font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <FileText size={15} className="text-yellow-500" />
              Sobre o Jogo
            </h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {game.description || "Nenhuma descrição disponível para este jogo."}
              </p>
            </div>
          </section>
        </div>

        {/* Coluna direita: infos + ação */}
        <div className="flex flex-col gap-4">

          {/* Card de aluguel */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-white">Alugar este jogo</h3>

            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-yellow-500 shrink-0" />
                <span>Consulte disponibilidade</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-yellow-500 shrink-0" />
                <span>Período combinado</span>
              </div>
            </div>

            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2.5 rounded-lg transition-colors text-sm">
              Solicitar Aluguel
            </button>
            <p className="text-xs text-zinc-600 text-center">
              Você será redirecionado para o chat
            </p>
          </div>

          {/* Detalhes */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm">Detalhes</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Categoria</span>
                <span className="text-yellow-400 font-medium">{game.category}</span>
              </div>
              <div className="h-px bg-zinc-700" />
              <div className="flex justify-between">
                <span className="text-zinc-500">Código</span>
                <span className="text-zinc-300 font-mono">{game.code}</span>
              </div>
              {/* Adicione mais campos aqui quando a API retornar (preço, jogadores, etc.) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { GamePage };