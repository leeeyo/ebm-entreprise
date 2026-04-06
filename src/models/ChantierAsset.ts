import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const ChantierAssetSchema = new Schema(
  {
    filename: { type: String, required: true },
    relativePath: { type: String, required: true },
    label: { type: String },
  },
  { timestamps: true },
);

export type ChantierAssetDoc = InferSchemaType<typeof ChantierAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ChantierAsset =
  models.ChantierAsset ?? model("ChantierAsset", ChantierAssetSchema);
