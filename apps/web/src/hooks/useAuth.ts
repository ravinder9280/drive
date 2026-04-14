"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth";
import { authStore } from "@/store/auth.store";

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const logout = useCallback(() => {
    authStore.clearAuth();
  }, []);

  return {
    ...state,
    isAuthed: Boolean(state.token),
    logout,
  };
}
