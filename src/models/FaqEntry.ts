import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";
import { CONTENT_STATUSES } from "@/models/ServicePage";

const FaqEntrySchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    targetPage: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    status: { type: String, enum: CONTENT_STATUSES, default: "published", index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type FaqEntryDoc = InferSchemaType<typeof FaqEntrySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FaqEntry = models.FaqEntry ?? model("FaqEntry", FaqEntrySchema);
