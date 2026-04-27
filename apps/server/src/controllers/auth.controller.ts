import type { Request, Response } from "express";

import { z } from "zod";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "../utils/async-handler";

const signupBody = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsed = signupBody.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid body");
  }
  const { token, user } = await authService.signup(
    parsed.data.email,
    parsed.data.password,
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid body");
  }
  const { token, user } = await authService.login(
    parsed.data.email,
    parsed.data.password,
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ user });
});
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ success: true });
};
