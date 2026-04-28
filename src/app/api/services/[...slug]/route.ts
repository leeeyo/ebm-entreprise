import { NextResponse } from "next/server";
import { getPublishedServicePage } from "@/lib/cms-content";

type Params = { params: Promise<{ slug: string[] }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const service = await getPublishedServicePage(slug.join("/"));
  if (!service) {
    return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
  }
  return NextResponse.json({ service });
}
