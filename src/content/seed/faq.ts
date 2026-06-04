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
      "En général entre 8 et 12 mois selon le programme, la surface et le niveau de finition. EBM établit un planning par phase pour garder une lecture claire du chantier.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["délai construction villa", "planning chantier"],
  },
  {
    question: "EBM prend-elle en charge tous les corps d'état ?",
    answer:
      "Oui. Les lots fluides, électricité, menuiserie et finitions peuvent être coordonnés dans une logique clé en main, avec un interlocuteur unique.",
    category: "Services",
    targetPage: "/services",
    keywords: ["clé en main", "corps d'état", "coordination chantier"],
  },
  {
    question: "Peut-on suivre l'avancement de son chantier ?",
    answer:
      "Oui. Vous bénéficiez d'un suivi transparent avec des photos et des points d'avancement réguliers tout au long du chantier.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["suivi chantier", "transparence", "photos chantier"],
  },
  {
    question: "Intervenez-vous en dehors du Grand Tunis ?",
    answer:
      "Oui. EBM intervient sur différents projets en Tunisie, comme le complexe des Orangers à Mrezga (Nabeul), avec la même exigence technique.",
    category: "Général",
    targetPage: "/projets",
    keywords: ["zone d'intervention", "Nabeul", "Tunisie"],
  },
  {
    question: "Quelles garanties offrez-vous sur les matériaux ?",
    answer:
      "Nous utilisons des matériaux certifiés issus de fournisseurs reconnus et appliquons un contrôle qualité à chaque phase du chantier.",
    category: "Construction",
    targetPage: "/construction/villa",
    keywords: ["garanties", "matériaux certifiés", "qualité"],
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
