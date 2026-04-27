import { Mail, UserIcon } from "lucide-react";

function User() {
  return (
    <div className="min-h-full flex flex-col items-center gap-5 pt-[5vh]">
      <div className="flex flex-col gap-5 items-center">
        <img
          className="rounded-full object-cover size-52 shadow-xl/70"
          src="https://avatars.githubusercontent.com/u/120359085?v=4"
          alt="UPLOAD"
        />
        <h1 className="text-5xl text-amber-50">Olá, USER</h1>
        <div className="flex row-auto bg-yellow-900 shadow-xl/30 text-amber-50 gap-5 p-1 px-3 rounded-xl">
          <h2 className="flex row-auto gap-1">
            <UserIcon />
            Usuário
          </h2>{" "}
          <h2 className="flex row-auto gap-1">
            <Mail />
            usuário@email.com
          </h2>
        </div>
      </div>
      <span className="flex gap-8">
        <button className="flex py-2 px-4  bg-yellow-800 shadow-xl/30 rounded-2xl text-white font-semibold">
          Meus Jogos
        </button>
        <button className="flex py-2 px-4 bg-yellow-950 shadow-xl/30 rounded-3xl text-neutral-500 font-semibold">
          Meus Pedidos
        </button>
        <button className="flex py-2 px-4 bg-yellow-950 shadow-xl/30 rounded-3xl text-neutral-500 font-semibold">
          Minha Conta
        </button>
      </span>
    </div>
  );
}

export { User };
