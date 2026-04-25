import multer from "multer";

import { AppError } from "../utils/app-error";

const MAX_FILE_BYTES = 15 * 1024 * 1024;

const allowedMime = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
]);

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMime.has(file.mimetype)) {
    cb(new AppError(400, "Only Images are allowed", "INVALID_MIME"));
    return;
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  fileFilter,
  limits: { fileSize: MAX_FILE_BYTES },
  storage: storage,
}).single("image");
