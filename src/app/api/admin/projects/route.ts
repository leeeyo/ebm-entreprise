import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { listProjects, serializeProject } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { CONTENT_STATUSES } from "@/models/ServicePage";

const projectSchema = z.object({
  slug: z.string().trim().min(2),
  title: z.string().trim().min(2),
  shortDescription: z.string().trim().min(10),
  body: z.string().trim().optional(),
  city: z.string().trim().default("Tunisie"),
  type: z.string().trim().default("Résidentiel"),
  year: z.string().trim().optional(),
  surface: z.string().trim().optional(),
  lots: z.string().trim().optional(),
  status: z.enum(CONTENT_STATUSES).default("published"),
  featured: z.boolean().default(false),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = projectSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const doc = await Project.findOneAndUpdate(
    { slug: parsed.data.slug },
    { $set: parsed.data },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json({ project: serializeProject(doc!) });
}
