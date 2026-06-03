import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SimulatorSettings, settingsDocToSnapshot } from "@/models/SimulatorSettings";

export async function GET() {
  try {
    await connectDB();
    let doc = await SimulatorSettings.findOne({ key: "default" });
    if (!doc) {
      doc = await SimulatorSettings.create({});
    }
    return NextResponse.json(settingsDocToSnapshot(doc));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Impossible de charger les paramètres." }, { status: 500 });
  }
}
