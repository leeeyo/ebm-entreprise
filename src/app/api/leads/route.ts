import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import {
  calculateAdvancedEstimateTotals,
  createDefaultLineItems,
  SIMULATOR_PRICING_VERSION,
} from "@/lib/advanced-simulator/pricing";
import { sendMetaCapiLead } from "@/lib/meta-capi";
import { resolveMetaEventSourceUrl } from "@/lib/meta-event-source";
import { Lead } from "@/models/Lead";
import { SimulatorSettings, settingsDocToSnapshot } from "@/models/SimulatorSettings";
import { sendLeadNotificationEmail } from "@/lib/mail";

const metaContextSchema = z
  .object({
    fbp: z.string().trim().max(256).optional(),
    fbc: z.string().trim().max(512).optional(),
    eventSourceUrl: z.string().trim().max(2048).optional(),
  })
  .optional();

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  meta: metaContextSchema,
  simulation: z.object({
    kind: z.string().optional(),
    notes: z.string().optional(),
    project: z.object({
      buildType: z.enum(["plainPied", "r1", "r2"]),
      offer: z.enum(["economique", "hautStanding", "prestige"]),
      surfaceM2: z.number().min(80).max(1000),
      location: z.string().min(1),
      zone: z.enum(["grandTunis", "coastal", "interior", "south"]),
      terrain: z.enum(["oui", "cours"]),
      terrainTopography: z.enum(["flat", "slightSlope", "steepSlope"]),
      rooms: z.object({
        bedrooms: z.number().int().min(0).max(12),
        bathrooms: z.number().int().min(1).max(10),
        kitchens: z.number().int().min(1).max(5),
      }),
      options: z.object({
        pool: z.boolean(),
        basement: z.boolean(),
        garden: z.boolean(),
      }),
      optionSurfaces: z.object({
        poolM2: z.number().min(1),
        basementM2: z.number().min(1),
        gardenM2: z.number().min(1),
      }),
    }),
  }),
});

function getPricingVersion(doc: InstanceType<typeof SimulatorSettings>) {
  const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt : new Date();
  return `${SIMULATOR_PRICING_VERSION}@${updatedAt.toISOString()}`;
}

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
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    await connectDB();
    let settingsDoc = await SimulatorSettings.findOne({ key: "default" });
    if (!settingsDoc) {
      settingsDoc = await SimulatorSettings.create({});
    }
    const settingsSnapshot = settingsDocToSnapshot(settingsDoc);
    const project = parsed.data.simulation.project;
    const lineItems = createDefaultLineItems(project, settingsSnapshot);
    const totals = calculateAdvancedEstimateTotals(lineItems, settingsSnapshot.advancedMarkups);
    const estimateTnd = Math.round(totals.total);
    const pricingVersion = getPricingVersion(settingsDoc);
    const { meta, ...leadData } = parsed.data;
    const lead = await Lead.create({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      estimateTnd,
      pricingVersion,
      settingsSnapshot,
      simulation: {
        kind: "advanced-wizard",
        project,
        notes: parsed.data.simulation.notes ?? "",
        lineItems,
        markups: settingsSnapshot.advancedMarkups,
        totals,
        pricingVersion,
        settingsSnapshot,
      },
    });
    const leadId = lead._id.toString();
    const { firstName, lastName } = splitFullName(leadData.name);

    void sendMetaCapiLead({
      eventId: leadId,
      eventTimeSec: Math.floor(Date.now() / 1000),
      eventSourceUrl: resolveMetaEventSourceUrl(meta?.eventSourceUrl, "/simulateur"),
      value: estimateTnd,
      currency: "TND",
      contentId: "simulateur:devis",
      contentName: "Estimation simulateur EBM",
      contentCategory: "simulateur",
      customData: {
        lead_source: "simulator",
        lead_id: leadId,
        build_type: project.buildType,
        offer: project.offer,
        surface_m2: project.surfaceM2,
        location_zone: project.zone,
      },
      email: leadData.email,
      phone: leadData.phone,
      firstName,
      lastName,
      city: project.location,
      country: "tn",
      clientIp: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
      fbp: meta?.fbp,
      fbc: meta?.fbc,
    }).catch((error) => {
      console.error("[meta-capi] lead dispatch failed:", error);
    });

    const notifyTo = process.env.SMTP_USER ?? process.env.ADMIN_EMAIL;
    if (notifyTo) {
      await sendLeadNotificationEmail({
        to: notifyTo,
        leadName: leadData.name,
        leadEmail: leadData.email,
        leadPhone: leadData.phone,
        estimateTnd,
      });
    }

    return NextResponse.json({ id: leadId, estimateTnd, simulation: lead.simulation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
