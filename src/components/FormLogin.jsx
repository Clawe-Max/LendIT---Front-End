import { useState } from "react";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  return (
    <form action="">
      <div>
        <input
          value={formData.email}
          onChange={(e) =>
            setFormData((state) => ({ ...state, email: e.target.value }))
          }
          type="email"
          placeholder="*E-mail"
        />
        <input
          value={formData.password}
          onChange={(e) =>
            setFormData((state) => ({ ...state, password: e.target.value }))
          }
          type="password"
          placeholder="*Senha"
        />
      </div>
      <div>
        <label>
          <input type="checkbox" />
          Lembrar
        </label>
        <a href="" className="underline">
          Esqueci minha senha
        </a>
      </div>
      <button>Login</button>
    </form>
  );
};
export { FormLogin };
