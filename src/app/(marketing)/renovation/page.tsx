import type { Metadata } from "next";
import { Droplets, Home } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  HubTile,
  PageHero,
  SectionHeading,
} from "@/components/marketing";
import { getPublishedServicePage, type ServicePageRecord } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "Rénovation",
  description:
    "Rénovation maison, appartement et salles de bain en Tunisie — diagnostic, phasage et finitions EBM Ben Mokhtar.",
};

function dashboardImage(page: ServicePageRecord | null) {
  const image = page?.heroImage?.src ? page.heroImage : page?.galleryImages[0];
  return image?.src ? { src: image.src, alt: image.alt ?? page?.title ?? "Image EBM Ben Mokhtar" } : undefined;
}

const tiles = [
  {
    slug: "renovation/maison-appartement",
    href: "/renovation/maison-appartement",
    title: "Maison & appartement",
    description:
      "Réhabilitation complète ou partielle : restructuration, second œuvre et respect de l'existant.",
    tag: "Rénovation globale",
    icon: <Home className="size-5" />,
    bullets: [
      "Diagnostic et phasage",
      "Coordination multi-corps d'état",
      "Réduction des nuisances",
      "Finitions soignées",
    ],
  },
  {
    slug: "renovation/salle-de-bain",
    href: "/renovation/salle-de-bain",
    title: "Salle de bain",
    description:
      "Étanchéité, réseaux, agencement et finitions pour une salle de bain durable et confortable.",
    tag: "Pièce par pièce",
    icon: <Droplets className="size-5" />,
    bullets: [
      "Mise aux normes",
      "Étanchéité & réseaux",
      "Carrelage & menuiseries",
      "Budget maîtrisé",
    ],
  },
];

export default async function RenovationHubPage() {
  const servicePages = await Promise.all(tiles.map((tile) => getPublishedServicePage(tile.slug)));

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Rénovation"
        title="Rénover sans compromis."
        accent="compromis."
        subtitle="Valorisez votre bien avec des travaux maîtrisés : nous sécurisons l'existant, phasons les interventions et coordonnons les corps de métier."
        ctas={[
          { label: "Parler de mon projet", href: "/contact" },
          { label: "Estimer mon budget", href: "/simulateur", variant: "outline" },
        ]}
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <SectionHeading
          eyebrow="Nos spécialités"
          title="Deux approches, un même exigence de qualité."
          subtitle="Que vous rénoviez un logement entier ou une pièce technique, nous gardons le même niveau de rigueur — sécurité, délais et finitions."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {tiles.map((t, i) => (
            <HubTile key={t.href} {...t} image={dashboardImage(servicePages[i])} eager={i === 0} />
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Prêts à transformer votre intérieur ?"
        title="Rénovons votre espace ensemble."
        body="Photos, plans ou simples idées : partagez votre projet, nous revenons avec une première lecture technique sous 48 h."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Voir nos projets", href: "/projets" }}
      />
    </LazyMotionProvider>
  );
}
