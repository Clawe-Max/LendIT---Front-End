import { Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import { useState } from "react";
import api from "../../api/axios";
import { Input } from "../common/Input";
import { truncateText } from "../../lib/truncateText";
const GAME_URL = "/games";
const defaultFormData = {
  name: "",
  category: "",
  description: "",
};

function CardGames({ name, category, description, code, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
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
      formData.code = code;
      console.log(formData);
      await api.patch(GAME_URL, formData);
      setFormData(defaultFormData);
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
          className="absolute right-2 top-2 hover:text-red-900 cursor-pointer"
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
        <div className="h-40 bg-yellow-500/30 flex items-center justify-center"></div>

        <div className="p-4">
          <span className="text-xs text-yellow-500 uppercase">
            {truncateText(category)}
          </span>
          <h3 className="font-semibold text-xl mt-1">
            {truncateText(name, 20)}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-zinc-300">
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
              <Input
                name="category"
                type="text"
                placeholder={category}
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
              <button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors">
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
