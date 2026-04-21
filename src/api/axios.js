import axios from "axios";
import { getToken, setToken } from "../auth/tokenService";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/user/refresh");
        const newToken = response.data.accessToken;

        setToken(newToken);

        originalRequest.headers.authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setToken(null);

        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
