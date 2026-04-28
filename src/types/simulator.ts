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
  offers: Array<"grosOeuvre" | "premium" | "luxe">;
};

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
  styleMultipliers: {
    moderne: number;
    mediterraneenne: number;
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
  decompositionItems: SimulatorDecompositionItem[];
};
