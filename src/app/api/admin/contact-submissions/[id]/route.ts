import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { serializeContactSubmission } from "@/lib/cms-content";
import { CONTACT_SUBMISSION_STATUSES, ContactSubmission } from "@/models/ContactSubmission";

const patchSchema = z.object({
  status: z.enum(CONTACT_SUBMISSION_STATUSES).optional(),
  assignedTo: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { id } = await params;
  await connectDB();
  const doc = await ContactSubmission.findByIdAndUpdate(id, { $set: parsed.data }, { returnDocument: "after" });
  if (!doc) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  return NextResponse.json({ submission: serializeContactSubmission(doc) });
}
