import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { getPublishedServicePage } from "@/lib/cms-content";
import { buildSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedServicePage("renovation/salle-de-bain");
  return buildSeoMetadata({
    title: page?.seoTitle ?? page?.title ?? "Rénovation salle de bain",
    description: page?.seoDescription ?? page?.intro ?? "Rénovation salle de bain : étanchéité, réseaux et finitions.",
    path: "/renovation/salle-de-bain",
    image: page?.heroImage?.src,
  });
}

export default async function RenovationSalleDeBainPage() {
  const page = await getPublishedServicePage("renovation/salle-de-bain");
  return <GenericMarketingPage pageKey="renovation/salle-de-bain" page={page ?? undefined} />;
}
