export const simulateurPage = {
  title: "Estimez le budget de votre projet en 2 minutes.",
  subtitle:
    "Un outil d'aide à la décision qui fournit une première estimation indicative. Le montant final dépendra de l'étude technique et du devis.",
  reassurance: "Estimation gratuite, sans engagement et confidentielle.",
  steps: {
    projet: "Type et standing",
    terrain: "Terrain et dimensions",
    configuration: "Configuration sur mesure",
    equipements: "Équipements",
    resultat: "Estimation",
  },
};

export const typeCards = [
  { id: "plainPied" as const, title: "Plain-pied" },
  { id: "r1" as const, title: "R+1" },
  { id: "r2" as const, title: "R+2" },
] as const;

export const offerCards = [
  {
    id: "economique" as const,
    title: "Économique",
    description: "Finitions fonctionnelles et matériaux fiables pour maîtriser le budget.",
  },
  {
    id: "hautStanding" as const,
    title: "Haut standing",
    description: "Prestations soignées : carrelage de premier choix, sanitaires et boiseries de qualité.",
  },
  {
    id: "prestige" as const,
    title: "Prestige",
    description: "Le summum : marbre, domotique, climatisation centrale et finitions d'exception.",
  },
] as const;

export const topographyOptions = [
  {
    id: "flat" as const,
    title: "Plat",
    description: "Terrain de niveau, terrassement minimal.",
  },
  {
    id: "slightSlope" as const,
    title: "Pente légère",
    description: "Léger dénivelé nécessitant des reprises de niveau.",
  },
  {
    id: "steepSlope" as const,
    title: "Pente forte",
    description: "Fort dénivelé : fondations et soutènement renforcés.",
  },
] as const;

export const roomConfigFields = [
  {
    id: "bedrooms" as const,
    label: "Chambres",
    hint: "Nombre de chambres à coucher.",
    short: "ch.",
    min: 0,
    max: 12,
  },
  {
    id: "bathrooms" as const,
    label: "Salles de bain",
    hint: "Salles de bain et salles d'eau à équiper.",
    short: "s. de bain",
    min: 1,
    max: 10,
  },
  {
    id: "kitchens" as const,
    label: "Cuisines",
    hint: "Cuisines à raccorder et équiper.",
    short: "cuisine(s)",
    min: 1,
    max: 5,
  },
] as const;

/** Readable labels for the standing tier. */
export const offerDisplayLabels: Record<string, string> = {
  economique: "Économique",
  hautStanding: "Haut standing",
  prestige: "Prestige",
};

export const topographyDisplayLabels: Record<string, string> = {
  flat: "Terrain plat",
  slightSlope: "Pente légère",
  steepSlope: "Pente forte",
};

export const optionItems = [
  { id: "pool" as const, label: "Piscine à débordement" },
  { id: "basement" as const, label: "Sous-sol / Garage" },
  { id: "garden" as const, label: "Jardin paysager et clôtures" },
] as const;

export const calculateCta = "Calculer l'estimation de mon projet";
