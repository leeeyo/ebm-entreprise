import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ensureSiteSettings, serializeSiteSettings, splitCsv, splitLines } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";

const siteSettingsSchema = z.object({
  addressLine: z.string().trim().min(2),
  addressShort: z.string().trim().min(2),
  phone: z.string().trim().min(2),
  phoneDisplay: z.string().trim().min(2),
  phoneHref: z.string().trim().min(2),
  email: z.string().trim().email(),
  hoursTitle: z.string().trim().min(2),
  hoursWeek: z.string().trim().min(2),
  hoursWeekend: z.string().trim().min(2),
  footerMessage: z.string().trim().min(10),
  seoTitle: z.string().trim().min(2),
  seoDescription: z.string().trim().min(10),
  seoKeywords: z.string().default(""),
  reassuranceItems: z.string().default(""),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const settings = await ensureSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = siteSettingsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const doc = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        ...parsed.data,
        seoKeywords: splitCsv(parsed.data.seoKeywords),
        reassuranceItems: splitLines(parsed.data.reassuranceItems),
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json({ settings: serializeSiteSettings(doc!) });
}
