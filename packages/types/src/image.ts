export interface ImageFile {
  _id: string;
  name: string;
  url?: string;
  size: number;
  folderId: string;
  userId: string;
  createdAt: string;
  key?:string
}
