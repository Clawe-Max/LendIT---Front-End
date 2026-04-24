import { Link } from "react-router-dom";
import { FormLogin } from "../components/FormLogin";
import { Dices } from "lucide-react";
import { FormRegister } from "../components/FormRegister";
import { useState } from "react";

const Auth = () => {
  const [changeForm, setChangeForm] = useState(true);
  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      <Link to="/" className=" text-yellow-500 flex gap-2">
        <Dices className="w-8 h-8" />
        <h1 className="text-3xl font-bold mb-6 tracking-wide"> LendIT</h1>
      </Link>
      <section className="bg-neutral-600 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-700/30">
        <span className="flex mb-6 bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setChangeForm(true)}
            className={`flex-1 py-2 rounded-md ${changeForm ? "bg-yellow-500 text-black font-semibold" : "text-zinc-400 hover:text-white transition"} `}
          >
            Entrar
          </button>
          <button
            onClick={() => setChangeForm(false)}
            className={`flex-1 py-2 rounded-md ${!changeForm ? "bg-yellow-500 text-black font-semibold" : "text-zinc-400 hover:text-white transition"} `}
          >
            Criar minha conta
          </button>
        </span>
        {changeForm ? <FormLogin /> : <FormRegister setForm={setChangeForm} />}
      </section>
    </div>
  );
};
export { Auth };
