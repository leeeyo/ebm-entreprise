import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";

export const metadata: Metadata = {
  title: "Rénovation salle de bain",
  description: "Rénovation salle de bain : étanchéité, réseaux et finitions.",
};

export default function RenovationSalleDeBainPage() {
  return <GenericMarketingPage pageKey="renovation/salle-de-bain" />;
}
