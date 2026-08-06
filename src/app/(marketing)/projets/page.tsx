import type { Metadata } from "next";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  PageHero,
  ProjectCard,
  SectionHeading,
} from "@/components/marketing";
import { listProjects } from "@/lib/cms-content";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Nos projets",
  description:
    "Résidences et réalisations EBM Ben Mokhtar — construction résidentielle et projets clé en main en Tunisie.",
  path: "/projets",
});

export default async function ProjetsIndexPage() {
  const projects = await listProjects({ publishedOnly: true });
  const items = projects.map((p) => {
    const cover = p.coverImage?.src ? p.coverImage : undefined;
    return {
      slug: p.slug,
      title: p.title,
      description: p.shortDescription,
      image: cover ? { src: cover.src ?? "", alt: cover.alt ?? p.title } : undefined,
      tag: p.type,
    };
  });

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Réalisations"
        title="Nos projets, en lumière."
        accent="lumière."
        subtitle="Une sélection de résidences livrées et de chantiers en cours — chaque fiche illustre la méthode EBM."
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
          subtitle="Parcourez la sélection et ouvrez chaque fiche pour découvrir les informations disponibles sur le projet."
        />

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
        body="Partagez-nous une description de votre projet — nous l'étudions avant de vous proposer une méthode et un budget adaptés."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Estimer mon budget", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
