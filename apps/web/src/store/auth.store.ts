import type { User } from "@monorepo/types";

import {
  AUTH_CHANGE_EVENT,
  clearAuth as clearAuthStorage,
  getToken,
  getUser,
  setAuth as setAuthStorage,
} from "@/lib/auth";

/**
 * Thin facade over localStorage auth helpers for components that prefer a store-like API.
 */
export const authStore = {
  clearAuth(): void {
    clearAuthStorage();
  },
  getToken,
  getUser,
  setAuth(token: string, user: User): void {
    setAuthStorage(token, user);
  },
  subscribe(listener: () => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }
    const handler = (): void => listener();
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};
