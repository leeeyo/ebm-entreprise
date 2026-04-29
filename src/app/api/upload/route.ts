import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ALLOWED_MIME_TYPES = new Set(["image/avif", "image/webp", "image/png", "image/jpeg"]);
const MAX_FILE_SIZE = 6 * 1024 * 1024;
const SCOPES = new Set(["services", "projects"]);

function safeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9/_-]/g, "-")
    .replace(/\/+/g, "/")
    .split("/")
    .filter(Boolean)
    .join("/");
}

function safeFilename(value: string) {
  const ext = path.extname(value).toLowerCase();
  const base = path.basename(value, ext).replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-") || "image";
  return `${Date.now()}-${base}${ext || ".webp"}`;
}

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

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format image non autorisé" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image trop lourde" }, { status: 400 });
  }

  const scope = String(form.get("scope") ?? "").trim();
  const ownerSlug = safeSegment(String(form.get("ownerSlug") ?? ""));
  if (!SCOPES.has(scope) || !ownerSlug) {
    return NextResponse.json({ error: "Destination d'upload invalide" }, { status: 400 });
  }

  const alt = String(form.get("alt") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();

  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  const abs = path.isAbsolute(uploadDir)
    ? uploadDir
    : path.join(/* turbopackIgnore: true */ process.cwd(), uploadDir);
  await mkdir(abs, { recursive: true });

  const filename = safeFilename(file.name);
  const relativePath = path.join(scope, ownerSlug, filename).replace(/\\/g, "/");
  const fullPath = path.join(abs, scope, ownerSlug);
  await mkdir(fullPath, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(fullPath, filename), buffer);

  return NextResponse.json({
    image: {
      src: `/api/uploads/${relativePath}`,
      alt: alt || "Image EBM Ben Mokhtar.",
      caption: caption || undefined,
    },
    relativePath,
  });
}
