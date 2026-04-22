import { Link } from "react-router-dom";
import { FormLogin } from "../components/FormLogin";
import { Dices } from "lucide-react";

const Auth = () => {
  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      <Link to="/" className=" text-yellow-500 flex gap-2">
        <Dices className="w-8 h-8" />
        <h1 className="text-3xl font-bold mb-6 tracking-wide"> LendIT</h1>
      </Link>
      <section className="bg-neutral-600 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-700/30">
        <span className="flex mb-6 bg-zinc-800 rounded-lg p-1">
          <button className="flex-1 py-2 rounded-md bg-yellow-500 text-black font-semibold">
            Entrar
          </button>
          <button className="flex-1 py-2 rounded-md text-zinc-400 hover:text-white transition">
            Criar minha conta
          </button>
        </span>
        <FormLogin />
      </section>
    </div>
  );
};
export { Auth };
