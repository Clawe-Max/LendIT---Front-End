import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <div className="h-screen bg-radial from-yellow-700 to-yellow-950">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Auth />} path="/Auth" />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
