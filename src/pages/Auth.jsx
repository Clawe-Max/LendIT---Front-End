import { Link } from "react-router-dom";
import { FormLogin } from "../components/Auth/FormLogin";
import { Dices } from "lucide-react";
import { FormRegister } from "../components/Auth/FormRegister";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/common/tabs/Tabs";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Link to="/" className=" text-yellow-500 flex gap-2 hover:scale-105">
        <Dices className="w-8 h-8" />
        <h1 className="text-3xl font-bold mb-6 tracking-wide"> LendIT</h1>
      </Link>
      <section className="bg-neutral-800 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-700/30">
        <Tabs defaultValue="login">
          <TabsList className="flex mb-6 bg-zinc-900 rounded-lg p-1">
            <TabsTrigger
              value="login"
              className="
                flex-1 py-2 rounded-md transition
                data-[state=active]:bg-yellow-500
                data-[state=active]:text-black
                data-[state=active]:font-semibold
                text-zinc-400
                hover:text-white
              "
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="
                flex-1 py-2 rounded-md transition
                data-[state=active]:bg-yellow-500
                data-[state=active]:text-black
                data-[state=active]:font-semibold
                text-zinc-400
                hover:text-white
              "
            >
              Criar minha conta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <FormLogin />
          </TabsContent>

          <TabsContent value="register">
            <FormRegister />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};
export { Auth };
