import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { getPublishedServicePage } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "Rénovation salle de bain",
  description: "Rénovation salle de bain : étanchéité, réseaux et finitions.",
};

export default async function RenovationSalleDeBainPage() {
  const page = await getPublishedServicePage("renovation/salle-de-bain");
  return <GenericMarketingPage pageKey="renovation/salle-de-bain" page={page ?? undefined} />;
}
