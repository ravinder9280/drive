import type { Folder, FolderNode } from "./folder";
import type { ImageFile } from "./image";
import type { User } from "./user";

export interface GetTestResponse {
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupRequestBody {
  email: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface CreateFolderRequestBody {
  name: string;
  parentId?: string | null;
}

export interface ListFoldersResponse {
  folders: Folder[];
  sizesByFolderId: Record<string, number>;
}

export interface ListImagesQuery {
  folderId: string;
}

export interface UploadImageResponse {
  image: ImageFile;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
}

export interface FolderTreeResponse {
  tree: FolderNode[];
}
