import { CircleUser, Mail, UserIcon } from "lucide-react";
import { MinhaConta } from "../components/User/MinhaConta";
import { UserButton } from "../components/User/UserButton";
import { DeleteButton } from "../components/User/DeleteButton";
import { useContext } from "react";
import { UserContext } from "../user/UserContext";

function User() {
  const { user, loadingUser } = useContext(UserContext);
  if (loadingUser) {
    return <p>CARREGANDO</p>;
  }
  console.log(user);

  return (
    <div className="min-h-full flex flex-col items-center gap-5 pt-[5vh]">
      <div className="flex flex-col gap-5 items-center">
        {user.data.picturePath ? (
          <img
            className="rounded-full object-cover size-52 shadow-xl/70"
            src={user.data.picturePath}
            alt="UPLOAD"
          />
        ) : (
          <CircleUser
            className="rounded-full object-cover size-52 shadow-xl/70 bg-zinc-800"
            color="#894b00"
          />
        )}
        {/* <img
          className="rounded-full object-cover size-52 shadow-xl/70"
          src=""
          alt="UPLOAD"
        /> */}
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
      <div className="flex gap-8">
        <UserButton buttonName="Meus Jogos" />
        <UserButton buttonName="Meus Pedidos" />
        <UserButton
          className="bg-yellow-800 text-white"
          buttonName="Minha Conta"
        />
        <DeleteButton />
      </div>
      <MinhaConta />
    </div>
  );
}

export { User };
