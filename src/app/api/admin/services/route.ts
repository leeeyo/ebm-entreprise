import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listServicePages, serializeServicePage } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { servicePayloadFromJson, servicePayloadToUpdate } from "@/lib/service-page-editor";
import { ServicePage } from "@/models/ServicePage";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const services = await listServicePages();
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = await req.json().then(servicePayloadFromJson).catch(() => null);
  if (!parsed) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await connectDB();
  const doc = await ServicePage.findOneAndUpdate(
    { slug: parsed.slug },
    {
      $set: servicePayloadToUpdate(parsed),
    },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json({ service: serializeServicePage(doc!) });
}
