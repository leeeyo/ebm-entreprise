import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { listFaqEntries, serializeFaqEntry, splitCsv } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { FaqEntry } from "@/models/FaqEntry";
import { CONTENT_STATUSES } from "@/models/ServicePage";

const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(5),
  answer: z.string().trim().min(10),
  category: z.string().trim().min(2),
  targetPage: z.string().trim().optional(),
  keywords: z.string().default(""),
  status: z.enum(CONTENT_STATUSES).default("published"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const faqs = await listFaqEntries();
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = faqSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const payload = { ...parsed.data, keywords: splitCsv(parsed.data.keywords) };
  const doc = parsed.data.id
    ? await FaqEntry.findByIdAndUpdate(parsed.data.id, { $set: payload }, { returnDocument: "after" })
    : await FaqEntry.create(payload);

  return NextResponse.json({ faq: serializeFaqEntry(doc!) });
}
