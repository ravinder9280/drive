import type { Request, Response } from "express";

import { z } from "zod";

import { uploadFile } from "../config/aws";
import * as imageService from "../services/image.service";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "../utils/async-handler";

const listQuery = z.object({
  folderId: z.string().min(1),
});
const searchQuery = z.object({
  query: z.string().min(1),
});

export const listByFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized");
    }
    const parsed = listQuery.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(400, "folderId query is required");
    }
    const images = await imageService.listImagesInFolder(
      userId,
      parsed.data.folderId,
    );
    res.json({ images });
  },
);

export const upload = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const file = req.file;
  
  if (!file) {
    throw new AppError(400, "image file is required");
  }

  const folderId = req.body.folderId as string | undefined;
  const nameRaw = req.body.name as string | undefined;
  if (!folderId || typeof folderId !== "string") {
    throw new AppError(400, "folderId is required");
  }

  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : file.originalname;

  const uploadedUrl = await uploadFile(
    "demo",
    name,
    file.mimetype,
    file.buffer,
  );

  const image = await imageService.createImageRecord({
    folderId,
    key: uploadedUrl.key,
    name,
    size: file.size,
    url: uploadedUrl.Location,
    userId,
  });

  res.status(201).json({ image });
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const imageId = req.params.imageId;
  if (!imageId) {
    throw new AppError(400, "imageId is required");
  }
  await imageService.deleteImageRecord(userId, imageId);
  res.status(200).json({ message: "Image deleted" });
});

//rename image
export const renameImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const imageId = req.params.imageId;
  if (!imageId) {
    throw new AppError(400, "imageId is required");
  }
  const name = req.body.name as string | undefined;
  if (!name) {
    throw new AppError(400, "name is required");
  }
  const image = await imageService.renameImageRecord(userId, imageId, name);
  res.status(200).json({ image });
});

export const searchByquery = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized");
    }
    const parsed = searchQuery.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(400, "folderId query is required");
    }
    const images = await imageService.searchImagesByQuery(
      userId,
      parsed.data.query,
    );
    res.json({ images });
  },
);
