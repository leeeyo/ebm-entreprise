import { z } from "zod";
import { constructionVillaAccroche, chantierSteps, chantierStepsIntro } from "@/content/construction-villa";
import { genericServicePages } from "@/content/service-pages";
import type { MediaItem } from "@/content/media";
import { galleryPayloadFromFormData, normalizeGalleryPayload, type EmbeddedGalleryImage } from "@/lib/embedded-gallery";
import { navSections } from "@/lib/navigation";
import { CONTENT_STATUSES } from "@/models/ServicePage";

export type ServiceContentSection = {
  eyebrow?: string;
  title: string;
  body: string;
  items: string[];
};

export type ServicePageEditorPayload = {
  slug: string;
  navLabel: string;
  category?: string;
  heroEyebrow: string;
  heroImage?: MediaItem;
  title: string;
  intro: string;
  bullets: string[];
  contentSections: ServiceContentSection[];
  showImageGallery: boolean;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages: EmbeddedGalleryImage[];
  status: "draft" | "published";
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

const MAX_BULLETS = 6;
const MAX_SECTIONS = 4;
const DEFAULT_HERO_EYEBROW = "Savoir-faire EBM";

const IMMEUBLES_SECTIONS: ServiceContentSection[] = [
  {
    eyebrow: "Méthode EBM",
    title: "Étude & montage technique",
    body:
      "Analyse des plans d'architecte, contrôle structurel et coordination avec les bureaux d'études. Nous optimisons la structure pour sécuriser le budget et les délais.",
    items: [],
  },
  {
    eyebrow: "Méthode EBM",
    title: "Gros œuvre multi-niveaux",
    body:
      "Terrassement, fondations, ossature béton armé et maçonnerie. Notre parc d'engins nous rend autonomes, même sur des projets à forte densité.",
    items: [],
  },
  {
    eyebrow: "Méthode EBM",
    title: "Second œuvre & corps d'état",
    body:
      "Enveloppe, étanchéité, lots techniques (électricité / plomberie / CVC) et menuiseries. Chaque corps d'état est piloté sur un planning partagé.",
    items: [],
  },
  {
    eyebrow: "Méthode EBM",
    title: "Finitions & livraison",
    body:
      "Revêtements, peintures, espaces communs et contrôles de conformité. Livraison par tranches ou en une fois selon votre programme.",
    items: [],
  },
];

function compactStrings(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

export function splitEditorLines(value: string) {
  return compactStrings(value.split("\n"));
}

export function normalizeServiceSlug(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/services\//, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

export function publicServiceHref(slug: string) {
  return slug.startsWith("construction/") || slug.startsWith("renovation/") ? `/${slug}` : `/services/${slug}`;
}

export function getDefaultServiceHero(_slug: string): MediaItem | undefined {
  return undefined;
}

export function getServiceNavMeta(slug: string) {
  const children = navSections.flatMap((section) => section.children ?? []);
  return children.find((child) => child.href === publicServiceHref(slug));
}

export function getServiceGroup(slug: string) {
  if (slug.startsWith("construction/")) return "Construction";
  if (slug.startsWith("renovation/")) return "Rénovation";
  return getServiceNavMeta(slug)?.category ?? "Services";
}

export function getDefaultServiceContentSections(slug: string, intro: string, bullets: string[]): ServiceContentSection[] {
  if (slug === "construction/villa") {
    return chantierSteps.map((step) => ({
      eyebrow: chantierStepsIntro.title,
      title: step.title,
      body: step.body,
      items: [],
    }));
  }

  if (slug === "construction/immeubles-residences") {
    return IMMEUBLES_SECTIONS;
  }

  return [
    {
      eyebrow: "Approche EBM",
      title: "Une exécution coordonnée, transparente et documentée.",
      body: intro,
      items: bullets,
    },
  ];
}

export function getDefaultServicePage(slug: string): Omit<ServicePageEditorPayload, "status" | "order"> {
  const base =
    slug === "construction/villa"
      ? {
          title: "Construction villa clé en main en Tunisie",
          intro: constructionVillaAccroche,
          bullets: [
            "Étude technique et optimisation budgétaire",
            "Gros œuvre, second œuvre et finitions coordonnées",
            "Suivi chantier transparent du devis à la livraison",
          ],
        }
      : genericServicePages[slug] ?? {
          title: getServiceNavMeta(slug)?.title ?? "Service EBM",
          intro: "Une prestation EBM cadrée, documentée et pilotée avec rigueur.",
          bullets: ["Diagnostic technique", "Exécution coordonnée", "Réception contrôlée"],
        };
  const navMeta = getServiceNavMeta(slug);
  return {
    slug,
    navLabel: navMeta?.title ?? base.title,
    category: getServiceGroup(slug),
    heroEyebrow: DEFAULT_HERO_EYEBROW,
    heroImage: getDefaultServiceHero(slug),
    title: base.title,
    intro: base.intro,
    bullets: base.bullets,
    contentSections: getDefaultServiceContentSections(slug, base.intro, base.bullets),
    showImageGallery: true,
    galleryEyebrow: "Aperçu",
    galleryTitle: "En images",
    gallerySubtitle: "Des chantiers inspirés et des finitions soignées — un avant-goût de notre savoir-faire.",
    galleryImages: [],
    seoTitle: `${base.title} | EBM Ben Mokhtar`,
    seoDescription: base.intro,
    ctaPrimaryLabel: slug === "construction/villa" ? "Obtenez votre devis" : "Demander un devis",
    ctaSecondaryLabel: "Lancer le simulateur",
  };
}

const mediaItemSchema = z
  .object({
    src: z.string().trim().max(500).optional(),
    alt: z.string().trim().max(180).optional(),
  })
  .transform((value) => {
    const src = value.src?.trim();
    const alt = value.alt?.trim();
    return src ? { src, alt: alt || "Image de service EBM." } : undefined;
  });

const contentSectionSchema = z
  .object({
    eyebrow: z.string().trim().max(80).optional(),
    title: z.string().trim().min(2).max(140),
    body: z.string().trim().min(10).max(900),
    items: z.array(z.string().trim().min(2).max(160)).max(6).default([]),
  })
  .transform((section) => ({
    ...section,
    items: compactStrings(section.items),
  }));

export const servicePageEditorSchema = z.object({
  slug: z.string().trim().min(2).transform(normalizeServiceSlug),
  navLabel: z.string().trim().min(2).max(90),
  category: z.string().trim().max(80).optional(),
  heroEyebrow: z.string().trim().min(2).max(80).default(DEFAULT_HERO_EYEBROW),
  heroImage: mediaItemSchema.optional(),
  title: z.string().trim().min(2).max(160),
  intro: z.string().trim().min(10).max(500),
  bullets: z.array(z.string().trim().min(2).max(180)).min(1).max(MAX_BULLETS),
  contentSections: z.array(contentSectionSchema).max(MAX_SECTIONS).default([]),
  showImageGallery: z.coerce.boolean().default(true),
  galleryEyebrow: z.string().trim().max(80).optional(),
  galleryTitle: z.string().trim().max(140).optional(),
  gallerySubtitle: z.string().trim().max(240).optional(),
  galleryImages: z.array(z.object({
    src: z.string().trim().min(1).max(500),
    alt: z.string().trim().min(2).max(180),
    caption: z.string().trim().max(180).optional(),
  })).max(12).default([]),
  status: z.enum(CONTENT_STATUSES).default("published"),
  order: z.coerce.number().int().min(0).max(500).default(0),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(240).optional(),
  ctaPrimaryLabel: z.string().trim().min(2).max(60).default("Demander un devis"),
  ctaSecondaryLabel: z.string().trim().min(2).max(60).default("Lancer le simulateur"),
});

export function servicePayloadFromFormData(formData: FormData): ServicePageEditorPayload {
  const contentSections = Array.from({ length: MAX_SECTIONS }, (_, index) => {
    const title = String(formData.get(`contentSections.${index}.title`) ?? "").trim();
    const body = String(formData.get(`contentSections.${index}.body`) ?? "").trim();
    if (!title && !body) return null;

    const eyebrowRaw = String(formData.get(`contentSections.${index}.eyebrow`) ?? "").trim();
    const base = {
      title,
      body,
      items: splitEditorLines(String(formData.get(`contentSections.${index}.items`) ?? "")),
    };
    return eyebrowRaw ? { ...base, eyebrow: eyebrowRaw } : base;
  }).filter((section): section is ServiceContentSection => Boolean(section));

  const gallery = galleryPayloadFromFormData(formData);

  return servicePageEditorSchema.parse({
    slug: formData.get("slug"),
    navLabel: formData.get("navLabel"),
    category: formData.get("category") || undefined,
    heroEyebrow: formData.get("heroEyebrow"),
    heroImage: {
      src: formData.get("heroImageSrc"),
      alt: formData.get("heroImageAlt"),
    },
    title: formData.get("title"),
    intro: formData.get("intro"),
    bullets: splitEditorLines(String(formData.get("bullets") ?? "")),
    contentSections,
    ...gallery,
    status: formData.get("status"),
    order: formData.get("order"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    ctaPrimaryLabel: formData.get("ctaPrimaryLabel"),
    ctaSecondaryLabel: formData.get("ctaSecondaryLabel"),
  });
}

export function servicePayloadFromJson(value: unknown): ServicePageEditorPayload {
  const input = value as Record<string, unknown>;
  return servicePageEditorSchema.parse({
    ...input,
    heroImage:
      input.heroImage ??
      (input.heroImageSrc || input.heroImageAlt
        ? { src: input.heroImageSrc, alt: input.heroImageAlt }
        : undefined),
    bullets: typeof input.bullets === "string" ? splitEditorLines(input.bullets) : input.bullets,
    contentSections:
      typeof input.contentSections === "string"
        ? [
            {
              title: "Contenu de page",
              body: input.contentSections,
              items: [],
            },
          ]
        : input.contentSections,
    ...normalizeGalleryPayload(input),
  });
}

export function servicePayloadToUpdate(payload: ServicePageEditorPayload) {
  return {
    slug: payload.slug,
    navLabel: payload.navLabel,
    category: payload.category,
    heroEyebrow: payload.heroEyebrow,
    heroImage: payload.heroImage,
    title: payload.title,
    intro: payload.intro,
    bullets: payload.bullets,
    contentSections: payload.contentSections,
    showImageGallery: payload.showImageGallery,
    galleryEyebrow: payload.galleryEyebrow,
    galleryTitle: payload.galleryTitle,
    gallerySubtitle: payload.gallerySubtitle,
    galleryImages: payload.galleryImages,
    sections: payload.contentSections.map((section) => section.title),
    status: payload.status,
    order: payload.order,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    ctaPrimaryLabel: payload.ctaPrimaryLabel,
    ctaSecondaryLabel: payload.ctaSecondaryLabel,
  };
}
