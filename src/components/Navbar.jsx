import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import api from "../api/axios";

const LOGOUT_URL = "/user/logout";

export function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  async function HandleLogout() {
    try {
      await api.post(LOGOUT_URL);
    } catch (err) {
      console.log(err);
    } finally {
      logout();
    }
  }

  return (
    <nav className="bg-zinc-800 flex items-center justify-between px-5 h-13">
      <div className="flex items-center gap-5">
        <span className="text-yellow-500 font-semibold tracking-widest">
          LendIT
        </span>

        <div className="flex items-center gap-1">
          <a
            href="/jogos"
            className="text-sm text-zinc-400 px-3 py-1.5 rounded-md hover:bg-zinc-700 hover:text-white transition-colors"
          >
            Meus Jogos
          </a>
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 px-3 py-1.5 rounded-md hover:bg-zinc-700 hover:text-white transition-colors"
            >
              Minha Conta
              <svg
                className="w-2.5 h-2.5"
                viewBox="0 0 10 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>

            {openMenu && (
              <div className="absolute top-full left-0 mt-1.5 bg-zinc-800 border border-zinc-700 rounded-lg min-w-40 overflow-hidden z-50">
                <a
                  href="/historico"
                  className="block px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  Histórico de Aluguéis
                </a>
                <div className="h-px bg-zinc-700 my-1" />
                {isAuthenticated ? (
                  <button
                    onClick={HandleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors"
                  >
                    Sair
                  </button>
                ) : (
                  <Link
                    className="w-full text-left px-4 py-2.5 text-sm text-white-400 hover:bg-zinc-700 hover:text-white-300 transition-colors"
                    to="/Auth"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700 transition-colors">
          <svg
            className="w-4 h-4 stroke-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.8"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
        </button>

        <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-md px-2.5 h-8 gap-1.5 focus-within:ring-2 focus-within:ring-yellow-500 transition-all">
          <svg
            className="w-3 h-3 stroke-zinc-600"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar jogos..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-28"
          />
        </div>
      </div>
    </nav>
  );
}
