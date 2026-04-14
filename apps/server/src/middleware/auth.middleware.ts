import type { NextFunction, Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/app-error";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Missing or invalid Authorization header"));
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    next(new AppError(401, "Missing token"));
    return;
  }
  try {
    req.userId = authService.verifyUserId(token);
    next();
  } catch (err) {
    next(err);
  }
};
