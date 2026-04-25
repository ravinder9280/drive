import multer from "multer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { AppError } from "../utils/app-error";

const UPLOAD_SUBDIR = "uploads";
const MAX_FILE_BYTES = 15 * 1024 * 1024;

const allowedMime = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
]);

export const getUploadsDir = (): string =>
  path.join(process.cwd(), UPLOAD_SUBDIR);

export const ensureUploadsDir = (): void => {
  const dir = getUploadsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadsDir();
    cb(null, getUploadsDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMime.has(file.mimetype)) {
    cb(new AppError(400, "Only image uploads are allowed", "INVALID_MIME"));
    return;
  }
  cb(null, true);
};

export const uploadImageMiddleware = multer({
  fileFilter,
  limits: { fileSize: MAX_FILE_BYTES },
  storage,
}).single("image");
