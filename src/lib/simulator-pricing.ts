import type { SimulatorSettingsSnapshot } from "@/types/simulator";

export type ArchitecturalStyle = "moderne" | "mediterraneenne";
export type BuildType = "plainPied" | "r1" | "r2";
export type OfferTier = "grosOeuvre" | "premium" | "luxe";

export type SimulationInput = {
  surfaceM2: number;
  style: ArchitecturalStyle;
  buildType: BuildType;
  offer: OfferTier;
  options: {
    pool: boolean;
    basement: boolean;
    garden: boolean;
  };
};

export function computeEstimateTnd(input: SimulationInput, settings: SimulatorSettingsSnapshot): number {
  const base = settings.baseTndPerM2 * input.surfaceM2;
  const typeKey =
    input.buildType === "plainPied"
      ? "plainPied"
      : input.buildType === "r1"
        ? "r1"
        : "r2";
  const typeMul = settings.typeMultipliers[typeKey] ?? 1;
  const offerKey =
    input.offer === "grosOeuvre"
      ? "grosOeuvre"
      : input.offer === "premium"
        ? "premium"
        : "luxe";
  const offerMul = settings.offerMultipliers[offerKey] ?? 1;
  const styleMul = input.style === "mediterraneenne" ? 1.03 : 1;

  let factor = 1;
  if (input.options.pool) factor += settings.optionAdds.pool;
  if (input.options.basement) factor += settings.optionAdds.basement;
  if (input.options.garden) factor += settings.optionAdds.garden;

  return Math.round(base * typeMul * offerMul * styleMul * factor);
}
