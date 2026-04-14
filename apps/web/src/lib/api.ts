import axios from "axios";

import { clearAuth, getToken } from "@/lib/auth";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1";

export const getApiOrigin = (): string => {
  const explicit = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  return baseURL.replace(/\/v1\/?$/, "");
};

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 && typeof window !== "undefined") {
      clearAuth();
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
