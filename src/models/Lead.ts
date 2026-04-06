import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    estimateTnd: { type: Number },
    simulation: { type: Schema.Types.Mixed },
    contacted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type LeadDoc = InferSchemaType<typeof LeadSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Lead = models.Lead ?? model("Lead", LeadSchema);
