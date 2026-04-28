import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^\d{2} \d{3} \d{3}$/, "Le téléphone doit respecter le format xx xxx xxx."),
  subject: z.string().trim().min(2),
  serviceInterest: z.string().trim().optional(),
  message: z.string().trim().min(3),
  sourcePage: z.string().trim().default("/contact"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    await connectDB();
    const submission = await ContactSubmission.create(parsed.data);
    return NextResponse.json({ id: submission._id.toString() }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
