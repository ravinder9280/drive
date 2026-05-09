import type { User } from "@monorepo/types";

const USER_KEY = "drive_user";
const TOKEN_KEY = "drive_token";

export const AUTH_CHANGE_EVENT = "drive-auth-change";

export type AuthSnapshot = {
  user: null | User;
};

const SERVER_AUTH_SNAPSHOT: AuthSnapshot = { user: null };

let clientAuthSnapshot: AuthSnapshot | undefined;
let clientAuthSnapshotKey: string | undefined;

export function clearAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  // Expire the middleware cookie
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}


export function getAuthSnapshot(): AuthSnapshot {
  if (typeof window === "undefined") {
    return SERVER_AUTH_SNAPSHOT;
  }

  const userRaw = localStorage.getItem(USER_KEY);
  const key = userRaw ?? "";

  if (clientAuthSnapshot && clientAuthSnapshotKey === key) {
    return clientAuthSnapshot;
  }

  let user: null | User = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  clientAuthSnapshot = { user };
  clientAuthSnapshotKey = key;

  return clientAuthSnapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return SERVER_AUTH_SNAPSHOT;
}

export function getToken(): null | string {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): null | User {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthed(): boolean {
  return Boolean(getUser());
}

export function setAuth(user: User, token: string): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  // Set a JS-accessible cookie so the Next.js Edge middleware can gate routes
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}