import type { Metadata } from "next";
import { Droplets, Hammer, Palmtree, Zap, type LucideIcon } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  HubTile,
  PageHero,
  SectionHeading,
} from "@/components/marketing";
import { bento, heroes } from "@/content/media";
import { groupNavChildren, navSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fluides, électricité, menuiserie et aménagements extérieurs — l'offre technique EBM Ben Mokhtar en Tunisie.",
};

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Fluide: Droplets,
  Électricité: Zap,
  Menuiserie: Hammer,
  "Aménagements extérieurs": Palmtree,
};

const PILLAR_IMAGES: Record<string, { src: string; alt: string }> = {
  Fluide: bento.services[1],
  Électricité: bento.services[0],
  Menuiserie: bento.services[2],
  "Aménagements extérieurs": bento.services[4],
};

const PILLAR_HREF: Record<string, string> = {
  Fluide: "/services/fluide/chauffage",
  Électricité: "/services/electricite/courant-fort",
  Menuiserie: "/services/menuiserie/aluminium",
  "Aménagements extérieurs": "/services/amenagements-exterieurs/terrasse",
};

const PILLAR_DESCRIPTION: Record<string, string> = {
  Fluide:
    "Chauffage, sanitaire et climatisation — réseaux dimensionnés et mis en service dans les règles de l'art.",
  Électricité:
    "Courant fort, courant faible et mise aux normes — une installation sûre, conforme et documentée.",
  Menuiserie:
    "Aluminium, bois, peintures décoratives et étanchéité — l'enveloppe et les finitions qui font la différence.",
  "Aménagements extérieurs":
    "Terrasses, jardins, piscines, pergolas et abris — des espaces extérieurs pensés pour durer.",
};

export default function ServicesHubPage() {
  const section = navSections.find((s) => s.title === "Services");
  const children = section?.children ?? [];
  const groups = groupNavChildren(children);

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Expertise technique"
        title="Nos métiers, votre chantier."
        accent="chantier."
        subtitle="Quatre pôles techniques coordonnés sur vos projets neufs ou de rénovation — exécutés par nos équipes internes."
        image={heroes.services}
        ctas={[
          { label: "Parler à un expert", href: "/contact" },
          { label: "Estimer mon projet", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1400px" }}
      >
        <SectionHeading
          eyebrow="Quatre pôles"
          title="Un seul interlocuteur pour tout votre projet."
          subtitle="Nous pilotons l'ensemble des corps d'état — de la conception à la mise en service — sans multiplier les intervenants."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {groups
            .filter((g) => g.label)
            .map((g, i) => {
              const image = PILLAR_IMAGES[g.label] ?? bento.services[0];
              const Icon = PILLAR_ICONS[g.label];
              return (
                <HubTile
                  key={g.label}
                  href={PILLAR_HREF[g.label] ?? "/services"}
                  title={g.label}
                  description={PILLAR_DESCRIPTION[g.label] ?? ""}
                  image={image}
                  tag={`${g.items.length} prestations`}
                  icon={Icon ? <Icon className="size-5" /> : undefined}
                  bullets={g.items.map((it) => it.title)}
                  eager={i < 2}
                />
              );
            })}
        </div>
      </section>

      <CtaBand
        eyebrow="Un besoin ponctuel ?"
        title="Un chantier précis en tête ?"
        body="Décrivez-nous votre besoin — nous orientons votre dossier vers l'équipe spécialisée sous 48 h."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Estimer mon budget", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
