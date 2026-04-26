import type { User } from "@monorepo/types";

import {
  AUTH_CHANGE_EVENT,
  clearAuth as clearAuthStorage,
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

  getUser,

  setAuth(user: User): void {
    setAuthStorage(user);
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