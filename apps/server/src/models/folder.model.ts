import mongoose, { type InferSchemaType, Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

folderSchema.index({ userId: 1, parentId: 1 });

export type FolderDocument = InferSchemaType<typeof folderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FolderModel =
  mongoose.models.Folder ??
  mongoose.model<FolderDocument>("Folder", folderSchema);
