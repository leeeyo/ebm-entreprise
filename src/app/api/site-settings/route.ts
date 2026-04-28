import { NextResponse } from "next/server";
import { ensureSiteSettings } from "@/lib/cms-content";

export async function GET() {
  const settings = await ensureSiteSettings();
  return NextResponse.json({ settings });
}
