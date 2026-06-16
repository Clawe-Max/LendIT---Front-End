import { Image, Trash2, Trash2Icon, Upload } from "lucide-react";
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
  category: "",
  description: "",
  minPlayers: "",
  maxPlayers: "",
  minAge: "",
};

function CardGames({
  name,
  category,
  description,
  code,
  refetch,
  image,
  minPlayers,
  maxPlayers,
  minAge,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
      if (formData.minPlayers !== "")
        updatedGame.append("minPlayers", String(formData.minPlayers));
      if (formData.maxPlayers !== "")
        updatedGame.append("maxPlayers", String(formData.maxPlayers));
      if (formData.minAge !== "")
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
      <div
        onClick={() => setIsDetailsModalOpen(true)}
        className="bg-zinc-800 relative rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 h-96 flex flex-col cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute right-2 top-2 hover:text-red-900 hover:bg-black/60 cursor-pointer bg-black/35 p-1 rounded-full"
        >
          <Trash2 />
        </button>

        <div onClick={(e) => e.stopPropagation()}>
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
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title={name}
          >
            <img
              className="w-full h-72 object-cover rounded-lg mb-4"
              src={`http://localhost:3000/uploads/game_images/${image}`}
              alt={name}
            />
            <span className="text-xs text-yellow-500 uppercase font-semibold">
              {category}
            </span>
            <p className="text-zinc-300 mt-2 mb-4">{description}</p>
            <div className="flex gap-4 text-sm text-zinc-400">
              <span>
                Jogadores: {minPlayers} - {maxPlayers}
              </span>
              <span>Idade mínima: {minAge}</span>
            </div>
          </Modal>
        </div>

        <img
          className="h-40 bg-yellow-500/30 flex items-center justify-center"
          src={`http://localhost:3000/uploads/game_images/${image}`}
          alt="UPLOAD"
        />
        <div className="p-4 flex-1 overflow-hidden">
          <span className="text-xs text-yellow-500 uppercase">
            {truncateText(category)}
          </span>
          <h3 className="font-semibold text-xl mt-1 line-clamp-1">
            {truncateText(name, 20)}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-zinc-300">
            <span className="line-clamp-3">
              {truncateText(description, 80)}
            </span>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="w-full text-sm bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors cursor-pointer"
          >
            Editar
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            <Modal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setFormData(defaultFormData);
                setFile(null);
                setError(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
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
                  placeholder={`Categoria atual: ${category}`}
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
                  placeholder={`Quantidade mínima atual: ${minPlayers}`}
                  value={formData.minPlayers}
                  onChange={handleChange}
                />
                <Input
                  name="maxPlayers"
                  type="number"
                  min="1"
                  max="50"
                  placeholder={`Quantidade máxima atual: ${maxPlayers}`}
                  value={formData.maxPlayers}
                  onChange={handleChange}
                />
                <Input
                  name="minAge"
                  type="number"
                  min="0"
                  max="18"
                  placeholder={`Idade mínima atual: ${minAge}`}
                  value={formData.minAge}
                  onChange={handleChange}
                />
                <div className="relative w-full">
                  <label className="block w-full p-3focus:ring-2 font-bold text-zinc-100 placeholder:font-bol bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-yellow-500 cursor-pointer">
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

                  {file && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-zinc-300">
                      <Image size={16} />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (inputRef.current) inputRef.current.value = "";
                        }}
                        className="flex items-center justify-center cursor-pointer text-zinc-400 hover:text-red-400 transition"
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors cursor-pointer">
                  Editar o jogo
                </button>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}
export { CardGames };
