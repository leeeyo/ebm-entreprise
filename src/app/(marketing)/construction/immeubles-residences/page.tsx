import type { Metadata } from "next";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  ImageBentoGrid,
  PageHero,
  SectionHeading,
  StickyShowcase,
} from "@/components/marketing";
import { getPublishedServicePage } from "@/lib/cms-content";
import { getDefaultServiceContentSections } from "@/lib/service-page-editor";

const defaultSteps = [
  {
    title: "Étude & montage technique",
    body: "Analyse des plans d'architecte, contrôle structurel et coordination avec les bureaux d'études. Nous optimisons la structure pour sécuriser le budget et les délais.",
  },
  {
    title: "Gros œuvre multi-niveaux",
    body: "Terrassement, fondations, ossature béton armé et maçonnerie. Notre parc d'engins nous rend autonomes, même sur des projets à forte densité.",
  },
  {
    title: "Second œuvre & corps d'état",
    body: "Enveloppe, étanchéité, lots techniques (électricité / plomberie / CVC) et menuiseries. Chaque corps d'état est piloté sur un planning partagé.",
  },
  {
    title: "Finitions & livraison",
    body: "Revêtements, peintures, espaces communs et contrôles de conformité. Livraison par tranches ou en une fois selon votre programme.",
  },
];

const PAGE_KEY = "construction/immeubles-residences";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedServicePage(PAGE_KEY);
  return {
    title: page?.seoTitle ?? page?.title ?? "Construction Immeubles & résidences",
    description: page?.seoDescription ?? page?.intro ?? "Construction d'immeubles et de résidences avec coordination technique EBM.",
  };
}

export default async function ConstructionImmeublesPage() {
  const page = await getPublishedServicePage(PAGE_KEY);
  const dashboardImages = page?.galleryImages ?? [];
  const contentSections = page?.contentSections?.length
    ? page.contentSections
    : getDefaultServiceContentSections(PAGE_KEY, "Sur un programme résidentiel, la coordination fait la différence.", []);
  const showcaseSteps = contentSections.map((section, idx) => ({
    title: section.title,
    body: section.body,
    image: dashboardImages[idx],
  }));
  const fallbackShowcaseSteps = defaultSteps.map((section, idx) => ({
    ...section,
    image: dashboardImages[idx],
  }));
  const heroImage = page?.heroImage?.src ? { src: page.heroImage.src, alt: page.heroImage.alt ?? page.title } : undefined;
  const galleryImages = dashboardImages;
  const showGallery = page?.showImageGallery ?? galleryImages.length > 0;

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow={page?.heroEyebrow ?? "Programmes collectifs"}
        title={page?.title ?? "Construire des résidences qui durent."}
        accent="résidences"
        subtitle={page?.intro ?? "EBM pilote des projets multi-logements avec une coordination technique serrée : structure, corps d'état, finitions et livraison — sous un même toit."}
        image={heroImage}
        ctas={[
          { label: page?.ctaPrimaryLabel ?? "Demander un devis", href: "/contact" },
          { label: page?.ctaSecondaryLabel ?? "Lancer le simulateur", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1400px" }}
      >
        <SectionHeading
          eyebrow="Méthode EBM"
          title="Quatre phases, un seul interlocuteur."
          subtitle="Sur un programme résidentiel, la coordination fait la différence. Nous gardons le cap du devis à la remise des clés."
        />
        <div className="mt-12">
          <StickyShowcase steps={showcaseSteps.length ? showcaseSteps : fallbackShowcaseSteps} imageSide="right" />
        </div>
      </section>

      {showGallery && galleryImages.length > 0 ? (
        <section
          className="cv-auto border-t bg-muted/10 py-16 sm:py-20"
          style={{ containIntrinsicSize: "auto 900px" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow={page?.galleryEyebrow ?? "En images"}
              title={page?.galleryTitle ?? "Nos résidences livrées."}
              subtitle={page?.gallerySubtitle ?? "Structures, halls, volumes — un aperçu de nos ouvrages collectifs."}
            />
            <div className="mt-10">
              <ImageBentoGrid images={galleryImages} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow="Un programme à lancer ?"
        title="Parlons coordination, planning et budget."
        body="Transmettez-nous votre dossier — nous revenons avec une lecture technique et une fourchette budgétaire sous 72 h."
        primary={{ label: page?.ctaPrimaryLabel ?? "Demander un devis", href: "/contact" }}
        secondary={{ label: page?.ctaSecondaryLabel ?? "Lancer le simulateur", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
