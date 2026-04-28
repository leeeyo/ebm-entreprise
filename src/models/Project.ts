import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";
import { CONTENT_STATUSES } from "@/models/ServicePage";

const ImageSchema = new Schema(
  {
    src: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    city: { type: String, default: "Tunisie", trim: true },
    type: { type: String, default: "Résidentiel", trim: true },
    year: { type: String, trim: true },
    surface: { type: String, trim: true },
    lots: { type: String, trim: true },
    status: { type: String, enum: CONTENT_STATUSES, default: "published", index: true },
    featured: { type: Boolean, default: false },
    coverImage: ImageSchema,
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ProjectDoc = InferSchemaType<typeof ProjectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project = models.Project ?? model("Project", ProjectSchema);
