import { Link } from "react-router-dom";
import { FormLogin } from "../components/FormLogin";
import { FormRegister } from "../components/FormRegister";

const Auth = () => {
  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      <Link to="/">
        <h1>LendIT</h1>
      </Link>
      <section className="bg-neutral-600">
        <span>
          <button>Entrar</button>
          <button>Criar minha conta</button>
        </span>
        <FormLogin />
        <FormRegister />
      </section>
    </div>
  );
};
export { Auth };
