import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const CONTENT_STATUSES = ["draft", "published"] as const;

const FaqItemSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ServicePageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    navLabel: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    intro: { type: String, required: true, trim: true },
    bullets: [{ type: String, trim: true }],
    sections: [{ type: String, trim: true }],
    faq: [FaqItemSchema],
    status: { type: String, enum: CONTENT_STATUSES, default: "published", index: true },
    order: { type: Number, default: 0 },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    ctaPrimaryLabel: { type: String, default: "Demander un devis", trim: true },
    ctaSecondaryLabel: { type: String, default: "Lancer le simulateur", trim: true },
  },
  { timestamps: true },
);

export type ServicePageDoc = InferSchemaType<typeof ServicePageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ServicePage = models.ServicePage ?? model("ServicePage", ServicePageSchema);
