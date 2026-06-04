import { contactContent } from "@/content/contact";

/**
 * Full SiteSettings document (singleton `key: "default"`). Combines the
 * contact block with global SEO and footer copy.
 */
export const seedSiteSettings = {
  ...contactContent,
  footerMessage:
    "EBM Ben Mokhtar accompagne les projets de construction, rénovation et aménagement avec une exigence d'ingénierie, de qualité et de respect des délais.",
  seoTitle: "EBM Ben Mokhtar | Entreprise de construction et BTP en Tunisie",
  seoDescription:
    "Entreprise de construction, rénovation et génie civil en Tunisie. Construction de villas et de résidences clé en main. Estimez votre projet avec le simulateur EBM.",
  seoKeywords: [
    "construction bâtiment Tunisie",
    "entreprise BTP Ben Mokhtar",
    "génie civil",
    "prix construction m² Tunisie",
    "construction villa Tunisie",
    "rénovation Tunisie",
  ],
  reassuranceItems: [
    "Devis gratuit et sans engagement",
    "Données confidentielles",
    "Équipe chantier expérimentée",
    "Suivi de chantier transparent",
  ],
};
