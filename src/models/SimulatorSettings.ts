import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const SimulatorSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    baseTndPerM2: { type: Number, default: 1800 },
    offerMultipliers: {
      grosOeuvre: { type: Number, default: 1 },
      premium: { type: Number, default: 1.25 },
      luxe: { type: Number, default: 1.5 },
    },
    typeMultipliers: {
      plainPied: { type: Number, default: 1 },
      r1: { type: Number, default: 1.08 },
      r2: { type: Number, default: 1.15 },
    },
    optionAdds: {
      pool: { type: Number, default: 0.08 },
      basement: { type: Number, default: 0.12 },
      garden: { type: Number, default: 0.05 },
    },
  },
  { timestamps: true },
);

export type SimulatorSettingsDoc = InferSchemaType<typeof SimulatorSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SimulatorSettings =
  models.SimulatorSettings ?? model("SimulatorSettings", SimulatorSettingsSchema);
