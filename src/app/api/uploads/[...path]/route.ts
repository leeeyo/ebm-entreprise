import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_req: Request, { params }: Params) {
  const { path: pathParts } = await params;
  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  const root = path.isAbsolute(uploadDir)
    ? uploadDir
    : path.join(/* turbopackIgnore: true */ process.cwd(), uploadDir);
  const requested = path.normalize(path.join(root, ...pathParts));

  if (!requested.startsWith(path.normalize(root))) {
    return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });
  }

  try {
    const file = await readFile(requested);
    const contentType = MIME_BY_EXTENSION[path.extname(requested).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
