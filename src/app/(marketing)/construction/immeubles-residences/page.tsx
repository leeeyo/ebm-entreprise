"use client";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  ImageBentoGrid,
  PageHero,
  SectionHeading,
  StickyShowcase,
} from "@/components/marketing";
import { bento, heroes } from "@/content/media";

const steps = [
  {
    title: "Étude & montage technique",
    body: "Analyse des plans d'architecte, contrôle structurel et coordination avec les bureaux d'études. Nous optimisons la structure pour sécuriser le budget et les délais.",
    image: bento.immeubles[4],
  },
  {
    title: "Gros œuvre multi-niveaux",
    body: "Terrassement, fondations, ossature béton armé et maçonnerie. Notre parc d'engins nous rend autonomes, même sur des projets à forte densité.",
    image: bento.immeubles[3],
  },
  {
    title: "Second œuvre & corps d'état",
    body: "Enveloppe, étanchéité, lots techniques (électricité / plomberie / CVC) et menuiseries. Chaque corps d'état est piloté sur un planning partagé.",
    image: bento.immeubles[1],
  },
  {
    title: "Finitions & livraison",
    body: "Revêtements, peintures, espaces communs et contrôles de conformité. Livraison par tranches ou en une fois selon votre programme.",
    image: bento.immeubles[2],
  },
];

export default function ConstructionImmeublesPage() {
  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Programmes collectifs"
        title="Construire des résidences qui durent."
        accent="résidences"
        subtitle="EBM pilote des projets multi-logements avec une coordination technique serrée : structure, corps d'état, finitions et livraison — sous un même toit."
        image={heroes.immeubles}
        ctas={[
          { label: "Demander un devis", href: "/contact" },
          { label: "Voir nos projets", href: "/projets", variant: "outline" },
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
          <StickyShowcase steps={steps} imageSide="right" />
        </div>
      </section>

      <section
        className="cv-auto border-t bg-muted/10 py-16 sm:py-20"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="En images"
            title="Nos résidences livrées."
            subtitle="Structures, halls, volumes — un aperçu de nos ouvrages collectifs."
          />
          <div className="mt-10">
            <ImageBentoGrid images={bento.immeubles} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Un programme à lancer ?"
        title="Parlons coordination, planning et budget."
        body="Transmettez-nous votre dossier — nous revenons avec une lecture technique et une fourchette budgétaire sous 72 h."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Consulter nos projets", href: "/projets" }}
      />
    </LazyMotionProvider>
  );
}
