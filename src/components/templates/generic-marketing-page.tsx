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
import { genericServicePages } from "@/content/service-pages";
import type { PageHeroProps } from "@/components/marketing";
import type { ServicePageRecord } from "@/lib/cms-content";
import { getDefaultServiceContentSections } from "@/lib/service-page-editor";

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

/** Three generic rotating icons for bullet rows without a dedicated icon. */
const BULLET_ICON_ROTATION: LucideIcon[] = [CheckCircle2, TrendingUp, Sparkles];

export function GenericMarketingPage({ pageKey, page }: { pageKey: string; page?: ServicePageRecord }) {
  const data = page ?? genericServicePages[pageKey];
  if (!data) {
    notFound();
  }

  const hero = page?.heroImage?.src ? { src: page.heroImage.src, alt: page.heroImage.alt ?? data.title } : undefined;
  const primaryIcon = KEY_ICONS[pageKey] ?? CheckCircle2;
  const primaryCtaLabel = page?.ctaPrimaryLabel ?? "Demander un devis";
  const secondaryCtaLabel = page?.ctaSecondaryLabel ?? "Lancer le simulateur";
  const contentSections = page?.contentSections?.length ? page.contentSections : getDefaultServiceContentSections(pageKey, data.intro, data.bullets);
  const galleryImages = page?.galleryImages ?? [];
  const showGallery = page?.showImageGallery ?? galleryImages.length > 0;

  const heroProps: PageHeroProps = {
    eyebrow: page?.heroEyebrow ?? "Savoir-faire EBM",
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

      {contentSections.length ? (
        <section
          className="cv-auto"
          style={{ containIntrinsicSize: "auto 700px" }}
        >
          <SectionHeading
            eyebrow={contentSections[0]?.eyebrow ?? "Méthode EBM"}
            title={contentSections[0]?.title ?? "Une méthode claire pour chaque intervention."}
            subtitle={contentSections[0]?.body ?? "Un cadrage technique, une exécution coordonnée et une réception documentée."}
          />
          {contentSections.length > 1 || contentSections.some((section) => section.items.length) ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {contentSections.map((section) => (
                <article key={section.title} className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{section.eyebrow ?? "EBM"}</p>
                  <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight">{section.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
                  {section.items.length ? (
                    <ul className="mt-4 space-y-2 text-sm text-foreground/85">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {showGallery && galleryImages && galleryImages.length > 0 ? (
        <section
          className="cv-auto"
          style={{ containIntrinsicSize: "auto 800px" }}
        >
          <SectionHeading
            eyebrow={page?.galleryEyebrow ?? "Aperçu"}
            title={page?.galleryTitle ?? "En images"}
            subtitle={page?.gallerySubtitle ?? "Des chantiers inspirés et des finitions soignées — un avant-goût de notre savoir-faire."}
          />
          <div className="mt-10">
            <ImageBentoGrid images={galleryImages} />
          </div>
        </section>
      ) : null}
    </MarketingInnerPage>
  );
}
