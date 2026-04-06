import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { sendLeadNotificationEmail } from "@/lib/mail";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  estimateTnd: z.number().optional(),
  simulation: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    await connectDB();
    const lead = await Lead.create(parsed.data);

    const notifyTo = process.env.SMTP_USER ?? process.env.ADMIN_EMAIL;
    if (notifyTo) {
      await sendLeadNotificationEmail({
        to: notifyTo,
        leadName: parsed.data.name,
        leadEmail: parsed.data.email,
        leadPhone: parsed.data.phone,
        estimateTnd: parsed.data.estimateTnd,
      });
    }

    return NextResponse.json({ id: lead._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
