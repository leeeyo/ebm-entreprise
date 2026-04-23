import type { ReactNode } from "react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CtaBand, type CtaBandAction, PageHero, type PageHeroProps } from "@/components/marketing";

type CommonProps = {
  children?: ReactNode;
  /** Optional override for the closing CTA band. */
  closingCta?: {
    title: ReactNode;
    body?: ReactNode;
    primary: CtaBandAction;
    secondary?: CtaBandAction;
    eyebrow?: string;
  };
};

type LegacyProps = CommonProps & {
  /** Legacy path — produces a simple hero. */
  h1: string;
  intro: string;
  hero?: never;
};

type HeroProps = CommonProps & {
  hero: PageHeroProps;
  h1?: never;
  intro?: never;
};

export type MarketingInnerPageProps = LegacyProps | HeroProps;

const DEFAULT_CLOSING: NonNullable<CommonProps["closingCta"]> = {
  eyebrow: "Passons à l'action",
  title: "Prêt à lancer votre projet ?",
  body: "Parlons budget, planning et méthode — notre équipe vous répond sous 48 h.",
  primary: { label: "Demander un devis", href: "/contact" },
  secondary: { label: "Lancer le simulateur", href: "/simulateur" },
};

/**
 * Shared marketing inner-page template.
 *
 * - Renders the new `PageHero` (kinetic H1 + mesh + optional image + CTAs).
 * - Children appear in content sections below the hero.
 * - Closes with a `CtaBand` (override via `closingCta` prop).
 * - Whole tree is wrapped in `LazyMotionProvider` so any `m.*` consumer works.
 */
export function MarketingInnerPage(props: MarketingInnerPageProps) {
  const { children, closingCta } = props;

  const heroProps: PageHeroProps =
    "hero" in props && props.hero
      ? props.hero
      : {
          title: props.h1,
          subtitle: props.intro,
          ctas: [
            { label: "Demander un devis", href: "/contact" },
            { label: "Lancer le simulateur", href: "/simulateur", variant: "outline" },
          ],
        };

  const cta = closingCta ?? DEFAULT_CLOSING;

  return (
    <LazyMotionProvider>
      <PageHero {...heroProps} />
      {children ? (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="space-y-16 sm:space-y-20">{children}</div>
        </div>
      ) : null}
      <CtaBand
        eyebrow={cta.eyebrow}
        title={cta.title}
        body={cta.body}
        primary={cta.primary}
        secondary={cta.secondary}
      />
    </LazyMotionProvider>
  );
}
