export interface ProjectInfo {
  name: string
  client: string
  estimator: string
  date: string
  bidDueDate: string
  address: string
}

export interface Division {
  id: string
  name: string
}

export type CostType = "material" | "labor" | "equipment" | "subcontractor"

export interface LineItem {
  id: string
  division: string
  description: string
  quantity: number
  unit: string
  unitCost: number
  costType: CostType
}

export interface Markups {
  overhead: number
  profit: number
  contingency: number
  bond: number
  salesTax: number
}

export interface EstimateData {
  project: ProjectInfo
  divisions: Division[]
  lineItems: LineItem[]
  markups: Markups
}

export interface AgentSettings {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export const UNITS = [
  "SF", "LF", "EA", "CY", "SY", "CF", "TN", "LB",
  "GAL", "HR", "DAY", "WK", "MO", "LS", "MBF", "MSF"
] as const

export const COST_TYPES: { value: CostType; label: string }[] = [
  { value: "material", label: "Material" },
  { value: "labor", label: "Labor" },
  { value: "equipment", label: "Equipment" },
  { value: "subcontractor", label: "Subcontractor" },
]
