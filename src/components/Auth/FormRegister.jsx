import { useState } from "react";
import api from "../../api/axios";
import { Input } from "../Input";
import { ErrorMessage } from "../ErrorMessage";

const REGISTER_URL = "/user";

const FormRegister = ({ setForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(REGISTER_URL, formData);
      setForm(true);
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
    <form action="" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          name="username"
          type="text"
          placeholder="*Seu nome"
          value={formData.username}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
        <Input
          name="email"
          type="email"
          placeholder="*E-mail"
          value={formData.email}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
        />
        <Input
          name="password"
          type="password"
          placeholder="*Senha"
          value={formData.password}
          onChange={handleChange}
          className={
            "rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-yellow-500"
          }
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
      <ErrorMessage className="pt-2" message={error} />
      <button
        disabled={loading}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
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
