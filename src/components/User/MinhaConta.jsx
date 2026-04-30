import { useState } from "react";
import { Input } from "../Input";
import { CardForm } from "./CardForm";
import { UserButton } from "./UserButton";
import { ErrorMessage } from "../ErrorMessage";

const MinhaConta = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: ""
  });
  const [error, setError] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState("");
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordCheck !== formData.password) {
      setError("As senhas não coincidem.");
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="min-h-full min-w-full flex flex-col justify-center items-center gap-y-10"
    >
      <CardForm title="Minha Conta">
        <h2 className="text-3xl">Informações públicas</h2>
        <p>Estas informações serão exibidas publicamente.</p>
        <div className="flex flex-col gap-1 pt-3">
          <label htmlFor="username" className="text-xs">
            Nome de Exibição
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            onChange={handleChange}
            value={formData.username}
            placeholder="*Nome de exibição"
          />
        </div>
      </CardForm>
      <CardForm title="Alterar Senha">
        <div>
          <label htmlFor="password" className="text-white">
            Nova senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="*Nova senha"
          />
        </div>
        <div>
          <label htmlFor="passwordCheck" className="text-white">
            Confirmar senha
          </label>
          <Input
            id="passwordCheck"
            name="passwordCheck"
            type="password"
            onChange={(e) => {
              setPasswordCheck(e.target.value);
              setError(null);
            }}
            value={passwordCheck}
            placeholder="*Confirmar senha"
          />
        </div>
      </CardForm>
      <CardForm title="Alterar Email">
        <div>
          <label htmlFor="email" className="text-white">
            E-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="*E-mail"
            value={formData.email}
          />
        </div>
      </CardForm>
      <ErrorMessage message={error} />
      <div className="mb-5">
        <UserButton
          buttonName="Salvar Alterações"
          className="bg-yellow-700 text-white hover:brightness-110 drop-shadow-xl/50"
        />
      </div>
    </form>
  );
};

export { MinhaConta };
