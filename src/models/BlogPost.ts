import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const BLOG_POST_STATUSES = ["draft", "published"] as const;

const ImageSchema = new Schema(
  {
    src: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false },
);

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    coverImage: ImageSchema,
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    status: { type: String, enum: BLOG_POST_STATUSES, default: "draft", index: true },
    publishedAt: { type: Date },
    authorName: { type: String, default: "EBM Ben Mokhtar", trim: true },
  },
  { timestamps: true },
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost = models.BlogPost ?? model("BlogPost", BlogPostSchema);
