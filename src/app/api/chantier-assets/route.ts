import { NextResponse } from "next/server";
import { listChantierAssets } from "@/lib/cms-content";

export async function GET() {
  const assets = await listChantierAssets({ publishedOnly: true });
  return NextResponse.json({ assets });
}
