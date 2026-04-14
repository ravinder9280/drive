import type { Request, Response } from "express";
import { z } from "zod";

import * as folderService from "../services/folder.service";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "../utils/async-handler";

const createBody = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional().nullable(),
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const parsed = createBody.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid body");
  }
  const parentId =
    parsed.data.parentId === undefined || parsed.data.parentId === ""
      ? null
      : parsed.data.parentId;
  const folder = await folderService.createFolder(
    userId,
    parsed.data.name,
    parentId
  );
  res.status(201).json({ folder });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const result = await folderService.listFoldersWithSizes(userId);
  res.json(result);
});

export const tree = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const treeNodes = await folderService.getFolderTree(userId);
  res.json({ tree: treeNodes });
});
