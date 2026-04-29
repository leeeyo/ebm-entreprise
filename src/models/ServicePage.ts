import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const CONTENT_STATUSES = ["draft", "published"] as const;

const FaqItemSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const MediaItemSchema = new Schema(
  {
    src: { type: String, trim: true },
    alt: { type: String, trim: true },
    caption: { type: String, trim: true },
  },
  { _id: false },
);

const ServiceContentSectionSchema = new Schema(
  {
    eyebrow: { type: String, trim: true },
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    items: [{ type: String, trim: true }],
  },
  { _id: false },
);

const ServicePageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    navLabel: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    heroEyebrow: { type: String, default: "Savoir-faire EBM", trim: true },
    heroImage: MediaItemSchema,
    title: { type: String, required: true, trim: true },
    intro: { type: String, required: true, trim: true },
    bullets: [{ type: String, trim: true }],
    contentSections: [ServiceContentSectionSchema],
    showImageGallery: { type: Boolean, default: true },
    galleryEyebrow: { type: String, default: "Aperçu", trim: true },
    galleryTitle: { type: String, default: "En images", trim: true },
    gallerySubtitle: { type: String, trim: true },
    galleryImages: [MediaItemSchema],
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
