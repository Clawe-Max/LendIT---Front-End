import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./user/UserProvider";
import { Content } from "./components/Content";
import { User } from "./pages/User";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Chat } from "./pages/Chat";
import { ChatContextProvider } from "./chat/ChatContextProvider";
import { UserContext } from "./user/UserContext";
import { MyGames } from "./pages/MyGames";
import { GameProvider } from "./games/GameContextProvider";
import { GamePage } from "./pages/GamePage";
import { LoanPage } from "./pages/LoanPage";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatContextProvider>
          <GameProvider>
            <div className="min-h-screen bg-[url('./assets/Plano_de_fundo_do_projeto.png')] bg-no-repeat bg-cover bg-fixed">
              <div className="min-h-screen bg-zinc-900/95">
                <Routes>
                  <Route element={<Auth />} path="/Auth" />
                  <Route path="/" element={<Content />}>
                    <Route index element={<Home />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="user" element={<User />} />
                      <Route path="chat" element={<Chat />} />
                      <Route path="mygames" element={<MyGames />} />
                      <Route path="games/:id" element={<GamePage />} />
                      <Route path="loan/:id" element={<LoanPage />} />
                    </Route>
                  </Route>
                </Routes>
              </div>
            </div>
          </GameProvider>
        </ChatContextProvider>
      </UserProvider>
    </AuthProvider>
  );
}
// bg-radial from-yellow-900 to-yellow-950 bg
export default App;
