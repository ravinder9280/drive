import type { ImageFile } from "./image";

export interface Folder {
  _id: string;
  name: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
}

export interface FolderNode extends Folder {
  children: FolderNode[];
  images: ImageFile[];
  totalSize: number;
}
