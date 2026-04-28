import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { normalizeSimulatorSettingsSnapshot } from "@/lib/simulator-settings-defaults";
import { SimulatorSettings } from "@/models/SimulatorSettings";

export async function GET() {
  try {
    await connectDB();
    let doc = await SimulatorSettings.findOne({ key: "default" });
    if (!doc) {
      doc = await SimulatorSettings.create({});
    }
    return NextResponse.json(
      normalizeSimulatorSettingsSnapshot({
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
      }),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Impossible de charger les paramètres." }, { status: 500 });
  }
}
