import mongoose, { type InferSchemaType, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

imageSchema.index({ userId: 1, folderId: 1 });

export type ImageDocument = InferSchemaType<typeof imageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ImageModel =
  mongoose.models.ImageFile ??
  mongoose.model<ImageDocument>("ImageFile", imageSchema);
