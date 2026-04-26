"use client";

import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/services/auth.api";
import { authStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthed } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed) {
      router.replace("/dashboard");
    }
  }, [isAuthed, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      authStore.setAuth(res.user);
      router.replace("/dashboard");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Image
            alt="Drive Logo"
            height={32}
            src="/drive-logo.png"
            width={32}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-muted-foreground">
            Drive
          </h1>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
        </div>
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              autoComplete="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              autoComplete="current-password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?
          <Link
            className="text-primary ml-2 underline-offset-4 hover:underline"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
