import { createContext, useEffect, useState } from "react";
import api from "@/api/axios";
import { setToken } from "./tokenService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenState, setTokenState] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (!tokenState) {
        setLoading(false);
        return;
      }

      try {
        await api.get("/user/me");
        setIsAuthenticated(true);
      } catch {
        try {
          const res = await api.post("/user/refresh");
          setToken(res.data.acessToken);
          setTokenState(res.data.acessToken);
          setIsAuthenticated(true);
        } catch {
          setToken(null);
          setTokenState(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token) => {
    setToken(token);
    setTokenState(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, tokenState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
