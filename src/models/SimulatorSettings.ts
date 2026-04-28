import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";
import { DEFAULT_SIMULATOR_SETTINGS } from "../lib/simulator-settings-defaults";

const SimulatorSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    baseTndPerM2: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.baseTndPerM2 },
    offerMultipliers: {
      grosOeuvre: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.grosOeuvre },
      premium: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.premium },
      luxe: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.offerMultipliers.luxe },
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
    styleMultipliers: {
      moderne: { type: Number, default: DEFAULT_SIMULATOR_SETTINGS.styleMultipliers.moderne },
      mediterraneenne: {
        type: Number,
        default: DEFAULT_SIMULATOR_SETTINGS.styleMultipliers.mediterraneenne,
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
