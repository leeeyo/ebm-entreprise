import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { sendMetaCapiContact } from "@/lib/meta-capi";
import { resolveMetaEventSourceUrl } from "@/lib/meta-event-source";
import { ContactSubmission } from "@/models/ContactSubmission";

const metaContextSchema = z
  .object({
    fbp: z.string().trim().max(256).optional(),
    fbc: z.string().trim().max(512).optional(),
    eventSourceUrl: z.string().trim().max(2048).optional(),
  })
  .optional();

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^\d{2} \d{3} \d{3}$/, "Le téléphone doit respecter le format xx xxx xxx."),
  subject: z.string().trim().min(2),
  serviceInterest: z.string().trim().optional(),
  message: z.string().trim().min(3),
  sourcePage: z.string().trim().default("/contact"),
  meta: metaContextSchema,
});

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip");
}

function splitFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

export async function POST(req: NextRequest) {
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
    const { meta, ...submissionData } = parsed.data;
    const submission = await ContactSubmission.create(submissionData);
    const submissionId = submission._id.toString();
    const { firstName, lastName } = splitFullName(submissionData.name);

    void sendMetaCapiContact({
      eventId: submissionId,
      eventTimeSec: Math.floor(Date.now() / 1000),
      eventSourceUrl: resolveMetaEventSourceUrl(meta?.eventSourceUrl, submissionData.sourcePage),
      contentId: "contact:form",
      contentName: "Demande contact EBM",
      contentCategory: "contact",
      customData: {
        lead_source: "contact_form",
        contact_submission_id: submissionId,
        service_interest: submissionData.serviceInterest,
        source_page: submissionData.sourcePage,
      },
      email: submissionData.email,
      phone: submissionData.phone,
      firstName,
      lastName,
      country: "tn",
      clientIp: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
      fbp: meta?.fbp,
      fbc: meta?.fbc,
    }).catch((error) => {
      console.error("[meta-capi] contact dispatch failed:", error);
    });

    return NextResponse.json({ id: submissionId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
