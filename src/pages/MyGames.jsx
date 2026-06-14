import { CirclePlus, DicesIcon, Upload } from "lucide-react";
import { CardGames } from "../components/MyGames/CardGames";
import { useRef, useState } from "react";
import Modal from "../components/common/Modal";
import { Input } from "../components/common/Input";
import api from "../api/axios";
import { useFetch } from "../hooks/useFetch";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { truncateText } from "../lib/truncateText";
import { Select } from "../components/common/Select";

const GAME_URL = "/games";

const gameCategories = Object.freeze({
  MESA: "TABLETOP",
  CARTAS: "CARD",
  TABULEIRO: "BOARD",
  QUEBRA_CABEÇAS: "PUZZLE",
  CARTUCHO: "CARTRIDGES",
  DISCO: "DISC",
});

const defaultFormData = {
  name: "",
  category: gameCategories.MESA,
  description: "",
  minPlayers: null,
  maxPlayers: null,
  minAge: null,
};

function MyGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  const inputRef = useRef(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }
  const { data, refetch, loading } = useFetch(`${GAME_URL}/myGames`);
  console.log(data);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoadingCreate(true);
      const { name, category, description, minPlayers, maxPlayers, minAge } =
        formData;

      const newGame = new FormData();
      if (name.trim()) newGame.append("name", name);
      if (category.trim()) newGame.append("category", category);
      if (description.trim()) newGame.append("description", description);
      newGame.append("minPlayers", String(minPlayers));
      newGame.append("maxPlayers", String(maxPlayers));
      newGame.append("minAge", String(minAge));
      if (file) newGame.append("image", file);

      await api.post(GAME_URL, newGame, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(defaultFormData);
      setFile(null);
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoadingCreate(false);
    }
  }
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-[calc(100vh-52px)] bg-zinc-900 text-white px-6 py-8 max-w-5xl mx-auto flex flex-col">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <DicesIcon size={20} className="text-yellow-500" />
          <span className="text-yellow-500 text-sm font-medium tracking-widest uppercase">
            Bem-vindo ao LendIT
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight">
          Adicione seu jogo ao nosso{" "}
          <span className="text-yellow-500">catálogo.</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-lg">
          Empreste seus jogos! Veja mais pessoas aproveitando sua coleção. Você
          anuncia, combina o empréstimo e recebe de volta quando terminarem de
          jogar.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {/* SEÇÃO MEUS JOGOS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Meus Jogos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD */}
            <section>
              <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 min-h-96 flex flex-col">
                <div className="h-40 bg-yellow-500/30 flex items-center justify-center">
                  <CirclePlus color="black" size="54" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-yellow-500 uppercase">
                    Categoria
                  </span>
                  <h3 className="font-semibold text-xl mt-1">Nome do Jogo</h3>
                  <div className="mt-4 flex flex-col gap-2 text-zinc-300">
                    <span>Sobre o jogo</span>
                  </div>
                </div>
                <div className="p-4 mt-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full text-sm bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors"
                  >
                    Empreste um novo jogo.
                  </button>

                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Adicionar novo jogo"
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        name="name"
                        type="text"
                        placeholder="Nome do jogo"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <Select
                        name="category"
                        type="text"
                        placeholder="Categoria"
                        options={gameCategories}
                        value={formData.category}
                        onChange={handleChange}
                      />
                      <Input
                        name="description"
                        type="text"
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      <Input
                        name="minPlayers"
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Quantidade mínima de jogadores"
                        value={formData.minPlayers}
                        onChange={handleChange}
                      />
                      <Input
                        name="maxPlayers"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Quantidade máxima de jogadores"
                        value={formData.maxPlayers}
                        onChange={handleChange}
                      />
                      <Input
                        name="minAge"
                        type="number"
                        min="0"
                        max="18"
                        placeholder="Idade mínima para jogar o jogo"
                        value={formData.minAge}
                        onChange={handleChange}
                      />
                      <label className="w-full p-3focus:ring-2 font-bold text-zinc-100 placeholder:font-bol bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-yellow-500 cursor-pointer">
                        <span className="flex items-center space-x-2 ">
                          <span className="font-bold text-zinc-500 hover:text-white flex gap-4 ">
                            <Upload />
                            Escolha uma imagem para seu jogo
                          </span>
                          <input
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                            name="image"
                            className="hidden"
                            accept="image/png,image/jpeg"
                            id="input"
                          />
                        </span>
                      </label>

                      <button
                        disabled={loadingCreate}
                        className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Adicionar jogo
                      </button>
                    </form>
                  </Modal>
                </div>
              </div>
            </section>
            {/* FINALIZA O CARD */}
            {data.data.map((game) => (
              <CardGames
                name={game.name}
                category={game.category}
                description={game.description}
                key={game.id}
                refetch={refetch}
                code={game.code}
                image={game.imagePath}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export { MyGames };
