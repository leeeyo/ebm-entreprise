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
import { bento, heroes } from "@/content/media";

export const metadata: Metadata = {
  title: "Construction villa",
  description:
    "Construction de villa en Tunisie : méthode EBM, gros œuvre, second œuvre et finitions — entreprise BTP Ben Mokhtar.",
};

// Pair each chantier step with a matching visual from the villa bento set.
const STEP_IMAGES = [
  // TODO: replace with real chantier photos
  bento.villa[2], // étude / plan
  bento.immeubles[3], // gros œuvre
  bento.villa[3], // second œuvre
  bento.villa[1], // finitions / salon
];

export default function ConstructionVillaPage() {
  const steps = chantierSteps.map((s, idx) => ({
    title: s.title,
    body: s.body,
    image: STEP_IMAGES[idx] ?? bento.villa[0],
  }));

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow={constructionVillaHero.title}
        title={constructionVillaHero.tagline}
        accent="Rigueur."
        subtitle={constructionVillaAccroche}
        image={heroes.villa}
        ctas={[
          { label: constructionVillaHero.cta, href: "/contact" },
          { label: "Lancer le simulateur", href: "/simulateur", variant: "outline" },
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

      <section
        className="cv-auto border-t bg-muted/10 py-16 sm:py-20"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="En images"
            title="Des villas pensées pour durer."
            subtitle="Volumes, matériaux, finitions — un aperçu de ce que nous construisons."
          />
          <div className="mt-10">
            <ImageBentoGrid images={bento.villa} />
          </div>
        </div>
      </section>

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
