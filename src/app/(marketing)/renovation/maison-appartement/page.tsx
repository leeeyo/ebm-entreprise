import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { getPublishedServicePage } from "@/lib/cms-content";
import { buildSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedServicePage("renovation/maison-appartement");
  return buildSeoMetadata({
    title: page?.seoTitle ?? page?.title ?? "Rénovation maison et appartement",
    description: page?.seoDescription ?? page?.intro ?? "Rénovation et restructuration avec une méthode EBM : qualité, délais et suivi.",
    path: "/renovation/maison-appartement",
    image: page?.heroImage?.src,
  });
}

export default async function RenovationMaisonPage() {
  const page = await getPublishedServicePage("renovation/maison-appartement");
  return <GenericMarketingPage pageKey="renovation/maison-appartement" page={page ?? undefined} />;
}
