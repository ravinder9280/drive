import type { User } from "@monorepo/types";

const TOKEN_KEY = "drive_token";
const USER_KEY = "drive_user";

export const AUTH_CHANGE_EVENT = "drive-auth-change";

export type AuthSnapshot = {
  token: string | null;
  user: User | null;
};

/** Stable snapshot for SSR / `useSyncExternalStore` server branch (must not allocate per call). */
const SERVER_AUTH_SNAPSHOT: AuthSnapshot = { token: null, user: null };

let clientAuthSnapshot: AuthSnapshot | undefined;
let clientAuthSnapshotKey: string | undefined;

/**
 * Returns a referentially stable object for the current auth state while localStorage is unchanged.
 * Required for `useSyncExternalStore` (React 19 enforces cached `getServerSnapshot` / stable snapshots).
 */
export function getAuthSnapshot(): AuthSnapshot {
  if (typeof window === "undefined") {
    return SERVER_AUTH_SNAPSHOT;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  const key = `${token ?? ""}\0${userRaw ?? ""}`;

  if (clientAuthSnapshot !== undefined && clientAuthSnapshotKey === key) {
    return clientAuthSnapshot;
  }

  let user: User | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User;
    } catch {
      user = null;
    }
  }

  clientAuthSnapshot = { token, user };
  clientAuthSnapshotKey = key;
  return clientAuthSnapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return SERVER_AUTH_SNAPSHOT;
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function isAuthed(): boolean {
  return Boolean(getToken());
}
