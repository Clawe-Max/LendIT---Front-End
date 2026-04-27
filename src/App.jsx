import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./user/UserProvider";
import { Content } from "./components/Content";
import { User } from "./pages/User";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div className="h-screen bg-[url('./assets/Plano_de_fundo_do_projeto.png')] bg-no-repeat bg-cover backdrop-opacity-90">
          <div className="h-screen bg-black/75 backdrop-blur">
            <Routes>
              <Route element={<Auth />} path="/Auth" />
              <Route path="/" element={<Content />}>
                <Route index element={<Home />} />
                <Route path="user" element={<User />}></Route>
              </Route>
            </Routes>
          </div>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}
// bg-radial from-yellow-900 to-yellow-950 bg
export default App;
