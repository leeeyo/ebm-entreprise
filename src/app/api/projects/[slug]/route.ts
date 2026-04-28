import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/cms-content";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { publishedOnly: true });
  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }
  return NextResponse.json({ project });
}
