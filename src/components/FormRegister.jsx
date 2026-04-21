import { useState } from "react";

const FormRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  return (
    <form action="">
      <div>
        <input
          value={formData.username}
          onChange={(e) =>
            setFormData((state) => ({ ...state, username: e.target.value }))
          }
          type="text"
          placeholder="*Seu nome"
        />
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
      <ul>
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
      </ul>

      <button>Criar</button>
      <p>
        Ao se cadastrar, você aceita os Termos de Uso e a Política de
        Privacidade
      </p>
    </form>
  );
};
export { FormRegister };
