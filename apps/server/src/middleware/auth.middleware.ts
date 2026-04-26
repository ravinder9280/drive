import type { NextFunction, Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AppError } from "../utils/app-error";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token;

  if (!token) {
    next(new AppError(401, "Missing authentication token"));
    return;
  }

  try {
    req.userId = authService.verifyUserId(token);
    next();
  } catch (err) {
    next(err);
  }
};