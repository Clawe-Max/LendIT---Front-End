import { CirclePlus, DicesIcon } from "lucide-react";
import { CardGames } from "../components/MyGames/CardGames";
import { useState } from "react";
import Modal from "../components/common/Modal";
import { Input } from "../components/common/Input";

function MyGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [games, setGames] = useState([]);

  async function handleAddGame() {
    if (!name || !players || !time || !category || !description) {
      return alert("Preencha todos os campos.");
    }
    try {
      await axios.post("http://localhost:3333/games", {
        name,
        players,
        time,
        category,
        description,
      });
      await fetchGames();
      setName("");
      setPlayers("");
      setTime("");
      setCategory("");
      setDescription("");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
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
          Empreste seus jogos de tabuleiro, ganhe uma renda extra e veja mais
          pessoas aproveitando sua coleção. Você anuncia, combina o aluguel e
          recebe de volta quando terminarem de jogar.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {/* SEÇÃO MEUS JOGOS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Meus Jogos</h2>

            <span className="text-sm text-zinc-400">2 jogos cadastrados</span>
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
                    <span>👥 ∞ Jogadores</span>
                    <span>⏱ ∞ Minutos</span>
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
                    <div className="flex flex-col gap-4">
                      <Input
                        type="text"
                        placeholder="Nome do jogo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Quantidade de jogadores"
                        value={players}
                        onChange={(e) => setPlayers(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Tempo médio do jogo (Minutos)"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Categoria"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <button
                        onClick={handleAddGame}
                        className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors"
                      >
                        Adicionar jogo
                      </button>
                    </div>
                  </Modal>
                </div>
              </div>
            </section>
            {/* FINALIZA O CARD */}
            <CardGames />
          </div>
        </section>
      </div>
    </div>
  );
}
export { MyGames };
