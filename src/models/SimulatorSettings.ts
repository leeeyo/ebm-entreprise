import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";
import {
  DEFAULT_SIMULATOR_SETTINGS,
  normalizeSimulatorSettingsSnapshot,
} from "../lib/simulator-settings-defaults";
import type { SimulatorSettingsSnapshot } from "../types/simulator";

const SimulatorSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    baseTndPerM2: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.baseTndPerM2 },
    offerMultipliers: {
      economique: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.economique },
      hautStanding: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.hautStanding },
      prestige: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.prestige },
    },
    typeMultipliers: {
      plainPied: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.typeMultipliers.plainPied },
      r1: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.typeMultipliers.r1 },
      r2: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.typeMultipliers.r2 },
    },
    optionAdds: {
      pool: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.optionAdds.pool },
      basement: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.optionAdds.basement },
      garden: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.optionAdds.garden },
    },
    topographyMultipliers: {
      flat: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.topographyMultipliers.flat },
      slightSlope: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.topographyMultipliers.slightSlope,
      },
      steepSlope: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.topographyMultipliers.steepSlope,
      },
    },
    advancedMarkups: {
      overhead: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.advancedMarkups.overhead },
      profit: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.advancedMarkups.profit },
      contingency: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.advancedMarkups.contingency },
      tax: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.advancedMarkups.tax },
    },
    locationMultipliers: {
      grandTunis: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.locationMultipliers.grandTunis },
      coastal: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.locationMultipliers.coastal },
      interior: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.locationMultipliers.interior },
      south: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.locationMultipliers.south },
    },
    optionUnitPrices: {
      poolTndPerM2: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.optionUnitPrices.poolTndPerM2 },
      basementTndPerM2: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.optionUnitPrices.basementTndPerM2,
      },
      gardenTndPerM2: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.optionUnitPrices.gardenTndPerM2 },
    },
    roomUnitPrices: {
      bedroomTndPerUnit: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.roomUnitPrices.bedroomTndPerUnit,
      },
      bathroomTndPerUnit: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.roomUnitPrices.bathroomTndPerUnit,
      },
      kitchenTndPerUnit: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.roomUnitPrices.kitchenTndPerUnit,
      },
    },
    decompositionItems: {
      type: [
        {
          id: { type: String, required: true },
          enabled: { type: Boolean, default: true },
          divisionId: { type: String, required: true },
          description: { type: String, required: true },
          unit: { type: String, required: true },
          costType: { type: String, required: true },
          quantityMode: { type: String, required: true },
          quantityValue: { type: Number, required: true },
          unitCostTnd: { type: Number, required: true },
          offers: [{ type: String, required: true }],
        },
      ],
      default: () => DEFAULT_SIMULATOR_SETTINGS.decompositionItems,
    },
  },
  { timestamps: true },
);

export type SimulatorSettingsDoc = InferSchemaType<typeof SimulatorSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SimulatorSettings =
  models.SimulatorSettings ?? model("SimulatorSettings", SimulatorSettingsSchema);

type NumberRecord = Record<string, number | undefined>;

function asNumberRecord(value: unknown): NumberRecord {
  return (value && typeof value === "object" ? value : {}) as NumberRecord;
}

/** Builds a serializable pricing snapshot from a settings document. */
export function settingsDocToSnapshot(
  doc: Pick<
    SimulatorSettingsDoc,
    | "baseTndPerM2"
    | "offerMultipliers"
    | "typeMultipliers"
    | "optionAdds"
    | "topographyMultipliers"
    | "advancedMarkups"
    | "locationMultipliers"
    | "optionUnitPrices"
    | "roomUnitPrices"
    | "decompositionItems"
  >,
): SimulatorSettingsSnapshot {
  const offer = asNumberRecord(doc.offerMultipliers);
  const type = asNumberRecord(doc.typeMultipliers);
  const optionAdds = asNumberRecord(doc.optionAdds);
  const topography = asNumberRecord(doc.topographyMultipliers);
  const markups = asNumberRecord(doc.advancedMarkups);
  const location = asNumberRecord(doc.locationMultipliers);
  const optionUnitPrices = asNumberRecord(doc.optionUnitPrices);
  const roomUnitPrices = asNumberRecord(doc.roomUnitPrices);

  return normalizeSimulatorSettingsSnapshot({
    baseTndPerM2: doc.baseTndPerM2,
    offerMultipliers: {
      economique: offer.economique,
      hautStanding: offer.hautStanding,
      prestige: offer.prestige,
    },
    typeMultipliers: {
      plainPied: type.plainPied,
      r1: type.r1,
      r2: type.r2,
    },
    optionAdds: {
      pool: optionAdds.pool,
      basement: optionAdds.basement,
      garden: optionAdds.garden,
    },
    topographyMultipliers: {
      flat: topography.flat,
      slightSlope: topography.slightSlope,
      steepSlope: topography.steepSlope,
    },
    advancedMarkups: {
      overhead: markups.overhead,
      profit: markups.profit,
      contingency: markups.contingency,
      tax: markups.tax,
    },
    locationMultipliers: {
      grandTunis: location.grandTunis,
      coastal: location.coastal,
      interior: location.interior,
      south: location.south,
    },
    optionUnitPrices: {
      poolTndPerM2: optionUnitPrices.poolTndPerM2,
      basementTndPerM2: optionUnitPrices.basementTndPerM2,
      gardenTndPerM2: optionUnitPrices.gardenTndPerM2,
    },
    roomUnitPrices: {
      bedroomTndPerUnit: roomUnitPrices.bedroomTndPerUnit,
      bathroomTndPerUnit: roomUnitPrices.bathroomTndPerUnit,
      kitchenTndPerUnit: roomUnitPrices.kitchenTndPerUnit,
    },
    decompositionItems: doc.decompositionItems,
  });
}
