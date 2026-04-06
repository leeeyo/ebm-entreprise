export const simulateurPage = {
  title: "Estimez le Budget de votre Projet en 2 Minutes.",
  subtitle:
    "Un outil d'aide à la décision basé sur les coûts réels du marché tunisien en 2026. Obtenez une première évaluation technique pour votre future construction.",
  reassurance: "Estimation gratuite, sans engagement et confidentielle.",
  steps: {
    design: "Style et structure",
    dimensions: "Structure et dimensions",
    offre: "Votre offre",
    equipements: "Équipements",
    resultat: "Estimation",
  },
};

export const styleCards = [
  {
    id: "moderne" as const,
    title: "Villa Moderne",
    description: "Lignes épurées et larges baies vitrées.",
  },
  {
    id: "mediterraneenne" as const,
    title: "Villa Méditerranéenne",
    description: "Charme intemporel et arcades.",
  },
] as const;

export const typeCards = [
  { id: "plainPied" as const, title: "Plain-pied" },
  { id: "r1" as const, title: "Étage R+1" },
  { id: "r2" as const, title: "Étage R+2" },
] as const;

export const offerCards = [
  {
    id: "grosOeuvre" as const,
    title: "Gros Œuvre Seul",
    description: "La structure brute avec la rigueur d'ingénierie Ben Mokhtar.",
  },
  {
    id: "premium" as const,
    title: "Clé en Main Premium",
    description: "Prêt à habiter : carrelage de premier choix, sanitaires et boiseries.",
  },
  {
    id: "luxe" as const,
    title: "Clé en Main Luxe",
    description: "Domotique, marbre, climatisation centrale et finitions d'exception.",
  },
] as const;

export const optionItems = [
  { id: "pool" as const, label: "Piscine à débordement" },
  { id: "basement" as const, label: "Sous-sol / Garage" },
  { id: "garden" as const, label: "Jardin paysager & Clôtures" },
] as const;

export const calculateCta = "Calculer l'estimation de mon projet";
