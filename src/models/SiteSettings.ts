import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true, index: true },
    addressLine: { type: String, required: true, trim: true },
    addressShort: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    phoneDisplay: { type: String, required: true, trim: true },
    phoneHref: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    hoursTitle: { type: String, required: true, trim: true },
    hoursWeek: { type: String, required: true, trim: true },
    hoursWeekend: { type: String, required: true, trim: true },
    footerMessage: { type: String, required: true, trim: true },
    seoTitle: { type: String, required: true, trim: true },
    seoDescription: { type: String, required: true, trim: true },
    seoKeywords: [{ type: String, trim: true }],
    reassuranceItems: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings = models.SiteSettings ?? model("SiteSettings", SiteSettingsSchema);
