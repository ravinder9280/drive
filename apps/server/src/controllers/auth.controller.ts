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
  const result = await authService.signup(parsed.data.email, parsed.data.password);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid body");
  }
  const result = await authService.login(parsed.data.email, parsed.data.password);
  res.json(result);
});
