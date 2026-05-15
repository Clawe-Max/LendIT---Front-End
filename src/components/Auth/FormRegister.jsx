import { useState } from "react";
import api from "../../api/axios";
import { ErrorMessage } from "../common/ErrorMessage";
import { Input } from "../common/Input";
import { useTabsContext } from "../common/tabs";

const REGISTER_URL = "/user";

const FormRegister = () => {
  const { setActiveTab } = useTabsContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(REGISTER_URL, formData);
      setActiveTab("login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
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
    <form action="" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          name="username"
          type="text"
          placeholder="*Seu nome"
          value={formData.username}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
        <Input
          name="email"
          type="email"
          placeholder="*E-mail"
          value={formData.email}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
        <Input
          name="password"
          type="password"
          placeholder="*Senha"
          value={formData.password}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
      </div>
      <ErrorMessage className="pt-2" message={error} />
      <button
        disabled={loading}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        Criar
      </button>
      <span className="text-zinc-500">
        Ao se cadastrar, você aceita os{" "}
        <span className="text-yellow-500 hover:cursor-pointer hover:underline">
          Termos de Uso
        </span>{" "}
        e a
        <span className="text-yellow-500 hover:cursor-pointer hover:underline">
          {" "}
          Política de Privacidade
        </span>
      </span>
    </form>
  );
};
export { FormRegister };
