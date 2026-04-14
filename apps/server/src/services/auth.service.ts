import type { AuthResponse, User } from "@monorepo/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { AppError } from "../utils/app-error";
import { type UserDocument, UserModel } from "../models/user.model";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES = "7d";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const toUserDto = (doc: UserDocument): User => ({
  _id: doc._id.toString(),
  email: doc.email,
  createdAt: doc.createdAt.toISOString(),
});

const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRES });

export const signup = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) {
    throw new AppError(409, "Email already registered", "EMAIL_TAKEN");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ email, passwordHash });

  const doc = user.toObject() as UserDocument;
  return {
    user: toUserDto(doc),
    token: signToken(doc._id.toString()),
  };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const hash = user.passwordHash as string;
  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const doc = user.toObject() as UserDocument;
  return {
    user: toUserDto(doc),
    token: signToken(doc._id.toString()),
  };
};

export const verifyUserId = (token: string): string => {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & {
      sub?: string;
    };
    const sub = payload.sub;
    if (!sub || !mongoose.Types.ObjectId.isValid(sub)) {
      throw new AppError(401, "Invalid token", "INVALID_TOKEN");
    }
    return sub;
  } catch {
    throw new AppError(401, "Invalid or expired token", "INVALID_TOKEN");
  }
};
