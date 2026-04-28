import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import {
  calculateAdvancedEstimateTotals,
  createDefaultLineItems,
  SIMULATOR_PRICING_VERSION,
} from "@/lib/advanced-simulator/pricing";
import { normalizeSimulatorSettingsSnapshot } from "@/lib/simulator-settings-defaults";
import { Lead } from "@/models/Lead";
import { SimulatorSettings } from "@/models/SimulatorSettings";
import { sendLeadNotificationEmail } from "@/lib/mail";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  simulation: z.object({
    kind: z.string().optional(),
    notes: z.string().optional(),
    project: z.object({
      style: z.enum(["moderne", "mediterraneenne"]),
      buildType: z.enum(["plainPied", "r1", "r2"]),
      offer: z.enum(["grosOeuvre", "premium", "luxe"]),
      surfaceM2: z.number().min(80).max(1000),
      location: z.string().min(1),
      zone: z.enum(["grandTunis", "coastal", "interior", "south"]),
      terrain: z.enum(["oui", "cours"]),
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

function settingsToSnapshot(doc: InstanceType<typeof SimulatorSettings>) {
  return normalizeSimulatorSettingsSnapshot({
    baseTndPerM2: doc.baseTndPerM2,
    offerMultipliers: {
      grosOeuvre: doc.offerMultipliers?.grosOeuvre,
      premium: doc.offerMultipliers?.premium,
      luxe: doc.offerMultipliers?.luxe,
    },
    typeMultipliers: {
      plainPied: doc.typeMultipliers?.plainPied,
      r1: doc.typeMultipliers?.r1,
      r2: doc.typeMultipliers?.r2,
    },
    optionAdds: {
      pool: doc.optionAdds?.pool,
      basement: doc.optionAdds?.basement,
      garden: doc.optionAdds?.garden,
    },
    styleMultipliers: {
      moderne: doc.styleMultipliers?.moderne,
      mediterraneenne: doc.styleMultipliers?.mediterraneenne,
    },
    advancedMarkups: {
      overhead: doc.advancedMarkups?.overhead,
      profit: doc.advancedMarkups?.profit,
      contingency: doc.advancedMarkups?.contingency,
      tax: doc.advancedMarkups?.tax,
    },
    locationMultipliers: {
      grandTunis: doc.locationMultipliers?.grandTunis,
      coastal: doc.locationMultipliers?.coastal,
      interior: doc.locationMultipliers?.interior,
      south: doc.locationMultipliers?.south,
    },
    optionUnitPrices: {
      poolTndPerM2: doc.optionUnitPrices?.poolTndPerM2,
      basementTndPerM2: doc.optionUnitPrices?.basementTndPerM2,
      gardenTndPerM2: doc.optionUnitPrices?.gardenTndPerM2,
    },
    decompositionItems: doc.decompositionItems,
  });
}

function getPricingVersion(doc: InstanceType<typeof SimulatorSettings>) {
  const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt : new Date();
  return `${SIMULATOR_PRICING_VERSION}@${updatedAt.toISOString()}`;
}

export async function POST(req: Request) {
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
    const settingsSnapshot = settingsToSnapshot(settingsDoc);
    const project = parsed.data.simulation.project;
    const lineItems = createDefaultLineItems(project, settingsSnapshot);
    const totals = calculateAdvancedEstimateTotals(lineItems, settingsSnapshot.advancedMarkups);
    const estimateTnd = Math.round(totals.total);
    const pricingVersion = getPricingVersion(settingsDoc);
    const lead = await Lead.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
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

    const notifyTo = process.env.SMTP_USER ?? process.env.ADMIN_EMAIL;
    if (notifyTo) {
      await sendLeadNotificationEmail({
        to: notifyTo,
        leadName: parsed.data.name,
        leadEmail: parsed.data.email,
        leadPhone: parsed.data.phone,
        estimateTnd,
      });
    }

    return NextResponse.json({ id: lead._id.toString(), estimateTnd, simulation: lead.simulation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
