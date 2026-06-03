export type SimulatorDecompositionItem = {
  id: string;
  enabled: boolean;
  divisionId: string;
  description: string;
  unit: "m²" | "ml" | "m³" | "u" | "jour" | "forfait" | "lot";
  costType: "material" | "labor" | "equipment" | "subcontractor";
  quantityMode: "fixed" | "surface" | "surfaceMultiplier";
  quantityValue: number;
  unitCostTnd: number;
  offers: Array<"economique" | "hautStanding" | "prestige">;
};

/** Serializable snapshot for pricing (API + client). */
export type SimulatorSettingsSnapshot = {
  baseTndPerM2: number;
  offerMultipliers: {
    economique: number;
    hautStanding: number;
    prestige: number;
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
  topographyMultipliers: {
    flat: number;
    slightSlope: number;
    steepSlope: number;
  };
  advancedMarkups: {
    overhead: number;
    profit: number;
    contingency: number;
    tax: number;
  };
  locationMultipliers: {
    grandTunis: number;
    coastal: number;
    interior: number;
    south: number;
  };
  optionUnitPrices: {
    poolTndPerM2: number;
    basementTndPerM2: number;
    gardenTndPerM2: number;
  };
  roomUnitPrices: {
    bedroomTndPerUnit: number;
    bathroomTndPerUnit: number;
    kitchenTndPerUnit: number;
  };
  decompositionItems: SimulatorDecompositionItem[];
};
