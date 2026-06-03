import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { SimulatorSettings, settingsDocToSnapshot } from "@/models/SimulatorSettings";

const patchSchema = z.object({
  baseTndPerM2: z.number().positive().optional(),
  offerMultipliers: z
    .object({
      economique: z.number().positive(),
      hautStanding: z.number().positive(),
      prestige: z.number().positive(),
    })
    .optional(),
  typeMultipliers: z
    .object({
      plainPied: z.number().positive(),
      r1: z.number().positive(),
      r2: z.number().positive(),
    })
    .optional(),
  optionAdds: z
    .object({
      pool: z.number().min(0),
      basement: z.number().min(0),
      garden: z.number().min(0),
    })
    .optional(),
  topographyMultipliers: z
    .object({
      flat: z.number().positive(),
      slightSlope: z.number().positive(),
      steepSlope: z.number().positive(),
    })
    .optional(),
  advancedMarkups: z
    .object({
      overhead: z.number().min(0),
      profit: z.number().min(0),
      contingency: z.number().min(0),
      tax: z.number().min(0),
    })
    .optional(),
  locationMultipliers: z
    .object({
      grandTunis: z.number().positive(),
      coastal: z.number().positive(),
      interior: z.number().positive(),
      south: z.number().positive(),
    })
    .optional(),
  optionUnitPrices: z
    .object({
      poolTndPerM2: z.number().min(0),
      basementTndPerM2: z.number().min(0),
      gardenTndPerM2: z.number().min(0),
    })
    .optional(),
  roomUnitPrices: z
    .object({
      bedroomTndPerUnit: z.number().min(0),
      bathroomTndPerUnit: z.number().min(0),
      kitchenTndPerUnit: z.number().min(0),
    })
    .optional(),
  decompositionItems: z
    .array(
      z.object({
        id: z.string().min(1),
        enabled: z.boolean(),
        divisionId: z.string().min(1),
        description: z.string().min(1),
        unit: z.enum(["m²", "ml", "m³", "u", "jour", "forfait", "lot"]),
        costType: z.enum(["material", "labor", "equipment", "subcontractor"]),
        quantityMode: z.enum(["fixed", "surface", "surfaceMultiplier"]),
        quantityValue: z.number().min(0),
        unitCostTnd: z.number().min(0),
        offers: z.array(z.enum(["economique", "hautStanding", "prestige"])).min(1),
      }),
    )
    .optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  let doc = await SimulatorSettings.findOne({ key: "default" });
  if (!doc) {
    doc = await SimulatorSettings.create({});
  }
  return NextResponse.json(settingsDocToSnapshot(doc));
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const json = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  await connectDB();
  const doc = await SimulatorSettings.findOneAndUpdate(
    { key: "default" },
    { $set: parsed.data },
    { upsert: true, returnDocument: "after" },
  );
  return NextResponse.json(settingsDocToSnapshot(doc!));
}
