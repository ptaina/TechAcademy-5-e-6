import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.error) {
        return Promise.reject(new Error(error.response.data.error));
      }
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }

    return Promise.reject(new Error("Ocorreu um erro desconhecido na API"));
  }
);

export default api;
