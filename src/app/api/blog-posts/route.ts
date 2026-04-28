import { NextResponse } from "next/server";
import { listBlogPosts } from "@/lib/cms-content";

export async function GET() {
  const posts = await listBlogPosts({ publishedOnly: true });
  return NextResponse.json({ posts });
}
