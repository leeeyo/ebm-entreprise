import type { SeedProject } from "./types";

/**
 * Rich text for the 8 résidence projects. Covers stay as the existing
 * `/residences/...` assets (applied via `getResidenceCover` in the seed
 * script); galleries are disabled. Order matches `src/content/projets.ts`.
 */
export const seedProjects: SeedProject[] = [
  {
    slug: "residence-amira",
    title: "Résidence Amira",
    shortDescription: "Référence résidentielle EBM — finitions soignées et rigueur technique.",
    body:
      "Projet résidentiel emblématique d'EBM Ben Mokhtar, la Résidence Amira illustre notre maîtrise du gros œuvre comme du second œuvre. Du terrassement aux finitions, chaque phase a été pilotée avec rigueur pour livrer un ouvrage durable, conforme aux normes et fidèle aux attentes des occupants.",
    city: "Grand Tunis",
    type: "Résidentiel",
    year: "2023",
    surface: "Programme multi-logements",
    featured: true,
    seoTitle: "Résidence Amira | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence Amira : programme résidentiel livré par EBM Ben Mokhtar, du gros œuvre aux finitions soignées.",
  },
  {
    slug: "residence-la-tulipe",
    title: "Résidence la Tulipe",
    shortDescription: "Projet clé en main avec suivi de chantier transparent.",
    body:
      "La Résidence la Tulipe a été menée en clé en main, avec un suivi de chantier transparent du devis à la livraison. Coordination des corps d'état, contrôle qualité et respect des délais ont guidé l'exécution de ce programme résidentiel.",
    city: "Grand Tunis",
    type: "Résidentiel",
    year: "2022",
    surface: "Programme multi-logements",
    featured: true,
    seoTitle: "Résidence la Tulipe | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence la Tulipe : projet résidentiel clé en main livré par EBM Ben Mokhtar avec suivi de chantier transparent.",
  },
  {
    slug: "residence-ennakhil",
    title: "Résidence Ennakhil",
    shortDescription: "Construction résidentielle alignée sur les normes et délais.",
    body:
      "La Résidence Ennakhil témoigne de notre capacité à conduire un programme résidentiel dans le respect des normes et des délais. Structure béton armé, lots techniques et finitions ont été coordonnés sur un planning maîtrisé.",
    city: "Grand Tunis",
    type: "Résidentiel",
    year: "2022",
    surface: "Programme multi-logements",
    featured: true,
    seoTitle: "Résidence Ennakhil | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence Ennakhil : construction résidentielle conforme aux normes et aux délais par EBM Ben Mokhtar.",
  },
  {
    slug: "residence-el-menyar",
    title: "Résidence El Menyar",
    shortDescription: "Ouvrages résidentiels avec coordination gros œuvre / second œuvre.",
    body:
      "La Résidence El Menyar illustre la coordination entre gros œuvre et second œuvre qui fait la signature d'EBM. Un pilotage serré des interfaces a permis une exécution fluide et une livraison maîtrisée.",
    city: "Grand Tunis",
    type: "Résidentiel",
    surface: "Programme résidentiel",
    featured: false,
    seoTitle: "Résidence El Menyar | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence El Menyar : ouvrage résidentiel coordonné gros œuvre / second œuvre par EBM Ben Mokhtar.",
  },
  {
    slug: "residence-el-amen",
    title: "Résidence el Amen",
    shortDescription: "Livraison maîtrisée et qualité de mise en œuvre.",
    body:
      "La Résidence el Amen met en avant la qualité de mise en œuvre et la maîtrise de la livraison. Contrôles de conformité et soin des finitions ont accompagné chaque étape du chantier.",
    city: "Riadh el Andalous, Ariana",
    type: "Résidentiel",
    surface: "Programme résidentiel",
    featured: false,
    seoTitle: "Résidence el Amen | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence el Amen : qualité de mise en œuvre et livraison maîtrisée par EBM Ben Mokhtar à Ariana.",
  },
  {
    slug: "residence-el-ons",
    title: "Résidence el ons",
    shortDescription: "Réalisation résidentielle EBM sur mesure.",
    body:
      "La Résidence el ons est une réalisation résidentielle conduite sur mesure, en cohérence avec les attentes du programme. Du gros œuvre aux finitions, l'exécution a été menée avec la rigueur habituelle d'EBM.",
    city: "Grand Tunis",
    type: "Résidentiel",
    surface: "Programme résidentiel",
    featured: false,
    seoTitle: "Résidence el ons | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence el ons : réalisation résidentielle sur mesure par EBM Ben Mokhtar.",
  },
  {
    slug: "residence-el-khalil",
    title: "Résidence el khalil",
    shortDescription: "Projet de référence pour la construction résidentielle en Tunisie.",
    body:
      "La Résidence el khalil constitue un projet de référence pour la construction résidentielle en Tunisie. Méthode, contrôle qualité et coordination des corps d'état ont permis de livrer un ouvrage durable.",
    city: "Grand Tunis",
    type: "Résidentiel",
    surface: "Programme résidentiel",
    featured: false,
    seoTitle: "Résidence el khalil | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence el khalil : projet de référence en construction résidentielle par EBM Ben Mokhtar.",
  },
  {
    slug: "residence-les-orangers",
    title: "Résidence Les Orangers",
    shortDescription:
      "Complexe résidentiel à Mrezga (Nabeul) — livraison et finitions maîtrisées par EBM.",
    body:
      "Implanté à Mrezga (Nabeul), le complexe des Orangers a été livré avec des finitions maîtrisées et une coordination soignée. Ce projet illustre la capacité d'EBM à intervenir au-delà du Grand Tunis, avec la même exigence technique.",
    city: "Mrezga, Nabeul",
    type: "Résidentiel",
    surface: "Complexe résidentiel",
    featured: true,
    seoTitle: "Résidence Les Orangers, Mrezga | Réalisation EBM Ben Mokhtar",
    seoDescription:
      "Résidence Les Orangers à Mrezga (Nabeul) : complexe résidentiel livré par EBM Ben Mokhtar.",
  },
];
