import { createContext } from "react";

const defaultAuth = {
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext(defaultAuth);
