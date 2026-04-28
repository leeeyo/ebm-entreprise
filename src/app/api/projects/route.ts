import { NextResponse } from "next/server";
import { listProjects } from "@/lib/cms-content";

export async function GET() {
  const projects = await listProjects({ publishedOnly: true });
  return NextResponse.json({ projects });
}
