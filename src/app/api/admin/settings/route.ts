import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { SimulatorSettings } from "@/models/SimulatorSettings";

const patchSchema = z.object({
  baseTndPerM2: z.number().positive().optional(),
  offerMultipliers: z
    .object({
      grosOeuvre: z.number().positive(),
      premium: z.number().positive(),
      luxe: z.number().positive(),
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
  return NextResponse.json({
    baseTndPerM2: doc.baseTndPerM2,
    offerMultipliers: doc.offerMultipliers,
    typeMultipliers: doc.typeMultipliers,
    optionAdds: doc.optionAdds,
  });
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
  return NextResponse.json({
    baseTndPerM2: doc!.baseTndPerM2,
    offerMultipliers: doc!.offerMultipliers,
    typeMultipliers: doc!.typeMultipliers,
    optionAdds: doc!.optionAdds,
  });
}
