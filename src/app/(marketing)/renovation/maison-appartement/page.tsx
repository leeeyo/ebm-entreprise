import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { getPublishedServicePage } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "Rénovation maison et appartement",
  description: "Rénovation et restructuration avec une méthode EBM : qualité, délais et suivi.",
};

export default async function RenovationMaisonPage() {
  const page = await getPublishedServicePage("renovation/maison-appartement");
  return <GenericMarketingPage pageKey="renovation/maison-appartement" page={page ?? undefined} />;
}
