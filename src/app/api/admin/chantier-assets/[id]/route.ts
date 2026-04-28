import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { serializeChantierAsset } from "@/lib/cms-content";
import { ChantierAsset } from "@/models/ChantierAsset";

const assetPatchSchema = z.object({
  label: z.string().trim().optional(),
  alt: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  projectSlug: z.string().trim().optional(),
  serviceSlug: z.string().trim().optional(),
  gallery: z.string().trim().default("chantiers"),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = assetPatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { id } = await params;
  await connectDB();
  const doc = await ChantierAsset.findByIdAndUpdate(id, { $set: parsed.data }, { returnDocument: "after" });
  if (!doc) {
    return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
  }

  return NextResponse.json({ asset: serializeChantierAsset(doc) });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  await ChantierAsset.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
