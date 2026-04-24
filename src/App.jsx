import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./user/UserProvider";
import { Content } from "./components/Content";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div className="h-screen bg-radial from-yellow-700 to-yellow-950">
          <Routes>
            <Route element={<Auth />} path="/Auth" />
            <Route path="/" element={<Content />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
