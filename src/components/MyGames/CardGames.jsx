import { Trash2, Upload } from "lucide-react";
import Modal from "../common/Modal";
import { useRef, useState } from "react";
import api from "../../api/axios";
import { Input } from "../common/Input";
import { truncateText } from "../../lib/truncateText";
import { Select } from "../common/Select";

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
  minPlayers: 1,
  maxPlayers: 1,
  minAge: 1,
};

function CardGames({ name, category, description, code, refetch, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }
  async function handleDelete(code) {
    try {
      setLoadingDelete(true);
      await api.delete(`${GAME_URL}/${code}`);
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoadingDelete(false);
    }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoadingEdit(true);

      const updatedGame = new FormData();
      updatedGame.append("code", String(Number(code)));
      if (formData.name.trim()) updatedGame.append("name", formData.name);
      if (formData.category.trim())
        updatedGame.append("category", formData.category);
      if (formData.description.trim())
        updatedGame.append("description", formData.description);
      updatedGame.append("minPlayers", String(formData.minPlayers));
      updatedGame.append("maxPlayers", String(formData.maxPlayers));
      updatedGame.append("minAge", String(formData.minAge));
      if (file) updatedGame.append("image", file);

      await api.patch(GAME_URL, updatedGame, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData(defaultFormData);
      setFile(null);
      refetch();
      setIsEditModalOpen(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoadingEdit(false);
    }
  }
  return (
    <section>
      <div className="bg-zinc-800 relative rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 min-h-96 flex flex-col">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-2 top-2 hover:text-red-900 hover:bg-black/60 cursor-pointer bg-black/35 p-1 rounded-full"
        >
          <Trash2 />
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirmar exclusão"
        >
          <p className="text-white mb-4">Tem certeza que deseja deletar?</p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-zinc-700 px-4 py-2 rounded cursor-pointer hover:bg-zinc-500"
            >
              Cancelar
            </button>

            <button
              onClick={() => handleDelete(code)}
              disabled={loadingDelete}
              className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-red-800"
            >
              Confirmar
            </button>
          </div>
        </Modal>
        <img
          className="h-40 bg-yellow-500/30 flex items-center justify-center"
          src={`http://localhost:3000/uploads/game_images/${image}`}
          alt="UPLOAD"
        />
        <div className="p-4">
          <span className="text-xs text-yellow-500 uppercase">
            {truncateText(category)}
          </span>
          <h3 className="font-semibold text-xl mt-1">
            {truncateText(name, 20)}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text333333333333333333333333333333333333333333333333333333333333333333333333333333333333333-zinc-300">
            <span>{truncateText(description, 500)}</span>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full text-sm bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors"
          >
            Editar
          </button>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Editar o jogo"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                name="name"
                type="text"
                placeholder={name}
                value={formData.name}
                onChange={handleChange}
              />
              <Select
                name="category"
                options={gameCategories}
                value={formData.category}
                onChange={handleChange}
              />
              <Input
                name="description"
                type="text"
                placeholder={description}
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
                    name="file_upload"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    id="input"
                  />
                </span>
              </label>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors cursor-pointer">
                Editar o jogo
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </section>
  );
}
export { CardGames };
