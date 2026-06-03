import type { SimulatorSettingsSnapshot } from "@/types/simulator";
import { ADVANCED_DIVISIONS } from "./defaults";
import { DEFAULT_SIMULATOR_SETTINGS } from "@/lib/simulator-settings-defaults";
import type {
  AdvancedEstimateTotals,
  AdvancedLineItem,
  AdvancedMarkups,
  AdvancedProjectInput,
} from "./types";

export const SIMULATOR_PRICING_VERSION = "advanced-decomposition-v2";

export function formatTnd(value: number): string {
  return `${Math.round(value).toLocaleString("fr-TN")} TND`;
}

export function getProjectDirectBudget(
  project: AdvancedProjectInput,
  settings: SimulatorSettingsSnapshot,
): number {
  const base = settings.baseTndPerM2 * project.surfaceM2;
  const typeMultiplier = settings.typeMultipliers[project.buildType] ?? 1;
  const offerMultiplier = settings.offerMultipliers[project.offer] ?? 1;
  const topographyMultiplier = settings.topographyMultipliers[project.terrainTopography] ?? 1;
  const locationMultiplier = settings.locationMultipliers[project.zone] ?? 1;

  return base * typeMultiplier * offerMultiplier * topographyMultiplier * locationMultiplier;
}

export function createDefaultLineItems(
  project: AdvancedProjectInput,
  settings: SimulatorSettingsSnapshot,
): AdvancedLineItem[] {
  const adjustmentFactor = getProjectAdjustmentFactor(project, settings);

  const baseItems = settings.decompositionItems
    .filter((item) => item.enabled && item.offers.includes(project.offer))
    .map((item) => {
      const quantity = getConfiguredQuantity(item.quantityMode, item.quantityValue, project.surfaceM2);
      const unitCostTnd = Math.round(item.unitCostTnd * adjustmentFactor);

      return {
        id: item.id,
        divisionId: item.divisionId,
        description: item.description,
        quantity,
        unit: item.unit,
        unitCostTnd,
        costType: item.costType,
      };
    });

  return [
    ...baseItems,
    ...createRoomLineItems(project, settings),
    ...createOptionLineItems(project, settings),
  ];
}

function getProjectAdjustmentFactor(
  project: AdvancedProjectInput,
  settings: SimulatorSettingsSnapshot,
) {
  const baseScale = settings.baseTndPerM2 / DEFAULT_SIMULATOR_SETTINGS.baseTndPerM2;
  const typeMultiplier = settings.typeMultipliers[project.buildType] ?? 1;
  const offerMultiplier = settings.offerMultipliers[project.offer] ?? 1;
  const topographyMultiplier = settings.topographyMultipliers[project.terrainTopography] ?? 1;
  const locationMultiplier = settings.locationMultipliers[project.zone] ?? 1;

  return baseScale * typeMultiplier * offerMultiplier * topographyMultiplier * locationMultiplier;
}

function getConfiguredQuantity(
  mode: SimulatorSettingsSnapshot["decompositionItems"][number]["quantityMode"],
  value: number,
  surfaceM2: number,
) {
  if (mode === "fixed") return Math.max(1, value);
  if (mode === "surfaceMultiplier") return Math.max(1, Math.round(surfaceM2 * value));
  return Math.max(1, surfaceM2);
}

function createRoomLineItems(
  project: AdvancedProjectInput,
  settings: SimulatorSettingsSnapshot,
): AdvancedLineItem[] {
  const items: AdvancedLineItem[] = [];
  const rooms = project.rooms ?? { bedrooms: 0, bathrooms: 0, kitchens: 0 };
  const bedrooms = Math.max(0, Math.round(rooms.bedrooms ?? 0));
  const bathrooms = Math.max(0, Math.round(rooms.bathrooms ?? 0));
  const kitchens = Math.max(0, Math.round(rooms.kitchens ?? 0));

  if (bathrooms > 0) {
    items.push({
      id: "rooms-bathrooms",
      divisionId: "plumbing",
      description: "Salles de bain — plomberie, sanitaires et faïence",
      quantity: bathrooms,
      unit: "u",
      unitCostTnd: settings.roomUnitPrices.bathroomTndPerUnit,
      costType: "subcontractor",
    });
  }

  if (kitchens > 0) {
    items.push({
      id: "rooms-kitchens",
      divisionId: "plumbing",
      description: "Cuisines — alimentation, évacuation et raccordements",
      quantity: kitchens,
      unit: "u",
      unitCostTnd: settings.roomUnitPrices.kitchenTndPerUnit,
      costType: "subcontractor",
    });
  }

  if (bedrooms > 0) {
    items.push({
      id: "rooms-bedrooms",
      divisionId: "finishes",
      description: "Chambres — finitions et appareillage",
      quantity: bedrooms,
      unit: "u",
      unitCostTnd: settings.roomUnitPrices.bedroomTndPerUnit,
      costType: "material",
    });
  }

  return items;
}

function createOptionLineItems(
  project: AdvancedProjectInput,
  settings: SimulatorSettingsSnapshot,
): AdvancedLineItem[] {
  const items: AdvancedLineItem[] = [];

  if (project.options.pool) {
    items.push({
      id: "option-pool",
      divisionId: "outdoor",
      description: "Piscine avec équipements et local technique",
      quantity: Math.max(1, project.optionSurfaces.poolM2),
      unit: "m²",
      unitCostTnd: settings.optionUnitPrices.poolTndPerM2,
      costType: "subcontractor",
    });
  }

  if (project.options.basement) {
    items.push({
      id: "option-basement",
      divisionId: "structure",
      description: "Sous-sol / garage enterré, structure et étanchéité",
      quantity: Math.max(1, project.optionSurfaces.basementM2),
      unit: "m²",
      unitCostTnd: settings.optionUnitPrices.basementTndPerM2,
      costType: "subcontractor",
    });
  }

  if (project.options.garden) {
    items.push({
      id: "option-garden",
      divisionId: "outdoor",
      description: "Jardin paysager, clôtures et cheminements",
      quantity: Math.max(1, project.optionSurfaces.gardenM2),
      unit: "m²",
      unitCostTnd: settings.optionUnitPrices.gardenTndPerM2,
      costType: "subcontractor",
    });
  }

  return items;
}

export function getLineTotal(item: AdvancedLineItem): number {
  return item.quantity * item.unitCostTnd;
}

export function calculateAdvancedEstimateTotals(
  lineItems: AdvancedLineItem[],
  markups: AdvancedMarkups,
): AdvancedEstimateTotals {
  const directCost = lineItems.reduce((sum, item) => sum + getLineTotal(item), 0);
  const materialSubtotal = subtotalByCostType(lineItems, "material");
  const laborSubtotal = subtotalByCostType(lineItems, "labor");
  const equipmentSubtotal = subtotalByCostType(lineItems, "equipment");
  const subcontractorSubtotal = subtotalByCostType(lineItems, "subcontractor");
  const overhead = directCost * markups.overhead;
  const profit = directCost * markups.profit;
  const contingency = directCost * markups.contingency;
  const tax = materialSubtotal * markups.tax;
  const total = directCost + overhead + profit + contingency + tax;

  return {
    directCost,
    materialSubtotal,
    laborSubtotal,
    equipmentSubtotal,
    subcontractorSubtotal,
    overhead,
    profit,
    contingency,
    tax,
    total,
    lowRange: total * 0.92,
    highRange: total * 1.12,
    divisionSubtotals: getDivisionSubtotals(lineItems),
  };
}

function subtotalByCostType(lineItems: AdvancedLineItem[], costType: AdvancedLineItem["costType"]) {
  return lineItems
    .filter((item) => item.costType === costType)
    .reduce((sum, item) => sum + getLineTotal(item), 0);
}

function getDivisionSubtotals(lineItems: AdvancedLineItem[]) {
  return ADVANCED_DIVISIONS.reduce<Record<string, number>>((acc, division) => {
    acc[division.id] = lineItems
      .filter((item) => item.divisionId === division.id)
      .reduce((sum, item) => sum + getLineTotal(item), 0);
    return acc;
  }, {});
}
