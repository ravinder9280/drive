import type { ImageFile } from "@monorepo/types";

import mongoose from "mongoose";

import { getPresignedUrl } from "../config/aws";
import { type ImageDocument, ImageModel } from "../models/image.model";
import { AppError } from "../utils/app-error";
import * as folderService from "./folder.service";

const withPresignedUrls = async (images: ImageFile[]): Promise<ImageFile[]> => {
  return Promise.all(
    images.map(async (img) => ({
      ...img,
      url: await getPresignedUrl(img.key || ""),
    }))
  );
};

const toImageDto = (doc: ImageDocument): ImageFile => ({
  _id: doc._id.toString(),
  createdAt: doc.createdAt.toISOString(),
  folderId: doc.folderId.toString(),
  key: doc.key,
  name: doc.name,
  size: doc.size,
  url: "",
  userId: doc.userId.toString(),
});



export const listImagesInFolder = async (
  userId: string,
  folderId: string,
): Promise<ImageFile[]> => {
  await folderService.assertFolderOwned(userId, folderId);
  const uid = new mongoose.Types.ObjectId(userId);
  const images = await ImageModel.find({
    folderId,
    userId: uid,
  }).sort({ createdAt: -1 });
  return withPresignedUrls(images.map(toImageDto));
};

export const createImageRecord = async (params: {
  folderId: string;
  key: string;
  name: string;
  size: number;
  userId: string;
}): Promise<ImageFile> => {
  await folderService.assertFolderOwned(params.userId, params.folderId);
  const doc = await ImageModel.create({
    folderId: new mongoose.Types.ObjectId(params.folderId),
    key: params.key,
    name: params.name,
    size: params.size,
    userId: new mongoose.Types.ObjectId(params.userId)
  });
  const dto = toImageDto(doc);
  const [withUrl] = await withPresignedUrls([dto]); 
  return withUrl;

};

export const deleteImageRecord = async (
  userId: string,
  imageId: string,
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new AppError(400, "Invalid image id", "INVALID_IMAGE_ID");
  }

  const uid = new mongoose.Types.ObjectId(userId);
  const image = await ImageModel.findOne({
    _id: new mongoose.Types.ObjectId(imageId),
    userId: uid,
  });

  if (!image) {
    throw new AppError(
      404,
      "Image not found or access denied",
      "IMAGE_NOT_FOUND",
    );
  }

  await image.deleteOne();


};

export const renameImageRecord = async (
  userId: string,
  imageId: string,
  name: string,
): Promise<ImageFile> => {
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new AppError(400, "Invalid image id", "INVALID_IMAGE_ID");
  }

  const nextName = name.trim();
  if (!nextName) {
    throw new AppError(400, "name is required");
  }

  const uid = new mongoose.Types.ObjectId(userId);
  const image = await ImageModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(imageId),
      userId: uid,
    },
    { name: nextName },
    { new: true },
  );

  if (!image) {
    throw new AppError(
      404,
      "Image not found or access denied",
      "IMAGE_NOT_FOUND",
    );
  }
  const dto = toImageDto(image);
  const [withUrl] = await withPresignedUrls([dto]);
  return withUrl;
};

export const searchImagesByQuery = async (
  userId: string,
  query: string,
): Promise<ImageFile[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new AppError(400, "Search query is required", "INVALID_QUERY");
  }

  const uid = new mongoose.Types.ObjectId(userId);
  const images = await ImageModel.find({
    name: { $options: "i", $regex: trimmed },
    userId: uid,
  }).sort({ createdAt: -1 });
  return withPresignedUrls(images.map(toImageDto));
};
