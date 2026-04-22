import { useCallback, useEffect, useMemo, useState } from "react";
import { getToken, setToken } from "./tokenService";
import { AuthContext } from "./AuthContext";
import { setAuthHandlers } from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
      }
      setLoading(false);
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
