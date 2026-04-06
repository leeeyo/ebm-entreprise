import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";

export const metadata: Metadata = {
  title: "Rénovation maison et appartement",
  description: "Rénovation et restructuration avec une méthode EBM : qualité, délais et suivi.",
};

export default function RenovationMaisonPage() {
  return <GenericMarketingPage pageKey="renovation/maison-appartement" />;
}
