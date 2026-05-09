import { CircleUser, Mail, Route, UserIcon } from "lucide-react";
import { MyAccount } from "../components/User/MyAccount";
import { UserButton } from "../components/User/UserButton";
import { DeleteButton } from "../components/User/DeleteButton";
import { useContext } from "react";
import { UserContext } from "../user/UserContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/common/tabs";
import Modal from "../components/common/Modal";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { ErrorMessage } from "../components/common/ErrorMessage";

const DELETE_URL = "/user/me";

function User() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, loadingUser } = useContext(UserContext);
  const { logout } = useAuth();

  if (loadingUser) {
    return <p>CARREGANDO</p>;
  }
  console.log(user);

  const [isOpen, setIsOpen] = useState(false);

  async function handleDeleteAccount() {
    try {
      setLoading(true);
      await api.delete(DELETE_URL);
      logout();
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.message ||
        "Connection timed out. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col items-center gap-5 pt-[5vh]">
      <div className="flex flex-col gap-5 items-center">
        {user.data.picturePath ? (
          <img
            className="rounded-full object-cover size-52 shadow-xl/70"
            src={`http://localhost:3000/${user.data.picturePath}`}
            alt="UPLOAD"
          />
        ) : (
          <CircleUser
            className="rounded-full object-cover size-52 shadow-xl/70 bg-zinc-800"
            color="#894b00"
          />
        )}
        <h1 className="text-5xl text-amber-50">Olá, {user.data.Username} </h1>
        <div className="flex row-auto bg-yellow-900 shadow-xl/30 text-amber-50 gap-5 p-1 px-3 rounded-xl">
          <h2 className="flex items-center row-auto gap-1">
            <UserIcon />
            {user.data.Username}
          </h2>{" "}
          <h2 className="flex items-center row-auto gap-1">
            <Mail />
            {user.data.Email}
          </h2>
        </div>
      </div>
      <Tabs
        className="w-full flex flex-col items-center gap-5"
        defaultValue="account"
      >
        <div className="flex gap-8 items-center">
          <TabsList className="flex gap-8">
            <TabsTrigger value="games" asChild>
              <UserButton
                className="
                  data-[state=active]:bg-yellow-800
                  data-[state=active]:text-white
                "
              >
                Meus Jogos
              </UserButton>
            </TabsTrigger>

            <TabsTrigger value="orders" asChild>
              <UserButton
                className="
                  data-[state=active]:bg-yellow-800
                  data-[state=active]:text-white
                "
              >
                Meus Pedidos
              </UserButton>
            </TabsTrigger>

            <TabsTrigger value="account" asChild>
              <UserButton
                className="
                  data-[state=active]:bg-yellow-800
                  data-[state=active]:text-white
                "
              >
                Minha Conta
              </UserButton>
            </TabsTrigger>
          </TabsList>

          <DeleteButton user={user} onDelete={() => setIsOpen(true)} />
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Confirmar exclusão"
          >
            <p className="text-zinc-700 mb-4">
              Tem certeza que deseja deletar sua conta?
            </p>

            <div className="flex gap-2 justify-end">
              <ErrorMessage message={error} />
              <button
                onClick={() => setIsOpen(false)}
                className="bg-zinc-300 px-4 py-2 rounded cursor-pointer"
              >
                Cancelar
              </button>

              <button
                disabled={loading}
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
              >
                Confirmar
              </button>
            </div>
          </Modal>
        </div>

        <TabsContent className="w-full flex justify-center" value="games">
          <div className="text-white">Jogos do usuário</div>
        </TabsContent>

        <TabsContent className="w-full flex justify-center" value="orders">
          <div className="text-white">Pedidos do usuário</div>
        </TabsContent>

        <TabsContent className="w-full flex justify-center" value="account">
          <MyAccount />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { User };
