import mongoose, { type InferSchemaType, Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: { required: true, trim: true, type: String },
    parentId: {
      default: null,
      index: true,
      ref: "Folder",
      type: Schema.Types.ObjectId,
    },
    userId: {
      index: true,
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

folderSchema.index({ parentId: 1, userId: 1 });

export type FolderDocument = InferSchemaType<typeof folderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FolderModel =
  mongoose.models.Folder ??
  mongoose.model<FolderDocument>("Folder", folderSchema);
