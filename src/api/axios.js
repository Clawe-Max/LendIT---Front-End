import axios from "axios";
import { getToken, setToken } from "../auth/tokenService";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/user/refresh");
        const newToken = response.data.accessToken;

        setToken(newToken);

        originalRequest.headers.authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        setToken(null);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
