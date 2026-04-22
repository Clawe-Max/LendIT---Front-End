import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated) {
        setUser(null);
        setLoadingUser(false);
        return;
      }
      setLoadingUser(true);
      try {
        const res = await api.get("/user/me");
        setUser(res.data);
      } catch {
        setUser(null);
        logout();
      } finally {
        setLoadingUser(false);
      }
    };

    run();
  }, [isAuthenticated, logout]);

  const value = useMemo(() => ({ user, loadingUser }), [user, loadingUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
