function CardGames() {
  return (
    <section>
      <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500/50 transition-all duration-300 min-h-96 flex flex-col">
        <div className="h-40 bg-yellow-500/30 flex items-center justify-center"></div>
        <div className="p-4">
          <span className="text-xs text-yellow-500 uppercase">Categoria</span>
          <h3 className="font-semibold text-xl mt-1">Nome do Jogo</h3>
          <div className="mt-4 flex flex-col gap-2 text-zinc-300">
            <span>👥 ∞ Jogadores</span>
            <span>⏱ ∞ Minutos</span>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <button className="w-full text-sm bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold py-2 rounded-lg transition-colors">
            Editar
          </button>
        </div>
      </div>
    </section>
  );
}
export { CardGames };
