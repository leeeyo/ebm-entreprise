import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { splitCsv, listBlogPosts, serializeBlogPost } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { BlogPost, BLOG_POST_STATUSES } from "@/models/BlogPost";

const postSchema = z.object({
  slug: z.string().trim().min(2),
  title: z.string().trim().min(2),
  excerpt: z.string().trim().min(10),
  content: z.string().min(10),
  tags: z.string().default(""),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  status: z.enum(BLOG_POST_STATUSES).default("draft"),
  publishedAt: z.string().optional(),
  authorName: z.string().trim().default("EBM Ben Mokhtar"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const posts = await listBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const doc = await BlogPost.findOneAndUpdate(
    { slug: parsed.data.slug },
    {
      $set: {
        ...parsed.data,
        tags: splitCsv(parsed.data.tags),
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json({ post: serializeBlogPost(doc!) });
}
