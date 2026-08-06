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
    consent: z.boolean().optional(),
  })
  .optional();

const contactSchema = z
  .object({
    name: z.string().trim().min(2),
    email: z.union([z.string().trim().email(), z.literal("")]).default(""),
    phone: z
      .union([
        z.string().trim().regex(/^\d{2} \d{3} \d{3}$/, "Le téléphone doit respecter le format xx xxx xxx."),
        z.literal(""),
      ])
      .default(""),
    subject: z.string().trim().max(160).default(""),
    serviceInterest: z.string().trim().optional(),
    message: z.string().trim().min(3),
    sourcePage: z.string().trim().default("/contact"),
    website: z.string().trim().max(0).optional(),
    meta: metaContextSchema,
  })
  .superRefine((value, ctx) => {
    if (!value.email && !value.phone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Indiquez un e-mail ou un numéro de téléphone.",
      });
    }
  });

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const contactRateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip");
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const current = contactRateLimits.get(clientKey);
  if (!current || current.resetAt <= now) {
    contactRateLimits.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  current.count += 1;
  return false;
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
    const clientIp = getClientIp(req) ?? "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Trop de demandes. Veuillez réessayer dans quelques minutes." },
        { status: 429 },
      );
    }
    const contentType = req.headers.get("content-type") ?? "";
    const isJsonRequest = contentType.includes("application/json");
    const payload = isJsonRequest
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    await connectDB();
    const { meta, website: _website, ...submissionData } = parsed.data;
    void _website;
    const resolvedSubmissionData = {
      ...submissionData,
      subject: submissionData.subject || `Demande - ${submissionData.serviceInterest || "Contact"}`,
    };
    const submission = await ContactSubmission.create(resolvedSubmissionData);
    const submissionId = submission._id.toString();
    const { firstName, lastName } = splitFullName(resolvedSubmissionData.name);

    if (meta?.consent === true) {
      void sendMetaCapiContact({
        eventId: submissionId,
        eventTimeSec: Math.floor(Date.now() / 1000),
        eventSourceUrl: resolveMetaEventSourceUrl(meta?.eventSourceUrl, resolvedSubmissionData.sourcePage),
        contentId: "contact:form",
        contentName: "Demande contact EBM",
        contentCategory: "contact",
        customData: {
          lead_source: "contact_form",
          contact_submission_id: submissionId,
          service_interest: resolvedSubmissionData.serviceInterest,
          source_page: resolvedSubmissionData.sourcePage,
        },
        email: resolvedSubmissionData.email,
        phone: resolvedSubmissionData.phone,
        firstName,
        lastName,
        country: "tn",
        clientIp,
        userAgent: req.headers.get("user-agent"),
        fbp: meta?.fbp,
        fbc: meta?.fbc,
      }).catch((error) => {
        console.error("[meta-capi] contact dispatch failed:", error);
      });
    }

    if (!isJsonRequest) {
      return NextResponse.redirect(new URL("/contact?envoye=1", req.url), 303);
    }
    return NextResponse.json({ id: submissionId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
