import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LOGIN_URL = "/user/login";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post(LOGIN_URL, formData);
      login(response.data.accessToken);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao conectar com o servidor";
      setError(message);
    }
  }
  return (
    <form action="" onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col gap-4">
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
      <div className="flex items-center justify-between mt-4 text-sm">
        <label className="flex items-center gap-2 text-zinc-400">
          <input type="checkbox" className="accent-yellow-500" />
          Lembrar
        </label>
        <a href="" className="text-yellow-500 hover:underline">
          Esqueci minha senha
        </a>
      </div>
      {error && <span className="text-orange-700">{error}</span>}
      <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition">
        Login
      </button>
    </form>
  );
};
export { FormLogin };
