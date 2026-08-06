import type { SeedFaqEntry } from "./types";

/**
 * Global FAQ collection (FaqEntry). Upserted by `question`. Available via
 * the admin back-office and `/api/faqs`.
 */
export const seedFaqEntries: SeedFaqEntry[] = [
  {
    question: "Quel est le prix de construction au m² en Tunisie ?",
    answer:
      "Le prix dépend de la surface, de la structure, du niveau de finition et de l'emplacement. Le simulateur EBM donne une première fourchette, puis l'équipe affine le devis.",
    category: "Simulateur",
    targetPage: "/simulateur",
    keywords: ["prix construction m² Tunisie", "devis villa", "estimation BTP"],
  },
  {
    question: "Le simulateur est-il gratuit et sans engagement ?",
    answer:
      "Oui. Le simulateur est gratuit, sans engagement et confidentiel. Il vous donne une estimation indicative en quelques minutes.",
    category: "Simulateur",
    targetPage: "/simulateur",
    keywords: ["simulateur gratuit", "estimation projet", "devis sans engagement"],
  },
  {
    question: "Combien de temps dure la construction d'une villa ?",
    answer:
      "La durée dépend du programme, de la surface, du terrain, des autorisations et des finitions. Un planning adapté est établi avec le devis.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["délai construction villa", "planning chantier"],
  },
  {
    question: "EBM peut-elle coordonner plusieurs corps d'état ?",
    answer:
      "Selon le périmètre convenu, les lots fluides, électricité, menuiserie et finitions peuvent être coordonnés dans une logique clé en main.",
    category: "Services",
    targetPage: "/services",
    keywords: ["clé en main", "corps d'état", "coordination chantier"],
  },
  {
    question: "Peut-on suivre l'avancement de son chantier ?",
    answer:
      "Les modalités de suivi, les points d'avancement et les documents partagés sont définis selon l'organisation de chaque projet.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["suivi chantier", "transparence", "photos chantier"],
  },
  {
    question: "Intervenez-vous en dehors du Grand Tunis ?",
    answer:
      "La zone d'intervention est confirmée après étude de la localisation, du type de travaux et des moyens nécessaires.",
    category: "Général",
    targetPage: "/projets",
    keywords: ["zone d'intervention", "Nabeul", "Tunisie"],
  },
  {
    question: "Quelles garanties offrez-vous sur les matériaux ?",
    answer:
      "Les matériaux, contrôles et garanties applicables sont précisés dans le devis et le contrat selon la nature des travaux.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["garanties", "matériaux", "qualité"],
  },
  {
    question: "Comment obtenir un devis ?",
    answer:
      "Lancez le simulateur pour une première estimation, puis contactez-nous : nous revenons vers vous avec une évaluation technique et un devis détaillé.",
    category: "Contact",
    targetPage: "/contact",
    keywords: ["devis", "contact", "estimation"],
  },
];
