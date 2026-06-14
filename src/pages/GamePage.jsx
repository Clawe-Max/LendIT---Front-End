import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DicesIcon, Tag, Hash, FileText, Users, Clock, Star } from "lucide-react";
import api from "../api/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { DatePicker } from "../components/common/DatePicker";

// Mapeamento de cores por categoria
const CATEGORY_COLORS = {
  PUZZLE: "from-amber-700 to-yellow-900",
  TABLETOP: "from-emerald-700 to-green-900",
  BOARD: "from-blue-700 to-sky-900",
  CARD: "from-purple-700 to-indigo-900",
  DISC: "from-red-700 to-fuchsia-900",
  CARTRIDGES: "from-cyan-700 to-slate-950",
  DEFAULT: "from-zinc-600 to-zinc-900",
};

// Emojis por categoria
const CATEGORY_EMOJI = {
  PUZZLE: "♟️",
  TABLETOP: "🤝",
  BOARD: "👨‍👩‍👧",
  CARD: "🃏",
  DISC: "💿",
  CARTRIDGES: "💾",
  DEFAULT: "🎲",
};

const defaultFormData = {
  gameId: "",
  startDate: "",
  deadline: ""
}

function getCategoryKey(category = "") {
  return category.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function GamePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [dates, setDates] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({...state, [name]: value}));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoadingCreate(true);
      console.log(formData)
      await api.post(`/loan`, formData);
      setFormData(defaultFormData);
      alert("Deu bom");
      navigate("/")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoadingCreate(false);
    }
  }

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        const response = await api.get(`/games/view/${code}`);
        if (!response.data?.data?.code) {
          throw new Error("Game not found.");
        }

        const date = await api.get(`/games/date/${response.data?.data?.id}`);
        setGame({...response.data.data, ownerName: response.data.ownerName});
        setDates(date.data.data);

        setFormData((prev) => ({...prev, gameId: response.data.data.id}));
      } catch (err) {
        setError("Não foi possível carregar o jogo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [code]);

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
  const gradientClass = CATEGORY_COLORS[catKey] ?? CATEGORY_COLORS.DEFAULT;
  const emoji = CATEGORY_EMOJI[catKey] ?? CATEGORY_EMOJI.DEFAULT;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">

      {/* Hero */}
      <div className={`relative w-full bg-linear-to-br ${gradientClass} overflow-hidden`}>
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
          <div className={`w-32 h-32 rounded-2xl bg-linear-to-br ${gradientClass} border-2 border-yellow-500/30 flex items-center justify-center shadow-2xl shrink-0`}>
            <img src={`http://localhost:3000/${game.imagePath}`} alt="" />
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
              {/* 
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Star size={11} className="fill-yellow-500 text-yellow-500" />
                Destaque
              </span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Coluna esquerda: galeria + descrição */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Foto do jogo */}
          <section>
            <h2 className="text-base font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <DicesIcon size={15} className="text-yellow-500" />
              Imagem
            </h2>
            <div className={`w-full h-56 rounded-xl bg-linear-to-br ${gradientClass} flex items-center justify-center border border-zinc-700 mb-3`}>
              <img src={`http://localhost:3000/${game.imagePath}`} alt="" />
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
            <h3 className="font-bold text-white">Emprestar este jogo{emoji}</h3>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-yellow-500 shrink-0" />
                  <span className="min-w-1/5">Data inicial</span>
                  <DatePicker 
                    name="startDate"
                    datesToDisable={dates}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-yellow-500 shrink-0" />
                  <span className="min-w-1/5">Data Final</span>
                  <DatePicker 
                    name="deadline"
                    datesToDisable={dates}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2.5 
                rounded-lg transition-colors text-sm"
                type="submit"
              >
                Solicitar Aluguel
              </button>
              <p className="text-xs text-zinc-600 text-center">
                Você será redirecionado para o chat
              </p>
            </form>
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
              <div className="h-px bg-zinc-700" />
              <div className="flex justify-between">
                <span className="text-zinc-500">Jogadores</span>
                <span className="text-zinc-300 font-mono">{game.minPlayers}-{game.maxPlayers}</span>
              </div>
              <div className="h-px bg-zinc-700" />
              <div className="flex justify-between">
                <span className="text-zinc-500">Classificação etária</span>
                <span className="text-zinc-300 font-mono">+{game.minAge}</span>
              </div>
              <div className="h-px bg-zinc-700" />
              <div className="flex justify-between">
                <span className="text-zinc-500">Dono</span>
                <span className="text-zinc-300 font-mono">{game.ownerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { GamePage };