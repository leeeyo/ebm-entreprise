import type { Metadata } from "next";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  PageHero,
  ProjectCard,
  SectionHeading,
} from "@/components/marketing";
import { heroes } from "@/content/media";
import { getResidenceCover } from "@/content/residence-covers";
import { projets } from "@/content/projets";

export const metadata: Metadata = {
  title: "Nos projets",
  description:
    "Résidences et réalisations EBM Ben Mokhtar — construction résidentielle et projets clé en main en Tunisie.",
};

// Static chips (visual only for now — no client-side filtering yet).
const CHIPS = ["Tous les projets", "Résidentiel", "Clé en main", "Programmes livrés"] as const;

export default function ProjetsIndexPage() {
  const items = projets.map((p) => {
    const cover = getResidenceCover(p.slug, p.title);
    return {
      slug: p.slug,
      title: p.title,
      description: p.shortDescription,
      image: cover ? { src: cover.src, alt: cover.alt } : undefined,
      tag: "Résidentiel",
    };
  });

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Réalisations"
        title="Nos projets, en lumière."
        accent="lumière."
        subtitle="Une sélection de résidences livrées et de chantiers en cours — chaque fiche illustre la méthode EBM."
        image={heroes.projets}
        ctas={[
          { label: "Lancer mon projet", href: "/contact" },
          { label: "Estimer mon budget", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1600px" }}
      >
        <SectionHeading
          eyebrow="Portfolio"
          title="Des ouvrages livrés, pas des promesses."
          subtitle="Filtrez par typologie (à venir) ou parcourez l'ensemble — chaque chantier raconte une manière rigoureuse de construire."
        />

        <div
          className="mt-8 flex flex-wrap gap-2 sm:gap-3"
          role="group"
          aria-label="Filtres projets (aperçu)"
        >
          {CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={
                i === 0
                  ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-sm"
                  : "rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-foreground"
              }
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <ProjectCard
              key={item.slug}
              item={item}
              eager={idx < 3}
              aspect="4/5"
            />
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Votre projet, notre prochaine référence."
        title="Faisons de votre chantier le suivant."
        body="Partagez-nous le brief — nous l'étudions et revenons avec une proposition de méthode et de budget."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Estimer mon budget", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
