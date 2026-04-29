import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { genericServicePages } from "@/content/service-pages";
import { getPublishedServicePage } from "@/lib/cms-content";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const data = (await getPublishedServicePage(key)) ?? genericServicePages[key];
  if (!data) {
    return { title: "Page introuvable" };
  }
  return {
    title: "seoTitle" in data && data.seoTitle ? data.seoTitle : `${data.title} — EBM Ben Mokhtar`,
    description: "seoDescription" in data && data.seoDescription ? data.seoDescription : data.intro,
  };
}

export default async function ServiceCatchAllPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.join("/");
  const page = await getPublishedServicePage(key);
  if (!page && !genericServicePages[key]) {
    notFound();
  }
  return <GenericMarketingPage pageKey={key} page={page ?? undefined} />;
}
