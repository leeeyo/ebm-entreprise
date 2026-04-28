import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Droplets,
  Flame,
  Hammer,
  Home,
  Leaf,
  Lightbulb,
  PaintRoller,
  Palmtree,
  ShieldCheck,
  Snowflake,
  Sparkles,
  TreePine,
  TrendingUp,
  type LucideIcon,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";
import { MarketingInnerPage } from "@/components/templates/marketing-inner-page";
import {
  FeatureGrid,
  ImageBentoGrid,
  SectionHeading,
} from "@/components/marketing";
import { heroes, genericPageBento } from "@/content/media";
import { genericServicePages } from "@/content/service-pages";
import type { PageHeroProps } from "@/components/marketing";
import type { ServicePageRecord } from "@/lib/cms-content";

const KEY_ICONS: Record<string, LucideIcon> = {
  "construction/immeubles-residences": Home,
  "renovation/maison-appartement": Home,
  "renovation/salle-de-bain": Droplets,
  "fluide/chauffage": Flame,
  "fluide/sanitaire": Droplets,
  "fluide/climatisation": Snowflake,
  "electricite/courant-fort": Zap,
  "electricite/courant-faible": Lightbulb,
  "electricite/maintenance-normes": Wrench,
  "menuiserie/aluminium": Hammer,
  "menuiserie/bois": TreePine,
  "menuiserie/peinture-decoratifs": PaintRoller,
  "menuiserie/etancheite-isolation": ShieldCheck,
  "amenagements-exterieurs/terrasse": Palmtree,
  "amenagements-exterieurs/jardin": Leaf,
  "amenagements-exterieurs/piscine": Waves,
  "amenagements-exterieurs/abri-voiture": Home,
  "amenagements-exterieurs/pergola": Sparkles,
};

const KEY_HERO: Record<string, { src: string; alt: string }> = {
  "construction/immeubles-residences": heroes.immeubles,
  "renovation/maison-appartement": heroes.renovation,
  "renovation/salle-de-bain": heroes.salleDeBain,
  "fluide/chauffage": heroes.services,
  "fluide/sanitaire": heroes.services,
  "fluide/climatisation": heroes.services,
  "electricite/courant-fort": heroes.services,
  "electricite/courant-faible": heroes.services,
  "electricite/maintenance-normes": heroes.services,
  "menuiserie/aluminium": heroes.services,
  "menuiserie/bois": heroes.services,
  "menuiserie/peinture-decoratifs": heroes.services,
  "menuiserie/etancheite-isolation": heroes.services,
  "amenagements-exterieurs/terrasse": heroes.services,
  "amenagements-exterieurs/jardin": heroes.services,
  "amenagements-exterieurs/piscine": heroes.services,
  "amenagements-exterieurs/abri-voiture": heroes.services,
  "amenagements-exterieurs/pergola": heroes.services,
};

/** Three generic rotating icons for bullet rows without a dedicated icon. */
const BULLET_ICON_ROTATION: LucideIcon[] = [CheckCircle2, TrendingUp, Sparkles];

export function GenericMarketingPage({ pageKey, page }: { pageKey: string; page?: ServicePageRecord }) {
  const data = page ?? genericServicePages[pageKey];
  if (!data) {
    notFound();
  }

  const hero: { src: string; alt: string } = KEY_HERO[pageKey] ?? heroes.services;
  const primaryIcon = KEY_ICONS[pageKey] ?? CheckCircle2;
  const bento = genericPageBento[pageKey];
  const primaryCtaLabel = page?.ctaPrimaryLabel ?? "Demander un devis";
  const secondaryCtaLabel = page?.ctaSecondaryLabel ?? "Lancer le simulateur";

  const heroProps: PageHeroProps = {
    eyebrow: "Savoir-faire EBM",
    title: data.title,
    subtitle: data.intro,
    image: hero,
    ctas: [
      { label: primaryCtaLabel, href: "/contact" },
      {
        label: secondaryCtaLabel,
        href: "/simulateur",
        variant: "outline",
      },
    ],
  };

  const features = data.bullets.map((bullet, idx) => {
    const Icon =
      idx === 0
        ? primaryIcon
        : BULLET_ICON_ROTATION[idx % BULLET_ICON_ROTATION.length];
    return {
      title: bullet,
      icon: <Icon className="size-5" />,
    };
  });

  return (
    <MarketingInnerPage hero={heroProps}>
      <section
        className="cv-auto"
        style={{ containIntrinsicSize: "auto 600px" }}
      >
        <SectionHeading
          eyebrow="Points clés"
          title="Ce que nous couvrons"
          subtitle="Une exécution coordonnée, transparente et documentée — du devis à la livraison."
        />
        <div className="mt-10">
          <FeatureGrid items={features} cols={3} />
        </div>
      </section>

      {bento && bento.length >= 5 ? (
        <section
          className="cv-auto"
          style={{ containIntrinsicSize: "auto 800px" }}
        >
          <SectionHeading
            eyebrow="Aperçu"
            title="En images"
            subtitle="Des chantiers inspirés et des finitions soignées — un avant-goût de notre savoir-faire."
          />
          <div className="mt-10">
            <ImageBentoGrid images={bento} />
          </div>
        </section>
      ) : null}
    </MarketingInnerPage>
  );
}
