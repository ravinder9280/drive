import type {
  Folder,
  FolderTreeResponse,
  ListFoldersResponse,
} from "@monorepo/types";

import { api } from "@/lib/api";

export async function createFolder(params: {
  name: string;
  parentId?: null | string;
}): Promise<Folder> {
  const { data } = await api.post<{ folder: Folder }>("/folders", params);
  return data.folder;
}

export async function getFolderTree(): Promise<FolderTreeResponse> {
  const { data } = await api.get<FolderTreeResponse>("/folders/tree");
  return data;
}

export async function listFolders(): Promise<ListFoldersResponse> {
  const { data } = await api.get<ListFoldersResponse>("/folders");
  return data;
}
