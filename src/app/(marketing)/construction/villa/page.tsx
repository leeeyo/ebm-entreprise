import type { Metadata } from "next";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  FaqAccordion,
  ImageBentoGrid,
  PageHero,
  SectionHeading,
  StickyShowcase,
} from "@/components/marketing";
import {
  chantierSteps,
  chantierStepsIntro,
  constructionVillaAccroche,
  constructionVillaHero,
  faqConstructionVilla,
  suiviSection,
} from "@/content/construction-villa";
import { getPublishedServicePage } from "@/lib/cms-content";
import { getDefaultServiceContentSections } from "@/lib/service-page-editor";

const PAGE_KEY = "construction/villa";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedServicePage(PAGE_KEY);
  return {
    title: page?.seoTitle ?? page?.title ?? "Construction villa",
    description:
      page?.seoDescription ??
      page?.intro ??
      "Construction de villa en Tunisie : méthode EBM, gros œuvre, second œuvre et finitions — entreprise BTP Ben Mokhtar.",
  };
}

export default async function ConstructionVillaPage() {
  const page = await getPublishedServicePage(PAGE_KEY);
  const dashboardImages = page?.galleryImages ?? [];
  const contentSections = page?.contentSections?.length
    ? page.contentSections
    : getDefaultServiceContentSections(PAGE_KEY, constructionVillaAccroche, chantierSteps.map((step) => step.title));
  const steps = contentSections.map((s, idx) => ({
    title: s.title,
    body: s.body,
    image: dashboardImages[idx],
  }));
  const heroImage = page?.heroImage?.src ? { src: page.heroImage.src, alt: page.heroImage.alt ?? page.title } : undefined;
  const galleryImages = dashboardImages;
  const showGallery = page?.showImageGallery ?? galleryImages.length > 0;

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow={page?.heroEyebrow ?? constructionVillaHero.title}
        title={page?.title ?? constructionVillaHero.tagline}
        accent="Rigueur."
        subtitle={page?.intro ?? constructionVillaAccroche}
        image={heroImage}
        ctas={[
          { label: page?.ctaPrimaryLabel ?? constructionVillaHero.cta, href: "/contact" },
          { label: page?.ctaSecondaryLabel ?? "Lancer le simulateur", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1400px" }}
      >
        <SectionHeading
          eyebrow="Notre méthode"
          title={chantierStepsIntro.subtitle}
          subtitle={chantierStepsIntro.lead}
        />
        <div className="mt-12">
          <StickyShowcase steps={steps} imageSide="left" />
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
              title={page?.galleryTitle ?? "Des villas pensées pour durer."}
              subtitle={page?.gallerySubtitle ?? "Volumes, matériaux, finitions — un aperçu de ce que nous construisons."}
            />
            <div className="mt-10">
              <ImageBentoGrid images={galleryImages} />
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 700px" }}
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-14">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions fréquentes."
            subtitle={suiviSection.text}
          />
          <div>
            <FaqAccordion items={[...faqConstructionVilla]} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Parlons de votre projet"
        title="Obtenez votre devis villa."
        body="Partagez vos plans ou votre cahier des charges — nous revenons vers vous avec une première évaluation technique."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Estimer mon budget", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
