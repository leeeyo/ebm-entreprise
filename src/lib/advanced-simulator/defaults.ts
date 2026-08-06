import type {
  AdvancedDivision,
  AdvancedMarkups,
  AdvancedProjectInput,
  LocationZone,
} from "./types";

export const ADVANCED_DIVISIONS: AdvancedDivision[] = [
  {
    id: "structure",
    name: "Gros œuvre / structure",
    description: "Fondations, ossature, dalles et éléments porteurs.",
  },
  {
    id: "masonry",
    name: "Maçonnerie / béton",
    description: "Murs, chapes, enduits de base et reprises béton.",
  },
  {
    id: "electricity",
    name: "Électricité",
    description: "Courant fort, courant faible et mise aux normes.",
  },
  {
    id: "plumbing",
    name: "Plomberie / sanitaires",
    description: "Réseaux sanitaires, évacuations et équipements.",
  },
  {
    id: "fluids",
    name: "Chauffage, climatisation, fluides",
    description: "Climatisation, chauffage et réseaux techniques.",
  },
  {
    id: "joinery",
    name: "Menuiserie aluminium / bois",
    description: "Menuiseries extérieures, portes, placards et bois.",
  },
  {
    id: "insulation",
    name: "Étanchéité / isolation",
    description: "Toitures, terrasses, isolation et protections.",
  },
  {
    id: "finishes",
    name: "Peinture / décoratifs",
    description: "Revêtements, peinture, carrelage et finitions.",
  },
  {
    id: "outdoor",
    name: "Aménagements extérieurs",
    description: "Piscine, jardin, clôtures, terrasses et accès.",
  },
];

export const LOCATION_ZONE_LABELS: Record<LocationZone, string> = {
  grandTunis: "Grand Tunis",
  coastal: "Zones côtières",
  interior: "Intérieur du pays",
  south: "Sud tunisien",
};

export const LOCATION_OPTIONS: Array<{ label: string; zone: LocationZone }> = [
  { label: "Tunis", zone: "grandTunis" },
  { label: "Ariana", zone: "grandTunis" },
  { label: "La Marsa", zone: "grandTunis" },
  { label: "Sousse", zone: "coastal" },
  { label: "Monastir", zone: "coastal" },
  { label: "Hammamet", zone: "coastal" },
  { label: "Sfax", zone: "coastal" },
  { label: "Bizerte", zone: "coastal" },
  { label: "Kairouan", zone: "interior" },
  { label: "Béja", zone: "interior" },
  { label: "Gafsa", zone: "interior" },
  { label: "Djerba", zone: "south" },
  { label: "Gabès", zone: "south" },
  { label: "Tozeur", zone: "south" },
];

export const DEFAULT_ADVANCED_PROJECT: AdvancedProjectInput = {
  buildType: "r1",
  offer: "hautStanding",
  surfaceM2: 220,
  location: "Tunis",
  zone: "grandTunis",
  terrain: "oui",
  terrainTopography: "flat",
  rooms: {
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
  },
  options: {
    pool: false,
    basement: false,
    garden: false,
  },
  optionSurfaces: {
    poolM2: 32,
    basementM2: 60,
    gardenM2: 80,
  },
};

export const DEFAULT_ADVANCED_MARKUPS: AdvancedMarkups = {
  overhead: 0.08,
  profit: 0.1,
  contingency: 0.07,
  tax: 0,
};
