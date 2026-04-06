import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { genericServicePages } from "@/content/service-pages";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const data = genericServicePages[key];
  if (!data) {
    return { title: "Page introuvable" };
  }
  return {
    title: `${data.title} — EBM Ben Mokhtar`,
    description: data.intro,
  };
}

export default async function ServiceCatchAllPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.join("/");
  if (!genericServicePages[key]) {
    notFound();
  }
  return <GenericMarketingPage pageKey={key} />;
}
