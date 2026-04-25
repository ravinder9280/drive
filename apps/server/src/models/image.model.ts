import mongoose, { type InferSchemaType, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    folderId: {
      index: true,
      ref: "Folder",
      required: true,
      type: Schema.Types.ObjectId,
    },
    key: { required: true, type: String },
    name: { required: true, trim: true, type: String },
    size: { min: 0, required: true, type: Number },
    url: { required: true, type: String },
    userId: {
      index: true,
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

imageSchema.index({ folderId: 1, userId: 1 });

export type ImageDocument = InferSchemaType<typeof imageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ImageModel =
  mongoose.models.ImageFile ??
  mongoose.model<ImageDocument>("ImageFile", imageSchema);
