import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { getPublishedServicePage } from "@/lib/cms-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedServicePage("renovation/salle-de-bain");
  return {
    title: page?.seoTitle ?? page?.title ?? "Rénovation salle de bain",
    description: page?.seoDescription ?? page?.intro ?? "Rénovation salle de bain : étanchéité, réseaux et finitions.",
  };
}

export default async function RenovationSalleDeBainPage() {
  const page = await getPublishedServicePage("renovation/salle-de-bain");
  return <GenericMarketingPage pageKey="renovation/salle-de-bain" page={page ?? undefined} />;
}
