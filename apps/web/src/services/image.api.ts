import type { ImageFile } from "@monorepo/types";

import { api, getApiOrigin } from "@/lib/api";

export async function listImages(folderId: string): Promise<ImageFile[]> {
  const { data } = await api.get<{ images: ImageFile[] }>("/images", {
    params: { folderId },
  });
  return data.images;
}

export async function uploadImage(params: {
  folderId: string;
  name?: string;
  file: File;
}): Promise<ImageFile> {
  const formData = new FormData();
  formData.append("folderId", params.folderId);
  if (params.name) {
    formData.append("name", params.name);
  }
  formData.append("image", params.file);

  const { data } = await api.post<{ image: ImageFile }>(
    "/images/upload",
    formData
  );
  return data.image;
}

export async function deleteImage(imageId: string): Promise<void> {
  await api.delete(`/images/${imageId}`);
}

export async function renameImage(imageId: string, name: string): Promise<ImageFile> {
  const { data } = await api.patch<{ image: ImageFile }>(`/images/${imageId}`, {
    name,
  });
  return data.image;
}

export function imageUrlToAbsolute(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${getApiOrigin()}${url.startsWith("/") ? "" : "/"}${url}`;
}
