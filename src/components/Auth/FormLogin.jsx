import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import { ErrorMessage } from "../common/ErrorMessage";
import { Input } from "../common/Input";

const LOGIN_URL = "/user/login";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(LOGIN_URL, formData);
      login(response.data.accessToken);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao conectar com o servidor";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }
  return (
    <form action="" onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="*E-mail"
          value={formData.email}
          className={
            "rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
        <Input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="*Senha"
          value={formData.password}
          className={
            "rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <label className="flex items-center gap-2 text-zinc-400">
          <input type="checkbox" className="accent-yellow-500" />
          Lembrar
        </label>
        <a href="" target="blank" className="text-yellow-500 hover:underline">
          Esqueci minha senha
        </a>
      </div>
      <ErrorMessage message={error} />
      <button
        disabled={loading}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        Login
      </button>
    </form>
  );
};
export { FormLogin };
