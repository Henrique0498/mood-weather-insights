import { LoginFormData } from "@/lib/validation/login-schema";
import { apiFetch } from "@/lib/api-client";
import { RegisterFormData } from "./validation/register-schema";

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

export function registerRequest(data: RegisterFormData) {
  return apiFetch.post<LoginResponse>("/auth/register", data);
}
