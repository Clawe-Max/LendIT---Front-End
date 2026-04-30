import { useCallback, useEffect, useMemo, useState } from "react";
import { setToken } from "./tokenService";
import { AuthContext } from "./AuthContext";
import api, { setAuthHandlers } from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/user/refresh");
        setToken(res.data.accessToken);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback((token) => {
    setToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setAuthHandlers({ logout });
  }, [logout]);

  const value = useMemo(() => {
    return { isAuthenticated, loading, login, logout };
  }, [isAuthenticated, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
