import type { SimulatorDecompositionItem, SimulatorSettingsSnapshot } from "@/types/simulator";

export const DEFAULT_DECOMPOSITION_ITEMS: SimulatorDecompositionItem[] = [
  {
    id: "site-installation",
    enabled: true,
    divisionId: "structure",
    description: "Installation chantier, implantation et sécurité",
    unit: "forfait",
    costType: "equipment",
    quantityMode: "fixed",
    quantityValue: 1,
    unitCostTnd: 14500,
    offers: ["economique", "hautStanding", "prestige"],
  },
  {
    id: "foundations",
    enabled: true,
    divisionId: "structure",
    description: "Fondations, longrines et béton armé",
    unit: "m²",
    costType: "material",
    quantityMode: "surface",
    quantityValue: 1,
    unitCostTnd: 360,
    offers: ["economique", "hautStanding", "prestige"],
  },
  {
    id: "frame",
    enabled: true,
    divisionId: "structure",
    description: "Poteaux, poutres, dalles et escaliers",
    unit: "m²",
    costType: "labor",
    quantityMode: "surface",
    quantityValue: 1,
    unitCostTnd: 420,
    offers: ["economique", "hautStanding", "prestige"],
  },
  {
    id: "masonry-walls",
    enabled: true,
    divisionId: "masonry",
    description: "Maçonnerie, cloisons et enduits de base",
    unit: "m²",
    costType: "labor",
    quantityMode: "surfaceMultiplier",
    quantityValue: 1.35,
    unitCostTnd: 165,
    offers: ["economique", "hautStanding", "prestige"],
  },
  {
    id: "waterproofing",
    enabled: true,
    divisionId: "insulation",
    description: "Étanchéité toiture terrasse et isolation",
    unit: "m²",
    costType: "subcontractor",
    quantityMode: "surfaceMultiplier",
    quantityValue: 0.45,
    unitCostTnd: 95,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "electrical",
    enabled: true,
    divisionId: "electricity",
    description: "Tableaux, gaines, câblage et appareillage",
    unit: "m²",
    costType: "subcontractor",
    quantityMode: "surface",
    quantityValue: 1,
    unitCostTnd: 145,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "plumbing",
    enabled: true,
    divisionId: "plumbing",
    description: "Réseaux plomberie, évacuation et sanitaires",
    unit: "lot",
    costType: "subcontractor",
    quantityMode: "fixed",
    quantityValue: 1,
    unitCostTnd: 18500,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "hvac",
    enabled: true,
    divisionId: "fluids",
    description: "Climatisation, chauffage et réseaux fluides",
    unit: "m²",
    costType: "subcontractor",
    quantityMode: "surface",
    quantityValue: 1,
    unitCostTnd: 135,
    offers: ["prestige"],
  },
  {
    id: "aluminium",
    enabled: true,
    divisionId: "joinery",
    description: "Menuiserie aluminium, vitrage et portes",
    unit: "m²",
    costType: "material",
    quantityMode: "surfaceMultiplier",
    quantityValue: 0.28,
    unitCostTnd: 950,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "flooring",
    enabled: true,
    divisionId: "finishes",
    description: "Revêtements sols, faïence et plinthes",
    unit: "m²",
    costType: "material",
    quantityMode: "surface",
    quantityValue: 1,
    unitCostTnd: 175,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "paint",
    enabled: true,
    divisionId: "finishes",
    description: "Peinture intérieure, décoratifs et retouches",
    unit: "m²",
    costType: "labor",
    quantityMode: "surfaceMultiplier",
    quantityValue: 2.8,
    unitCostTnd: 32,
    offers: ["hautStanding", "prestige"],
  },
  {
    id: "outdoor-basic",
    enabled: true,
    divisionId: "outdoor",
    description: "Terrasse, accès, clôture et jardin de base",
    unit: "forfait",
    costType: "subcontractor",
    quantityMode: "fixed",
    quantityValue: 1,
    unitCostTnd: 12000,
    offers: ["hautStanding", "prestige"],
  },
];

export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettingsSnapshot = {
  baseTndPerM2: 1800,
  offerMultipliers: {
    economique: 1,
    hautStanding: 1.25,
    prestige: 1.5,
  },
  typeMultipliers: {
    plainPied: 1,
    r1: 1.08,
    r2: 1.15,
  },
  optionAdds: {
    pool: 0.08,
    basement: 0.12,
    garden: 0.05,
  },
  topographyMultipliers: {
    flat: 1,
    slightSlope: 1.05,
    steepSlope: 1.12,
  },
  advancedMarkups: {
    overhead: 0.08,
    profit: 0.1,
    contingency: 0.07,
    tax: 0,
  },
  locationMultipliers: {
    grandTunis: 1.08,
    coastal: 1.04,
    interior: 0.96,
    south: 0.98,
  },
  optionUnitPrices: {
    poolTndPerM2: 1450,
    basementTndPerM2: 1250,
    gardenTndPerM2: 220,
  },
  roomUnitPrices: {
    bedroomTndPerUnit: 2200,
    bathroomTndPerUnit: 6500,
    kitchenTndPerUnit: 9000,
  },
  decompositionItems: DEFAULT_DECOMPOSITION_ITEMS,
};

type SimulatorSettingsSnapshotInput = {
  [K in keyof Omit<SimulatorSettingsSnapshot, "decompositionItems">]?: SimulatorSettingsSnapshot[K] extends Record<
    string,
    number
  >
    ? Partial<SimulatorSettingsSnapshot[K]>
    : SimulatorSettingsSnapshot[K];
} & {
  decompositionItems?: unknown;
};

export function normalizeSimulatorSettingsSnapshot(
  value: SimulatorSettingsSnapshotInput,
): SimulatorSettingsSnapshot {
  return {
    baseTndPerM2: value.baseTndPerM2 ?? DEFAULT_SIMULATOR_SETTINGS.baseTndPerM2,
    offerMultipliers: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.offerMultipliers,
      value.offerMultipliers,
    ),
    typeMultipliers: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.typeMultipliers,
      value.typeMultipliers,
    ),
    optionAdds: mergeNumberDefaults(DEFAULT_SIMULATOR_SETTINGS.optionAdds, value.optionAdds),
    topographyMultipliers: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.topographyMultipliers,
      value.topographyMultipliers,
    ),
    advancedMarkups: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.advancedMarkups,
      value.advancedMarkups,
    ),
    locationMultipliers: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.locationMultipliers,
      value.locationMultipliers,
    ),
    optionUnitPrices: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.optionUnitPrices,
      value.optionUnitPrices,
    ),
    roomUnitPrices: mergeNumberDefaults(
      DEFAULT_SIMULATOR_SETTINGS.roomUnitPrices,
      value.roomUnitPrices,
    ),
    decompositionItems: normalizeDecompositionItems(value.decompositionItems),
  };
}

function normalizeDecompositionItems(value: unknown): SimulatorDecompositionItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_DECOMPOSITION_ITEMS;
  }

  return value.filter(isRecord).map((item, index) => ({
    id: typeof item.id === "string" && item.id ? item.id : `item-${index}`,
    enabled: typeof item.enabled === "boolean" ? item.enabled : true,
    divisionId: typeof item.divisionId === "string" ? item.divisionId : "structure",
    description: typeof item.description === "string" ? item.description : "Poste de travaux",
    unit: isValidUnit(item.unit) ? item.unit : "m²",
    costType: isValidCostType(item.costType) ? item.costType : "material",
    quantityMode: isValidQuantityMode(item.quantityMode) ? item.quantityMode : "surface",
    quantityValue: finiteOrDefault(item.quantityValue, 1),
    unitCostTnd: finiteOrDefault(item.unitCostTnd, 0),
    offers: normalizeOffers(item.offers),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function finiteOrDefault(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isValidUnit(value: unknown): value is SimulatorDecompositionItem["unit"] {
  return ["m²", "ml", "m³", "u", "jour", "forfait", "lot"].includes(String(value));
}

function isValidCostType(value: unknown): value is SimulatorDecompositionItem["costType"] {
  return ["material", "labor", "equipment", "subcontractor"].includes(String(value));
}

function isValidQuantityMode(value: unknown): value is SimulatorDecompositionItem["quantityMode"] {
  return ["fixed", "surface", "surfaceMultiplier"].includes(String(value));
}

const OFFER_KEYS: SimulatorDecompositionItem["offers"] = ["economique", "hautStanding", "prestige"];

function normalizeOffers(value: unknown): SimulatorDecompositionItem["offers"] {
  const fallback: SimulatorDecompositionItem["offers"] = OFFER_KEYS;
  if (!Array.isArray(value)) return fallback;
  const offers = value
    .filter((offer): offer is SimulatorDecompositionItem["offers"][number] =>
      OFFER_KEYS.includes(offer as SimulatorDecompositionItem["offers"][number]),
    );
  const unique = Array.from(new Set(offers));
  return unique.length > 0 ? unique : fallback;
}

function mergeNumberDefaults<T extends Record<string, number>>(
  defaults: T,
  value: Partial<Record<keyof T, number>> | undefined,
): { [K in keyof T]: number } {
  const result: { [K in keyof T]: number } = { ...defaults };

  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const nextValue = value?.[key];
    if (typeof nextValue === "number" && Number.isFinite(nextValue)) {
      result[key] = nextValue;
    }
  }

  return result;
}
