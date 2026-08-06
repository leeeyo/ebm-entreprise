import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export const SEO_SITE_NAME = "EBM Ben Mokhtar";
export const DEFAULT_SEO_TITLE = "EBM Ben Mokhtar - Entreprise de construction Tunisie";
export const DEFAULT_SEO_DESCRIPTION =
  "Entreprise de construction et de rénovation en Tunisie. Découvrez les services, les réalisations et le simulateur de budget EBM Ben Mokhtar.";
export const DEFAULT_OG_IMAGE_PATH = "/residences/fallback-residence-amira.png";
export const DEFAULT_OG_IMAGE_ALT = "Résidence présentée par EBM Ben Mokhtar";

type SeoImageInput =
  | string
  | {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    };

type BuildSeoMetadataInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  image?: SeoImageInput | null;
  type?: "website" | "article";
};

export function absoluteSiteUrl(path = "/"): string {
  return new URL(path, getSiteOrigin()).toString();
}

function resolveImage(image?: SeoImageInput | null) {
  if (!image) {
    return {
      url: absoluteSiteUrl(DEFAULT_OG_IMAGE_PATH),
      alt: DEFAULT_OG_IMAGE_ALT,
      width: 1200,
      height: 630,
    };
  }

  if (typeof image === "string") {
    return {
      url: absoluteSiteUrl(image),
      alt: DEFAULT_OG_IMAGE_ALT,
      width: 1200,
      height: 630,
    };
  }

  return {
    url: absoluteSiteUrl(image.url),
    alt: image.alt ?? DEFAULT_OG_IMAGE_ALT,
    width: image.width ?? 1200,
    height: image.height ?? 630,
  };
}

export function buildSeoMetadata(input: BuildSeoMetadataInput = {}): Metadata {
  const rawTitle = input.title?.trim() || DEFAULT_SEO_TITLE;
  const title = rawTitle.toLocaleLowerCase("fr").includes(SEO_SITE_NAME.toLocaleLowerCase("fr"))
    ? rawTitle
    : /\bEBM\b/i.test(rawTitle)
      ? rawTitle.replace(/\bEBM\b/i, SEO_SITE_NAME)
      : `${rawTitle} | ${SEO_SITE_NAME}`;
  const description = input.description?.trim() || DEFAULT_SEO_DESCRIPTION;
  const canonical = absoluteSiteUrl(input.path ?? "/");
  const image = resolveImage(input.image);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SEO_SITE_NAME,
      locale: "fr_TN",
      type: input.type ?? "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
