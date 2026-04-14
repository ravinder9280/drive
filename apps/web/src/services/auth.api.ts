import type { AuthResponse, LoginRequestBody, SignupRequestBody } from "@monorepo/types";

import { api } from "@/lib/api";

export async function signup(body: SignupRequestBody): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup", body);
  return data;
}

export async function login(body: LoginRequestBody): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", body);
  return data;
}
