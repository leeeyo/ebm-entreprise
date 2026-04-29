import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";
import { genericServicePages } from "@/content/service-pages";
import { getPublishedServicePage, type ServicePageRecord } from "@/lib/cms-content";

type Props = { params: Promise<{ slug: string[] }> };

type StaticServiceCopy = (typeof genericServicePages)[string];

function metadataForServicePage(data: ServicePageRecord | StaticServiceCopy): Pick<Metadata, "title" | "description"> {
  const seoTitle = "seoTitle" in data ? data.seoTitle : undefined;
  const seoDescription = "seoDescription" in data ? data.seoDescription : undefined;
  const title =
    typeof seoTitle === "string" && seoTitle.length > 0 ? seoTitle : `${data.title} — EBM Ben Mokhtar`;
  const description =
    typeof seoDescription === "string" && seoDescription.length > 0 ? seoDescription : data.intro;
  return { title, description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const data = (await getPublishedServicePage(key)) ?? genericServicePages[key];
  if (!data) {
    return { title: "Page introuvable" };
  }
  return metadataForServicePage(data);
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
