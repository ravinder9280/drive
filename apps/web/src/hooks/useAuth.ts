"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth";
import { authStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); 
      authStore.clearAuth();
    } catch {
      toast.error("Some error occured")
    }
  }, []);

  return {
    ...state,
    isAuthed: Boolean(state.user), 
    logout,
  };
}