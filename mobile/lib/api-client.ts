import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { API_BASE_URL } from "@/constants/api";

export const apiFetch = axios.create({
  baseURL: API_BASE_URL,
});

apiFetch.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiFetch.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Erro inesperado";
    return Promise.reject(new Error(message));
  }
);
