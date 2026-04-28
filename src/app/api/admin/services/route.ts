import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { listServicePages, serializeServicePage, splitLines } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { CONTENT_STATUSES, ServicePage } from "@/models/ServicePage";

const serviceSchema = z.object({
  slug: z.string().trim().min(2),
  navLabel: z.string().trim().min(2),
  category: z.string().trim().optional(),
  title: z.string().trim().min(2),
  intro: z.string().trim().min(10),
  bullets: z.string().default(""),
  sections: z.string().default(""),
  status: z.enum(CONTENT_STATUSES).default("published"),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  ctaPrimaryLabel: z.string().trim().default("Demander un devis"),
  ctaSecondaryLabel: z.string().trim().default("Lancer le simulateur"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const services = await listServicePages();
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = serviceSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const doc = await ServicePage.findOneAndUpdate(
    { slug: parsed.data.slug },
    {
      $set: {
        ...parsed.data,
        bullets: splitLines(parsed.data.bullets),
        sections: splitLines(parsed.data.sections),
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json({ service: serializeServicePage(doc!) });
}
