import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { ChantierAsset } from "@/models/ChantierAsset";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  const label = String(form.get("label") ?? "").trim();
  const alt = String(form.get("alt") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();
  const projectSlug = String(form.get("projectSlug") ?? "").trim();
  const serviceSlug = String(form.get("serviceSlug") ?? "").trim();
  const gallery = String(form.get("gallery") ?? "chantiers").trim() || "chantiers";
  const status = form.get("status") === "published" ? "published" : "draft";

  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  const abs = path.isAbsolute(uploadDir)
    ? uploadDir
    : path.join(/* turbopackIgnore: true */ process.cwd(), uploadDir);
  await mkdir(abs, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const relativePath = path.join("chantiers", filename).replace(/\\/g, "/");
  const fullPath = path.join(abs, "chantiers");
  await mkdir(fullPath, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(fullPath, filename), buffer);

  await connectDB();
  const doc = await ChantierAsset.create({
    filename: safeName,
    relativePath,
    label,
    alt,
    caption,
    projectSlug,
    serviceSlug,
    gallery,
    status,
  });

  return NextResponse.json({ id: doc._id.toString(), relativePath });
}
