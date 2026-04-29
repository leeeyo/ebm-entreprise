import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { normalizeServiceSlug } from "@/lib/service-page-editor";
import { ServicePage } from "@/models/ServicePage";

const heroPatchSchema = z.object({
  slug: z.string().trim().min(2).transform(normalizeServiceSlug),
  heroImage: z.object({
    src: z.string().trim().min(1).max(500),
    alt: z.string().trim().min(2).max(180),
  }),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = heroPatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  await ServicePage.findOneAndUpdate(
    { slug: parsed.data.slug },
    { $set: { heroImage: parsed.data.heroImage } },
    { upsert: false },
  );

  return NextResponse.json({ ok: true, heroImage: parsed.data.heroImage });
}
