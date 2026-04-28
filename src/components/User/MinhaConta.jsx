import { Input } from "../Input";

const MinhaConta = () => {
  return (
    <div className="min-h-full min-w-full flex flex-col justify-center items-center gap-y-10">
      <span className="flex flex-col gap-8 w-1/3">
        <h1 className="text-white text-4xl">Minha Conta</h1>
        <div className="bg-yellow-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-2 justify-start">
          <h2 className="text-white text-3xl">Informações públicas</h2>
          <p className="text-white pb-3">
            Estas informações serão exibidas publicamente.
          </p>
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-white text-xs">
              Nome de Exibição
            </label>
            <Input id="username" type="text" placeholder="*Nome de exibição" />
          </div>
        </div>
      </span>
      <span>
        <h1 className="text-white">Alterar Senha</h1>
        <div className="bg-neutral-600 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-700/30">
          <div>
            <p className="text-white">Nova senha</p>
            <input type="" placeholder="*Nova senha" />
          </div>
          <div>
            <p className="text-white">Confirmar senha</p>
            <input type="" placeholder="*Confirmar senha" />
          </div>
          <div>
            <p className="text-white">Senha atual</p>
            <input type="" placeholder="*Senha atual" />
          </div>
        </div>
      </span>
      <span>
        <h1 className="text-white">Alterar E-mail</h1>
        <div className="bg-neutral-600 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-700/30">
          <div>
            <p className="text-white">E-mail</p>
            <input type="" placeholder="E-mail" />
          </div>
          <div>
            <p className="text-white">Senha atual</p>
            <input type="" placeholder="Senha atual" />
          </div>
        </div>
      </span>
    </div>
  );
};

export { MinhaConta };
