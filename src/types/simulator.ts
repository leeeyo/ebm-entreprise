/** Serializable snapshot for pricing (API + client). */
export type SimulatorSettingsSnapshot = {
  baseTndPerM2: number;
  offerMultipliers: {
    grosOeuvre: number;
    premium: number;
    luxe: number;
  };
  typeMultipliers: {
    plainPied: number;
    r1: number;
    r2: number;
  };
  optionAdds: {
    pool: number;
    basement: number;
    garden: number;
  };
};
