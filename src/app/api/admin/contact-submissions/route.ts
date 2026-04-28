import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listContactSubmissions } from "@/lib/cms-content";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const submissions = await listContactSubmissions();
  return NextResponse.json({ submissions });
}
