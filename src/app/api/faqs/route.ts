import { NextResponse } from "next/server";
import { listFaqEntries } from "@/lib/cms-content";

export async function GET() {
  const faqs = await listFaqEntries({ publishedOnly: true });
  return NextResponse.json({ faqs });
}
