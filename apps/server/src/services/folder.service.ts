import type { Folder, FolderNode, ImageFile, ListFoldersResponse } from "@monorepo/types";
import mongoose from "mongoose";

import { FolderModel, type FolderDocument } from "../models/folder.model";
import { ImageModel } from "../models/image.model";
import { calculateFolderSize } from "../utils/calculateFolderSize";
import { AppError } from "../utils/app-error";

const toFolderDto = (doc: FolderDocument): Folder => ({
  _id: doc._id.toString(),
  name: doc.name,
  userId: doc.userId.toString(),
  parentId: doc.parentId ? doc.parentId.toString() : null,
  createdAt: doc.createdAt.toISOString(),
});

const toFolderDtoLean = (f: {
  _id: mongoose.Types.ObjectId;
  name: string;
  userId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId | null | undefined;
  createdAt: Date;
}): Folder => ({
  _id: f._id.toString(),
  name: f.name,
  userId: f.userId.toString(),
  parentId: f.parentId ? f.parentId.toString() : null,
  createdAt: f.createdAt.toISOString(),
});

const toImageDtoLean = (i: {
  _id: mongoose.Types.ObjectId;
  name: string;
  url: string;
  size: number;
  folderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}): ImageFile => ({
  _id: i._id.toString(),
  name: i.name,
  url: i.url,
  size: i.size,
  folderId: i.folderId.toString(),
  userId: i.userId.toString(),
  createdAt: i.createdAt.toISOString(),
});

export const assertFolderOwned = async (
  userId: string,
  folderId: string
): Promise<FolderDocument> => {
  const folder = await FolderModel.findOne({
    _id: folderId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!folder) {
    throw new AppError(404, "Folder not found or access denied", "FOLDER_NOT_FOUND");
  }
  return folder;
};

export const createFolder = async (
  userId: string,
  name: string,
  parentId: string | null | undefined
): Promise<Folder> => {
  const uid = new mongoose.Types.ObjectId(userId);
  let parentObjectId: mongoose.Types.ObjectId | null = null;
  if (parentId) {
    const parent = await FolderModel.findOne({ _id: parentId, userId: uid });
    if (!parent) {
      throw new AppError(
        404,
        "Parent folder not found or access denied",
        "PARENT_NOT_FOUND"
      );
    }
    parentObjectId = parent._id;
  }

  const folder = await FolderModel.create({
    name,
    userId: uid,
    parentId: parentObjectId,
  });
  return toFolderDto(folder);
};

export const listFoldersWithSizes = async (
  userId: string
): Promise<ListFoldersResponse> => {
  const uid = new mongoose.Types.ObjectId(userId);

  const folders = await FolderModel.find({ userId: uid }).lean();
  const images = await ImageModel.find({ userId: uid }).lean();

  const folderDtos = folders.map(toFolderDtoLean);

  const sizesByFolderId = calculateFolderSize(
    folders.map((f) => ({
      _id: f._id.toString(),
      parentId: f.parentId ? f.parentId.toString() : null,
    })),
    images.map((i) => ({
      folderId: i.folderId.toString(),
      size: i.size,
    }))
  );

  const foldersWithSize = folderDtos.map((f) => ({
    ...f,
    size: sizesByFolderId[f._id] ?? 0,
  }));

  return { folders: foldersWithSize };
};

export const getFolderTree = async (userId: string): Promise<FolderNode[]> => {
  const uid = new mongoose.Types.ObjectId(userId);
  const folders = await FolderModel.find({ userId: uid }).lean();
  const images = await ImageModel.find({ userId: uid }).lean();

  const sizesByFolderId = calculateFolderSize(
    folders.map((f) => ({
      _id: f._id.toString(),
      parentId: f.parentId ? f.parentId.toString() : null,
    })),
    images.map((i) => ({ folderId: i.folderId.toString(), size: i.size }))
  );

  const imageDtosByFolder = new Map<string, ImageFile[]>();
  for (const img of images) {
    const dto = toImageDtoLean(img);
    const fid = img.folderId.toString();
    const list = imageDtosByFolder.get(fid) ?? [];
    list.push(dto);
    imageDtosByFolder.set(fid, list);
  }

  const folderMap = new Map<string, FolderNode>();
  for (const f of folders) {
    const id = f._id.toString();
    folderMap.set(id, {
      ...toFolderDtoLean(f),
      children: [],
      images: imageDtosByFolder.get(id) ?? [],
      totalSize: sizesByFolderId[id] ?? 0,
    });
  }

  const roots: FolderNode[] = [];
  for (const f of folders) {
    const id = f._id.toString();
    const node = folderMap.get(id)!;
    const pid = f.parentId?.toString();
    if (pid) {
      const parent = folderMap.get(pid);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
};
