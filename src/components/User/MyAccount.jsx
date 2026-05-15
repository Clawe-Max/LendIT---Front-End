import { useContext, useRef, useState } from "react";
import { CardForm } from "./CardForm";
import { UserButton } from "./UserButton";
import { UserContext } from "../../user/UserContext";
import { Input } from "../common/Input";
import { ErrorMessage } from "../common/ErrorMessage";
import api from "../../api/axios";
import { Delete, Image, Upload, X } from "lucide-react";

const userURL = "/user";
const defaultFormData = {
  email: "",
  password: "",
  username: "",
};

const MyAccount = () => {
  const { user, setUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState("");

  const inputRef = useRef(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
    setError(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordCheck !== formData.password) {
      return setError("Password confirmation does not match.");
    }
    setLoading(true);
    const { username, password, email } = formData;
    const updatedUser = new FormData();
    if (username.trim()) updatedUser.append("username", username);
    if (password.trim()) updatedUser.append("password", password);
    if (email.trim()) updatedUser.append("email", email);
    if (file) updatedUser.append("image", file);
    try {
      await api.put(userURL, updatedUser, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await api.get(`${userURL}/me`);
      setUser(res.data);
      setFormData(defaultFormData);
      setPasswordCheck("");
      setFile(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
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
          <label htmlFor="username" className="text-xs ">
            Nome de Exibição
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            onChange={handleChange}
            value={formData.username}
            placeholder={user.data.Username}
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
            placeholder={user.data.Email}
            value={formData.email}
          />
        </div>
      </CardForm>
      <CardForm className="relative" title="Carregar Foto">
        <div className="">
          <label
            className="flex justify-center py-6 w-full h-full transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
            id="drop"
          >
            <span className="flex items-center space-x-2">
              <span className="font-bold text-zinc-500 flex gap-4">
                <Upload />
                Escolha uma imagem
              </span>
            </span>
            <input
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
              name="file_upload"
              className="hidden"
              accept="image/png,image/jpeg"
              id="input"
            />
          </label>
        </div>
        {file && (
          <span className="absolute flex items-center gap-1  bottom-2 left-8 text-sm">
            <Image />
            {file.name}
            <button
              className="flex items-center justify-center cursor-pointer pt-1 hover:text-red-400 transition"
              onClick={() => {
                setFile(null);

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              <Delete size={24} />
            </button>
          </span>
        )}
      </CardForm>
      <ErrorMessage message={error} />
      <div className="mb-5">
        <UserButton
          disabled={loading}
          className="bg-zinc-700 text-white hover:brightness-110 drop-shadow-xl/50 disabled:opacity-50 disabled:cursor-default disabled:active:scale-100"
        >
          Salvar Alterações
        </UserButton>
      </div>
    </form>
  );
};

export { MyAccount };
