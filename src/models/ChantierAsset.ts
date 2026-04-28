import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const ChantierAssetSchema = new Schema(
  {
    filename: { type: String, required: true },
    relativePath: { type: String, required: true },
    label: { type: String },
    alt: { type: String, trim: true },
    caption: { type: String, trim: true },
    projectSlug: { type: String, trim: true, index: true },
    serviceSlug: { type: String, trim: true, index: true },
    gallery: { type: String, default: "chantiers", trim: true, index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ChantierAssetDoc = InferSchemaType<typeof ChantierAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ChantierAsset =
  models.ChantierAsset ?? model("ChantierAsset", ChantierAssetSchema);
