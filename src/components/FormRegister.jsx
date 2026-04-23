import { useState } from "react";
import api from "../api/axios";

const REGISTER_URL = "/user";

const FormRegister = ({ setForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post(REGISTER_URL, formData);
      setForm(true);
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <input
          value={formData.username}
          onChange={(e) =>
            setFormData((state) => ({ ...state, username: e.target.value }))
          }
          type="text"
          placeholder="*Seu nome"
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          value={formData.email}
          onChange={(e) =>
            setFormData((state) => ({ ...state, email: e.target.value }))
          }
          type="email"
          placeholder="*E-mail"
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          value={formData.password}
          onChange={(e) =>
            setFormData((state) => ({ ...state, password: e.target.value }))
          }
          type="password"
          placeholder="*Senha"
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      {/* <ul className="mt-4 text-sm">
        <li>
          <h1>Siga essas dicas:</h1>
        </li>
        <li>Mínimo 6 caracteres</li>
        <li>
          <p>
            Tente uma combinação com letras maiúsculas e minúsculas, números e
            caracteres especiais
          </p>
        </li>
        <li>
          <p>
            Evite sequências como "12345" ou "abc" Evite informações pessoais e
            palavras comuns
          </p>
        </li>
      </ul> */}
      {error && <span className="text-orange-700">{error}</span>}
      <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition">
        Criar
      </button>
      <p>
        Ao se cadastrar, você aceita os Termos de Uso e a Política de
        Privacidade
      </p>
    </form>
  );
};
export { FormRegister };
