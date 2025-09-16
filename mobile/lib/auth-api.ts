import { LoginFormData } from "@/app/(auth)/utils/login-schema";
import { apiFetch } from "@/lib/api-client";

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
};

export function loginRequest(data: LoginFormData) {
  return apiFetch.post<LoginResponse>("/auth/login", data).catch((error) => {
    return Promise.reject(new Error("Credenciais inválidas"));
  });
}
