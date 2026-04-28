import type { ArchitecturalStyle, BuildType, OfferTier } from "@/lib/simulator-pricing";

export type AdvancedCostType = "material" | "labor" | "equipment" | "subcontractor";

export type AdvancedUnit = "m²" | "ml" | "m³" | "u" | "jour" | "forfait" | "lot";

export type LocationZone = "grandTunis" | "coastal" | "interior" | "south";

export type AdvancedProjectInput = {
  style: ArchitecturalStyle;
  buildType: BuildType;
  offer: OfferTier;
  surfaceM2: number;
  location: string;
  zone: LocationZone;
  terrain: "oui" | "cours";
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

export type AdvancedLineItemTemplate = {
  id: string;
  divisionId: string;
  description: string;
  unit: AdvancedUnit;
  costType: AdvancedCostType;
  budgetShare: number;
  quantity: (surfaceM2: number) => number;
  offers: OfferTier[];
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
