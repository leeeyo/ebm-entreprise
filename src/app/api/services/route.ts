import { NextResponse } from "next/server";
import { listServicePages } from "@/lib/cms-content";

export async function GET() {
  const services = (await listServicePages()).filter((service) => service.status === "published");
  return NextResponse.json({ services });
}
