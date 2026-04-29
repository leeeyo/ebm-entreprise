import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

function normalizeBlogSlug(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/?actualites\//, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

const coverPatchSchema = z.object({
  slug: z.string().trim().min(2).transform(normalizeBlogSlug),
  coverImage: z.object({
    src: z.string().trim().min(1).max(500),
    alt: z.string().trim().min(2).max(180),
  }),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = coverPatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  await BlogPost.findOneAndUpdate(
    { slug: parsed.data.slug },
    { $set: { coverImage: parsed.data.coverImage } },
    { upsert: false },
  );

  revalidatePath("/admin/content/blog");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${parsed.data.slug}`);

  return NextResponse.json({ ok: true, coverImage: parsed.data.coverImage });
}
