import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";
import { API_BASE_URL } from "@/constants/api";
import { router } from "expo-router";
declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

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

let isRefreshing = false;
let pendingQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

async function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  pendingQueue = [];
}

async function refreshTokenRequest() {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error("Sem refresh token");
  }

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  return response.data as { accessToken: string; refreshToken?: string };
}

function forceLogout() {
  const { clearAuth } = useAuthStore.getState();

  clearAuth();

  try {
    router.replace("/(auth)/login");
  } catch {}
}

apiFetch.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiFetch(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const data = await refreshTokenRequest();

          const { setTokens } = useAuthStore.getState();

          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });

          await processQueue(null, data.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }

          resolve(apiFetch(originalRequest));
        } catch (refreshErr) {
          await processQueue(refreshErr, null);
          forceLogout();
          reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      });
    }

    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Erro inesperado";
    return Promise.reject(new Error(message));
  }
);
