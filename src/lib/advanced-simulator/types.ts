import type { BuildType, OfferTier, TerrainTopography } from "@/lib/simulator-pricing";

export type AdvancedCostType = "material" | "labor" | "equipment" | "subcontractor";

export type AdvancedUnit = "m²" | "ml" | "m³" | "u" | "jour" | "forfait" | "lot";

export type LocationZone = "grandTunis" | "coastal" | "interior" | "south";

export type AdvancedProjectInput = {
  buildType: BuildType;
  offer: OfferTier;
  surfaceM2: number;
  location: string;
  zone: LocationZone;
  terrain: "oui" | "cours";
  terrainTopography: TerrainTopography;
  rooms: {
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
  };
  options: {
    pool: boolean;
    basement: boolean;
    garden: boolean;
  };
  optionSurfaces: {
    poolM2: number;
    basementM2: number;
    gardenM2: number;
  };
};

export type AdvancedDivision = {
  id: string;
  name: string;
  description: string;
};

export type AdvancedLineItem = {
  id: string;
  divisionId: string;
  description: string;
  quantity: number;
  unit: AdvancedUnit;
  unitCostTnd: number;
  costType: AdvancedCostType;
};

export type AdvancedMarkups = {
  overhead: number;
  profit: number;
  contingency: number;
  tax: number;
};

export type AdvancedEstimateTotals = {
  directCost: number;
  materialSubtotal: number;
  laborSubtotal: number;
  equipmentSubtotal: number;
  subcontractorSubtotal: number;
  overhead: number;
  profit: number;
  contingency: number;
  tax: number;
  total: number;
  lowRange: number;
  highRange: number;
  divisionSubtotals: Record<string, number>;
};
