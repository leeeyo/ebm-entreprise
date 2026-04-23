import type { Metadata } from "next";
import { Building2, HomeIcon } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  HubTile,
  PageHero,
  SectionHeading,
} from "@/components/marketing";
import { bento, heroes } from "@/content/media";

export const metadata: Metadata = {
  title: "Construction",
  description:
    "Construction de villas et programmes immeubles & résidences en Tunisie — méthode EBM Ben Mokhtar.",
};

const tiles = [
  {
    href: "/construction/villa",
    title: "Construction villa",
    description:
      "Du gros œuvre aux finitions : villas sur mesure, suivi de chantier et références qualité.",
    tag: "Neuf résidentiel",
    icon: <HomeIcon className="size-5" />,
    image: bento.villa[0],
    bullets: [
      "Étude et optimisation budgétaire",
      "Gros œuvre & second œuvre",
      "Finitions de prestige",
      "Livraison clé en main",
    ],
  },
  {
    href: "/construction/immeubles-residences",
    title: "Immeubles & résidences",
    description:
      "Programmes collectifs, coordination technique et livraison conforme aux exigences du projet.",
    tag: "Programmes collectifs",
    icon: <Building2 className="size-5" />,
    image: bento.immeubles[0],
    bullets: [
      "Structuration multi-logements",
      "Interfaces bureaux de contrôle",
      "Respect des délais & normes",
      "Livraison maîtrisée",
    ],
  },
];

export default function ConstructionHubPage() {
  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Construction"
        title="Bâtir neuf, avec rigueur."
        accent="rigueur."
        subtitle="EBM accompagne vos projets neufs : villas individuelles et programmes résidentiels, avec une exécution structurée du gros œuvre au second œuvre."
        image={heroes.construction}
        ctas={[
          { label: "Lancer votre projet", href: "/contact" },
          { label: "Estimer mon budget", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <SectionHeading
          eyebrow="Deux métiers"
          title="Deux mondes, une même méthode."
          subtitle="Villas sur mesure ou programmes résidentiels — chaque chantier est coordonné par une équipe unique, de l'étude à la remise des clés."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {tiles.map((t, i) => (
            <HubTile key={t.href} {...t} eager={i === 0} />
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Prêt à démarrer ?"
        title="Un projet neuf en tête ?"
        body="Partagez-nous vos plans ou votre idée — nous revenons vers vous avec une première lecture technique sous 48 h."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Voir nos projets", href: "/projets" }}
      />
    </LazyMotionProvider>
  );
}
