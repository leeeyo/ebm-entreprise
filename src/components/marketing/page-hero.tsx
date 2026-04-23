import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MagneticLink } from "./magnetic-link";
import { cn } from "@/lib/utils";

export type PageHeroCta = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
};

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  /** Word(s) within `title` that should be visually underlined. */
  accent?: string;
  subtitle?: ReactNode;
  ctas?: PageHeroCta[];
  /** Full-bleed background image. Uses mesh-only when omitted. */
  image?: { src: string; alt: string };
  /** Compact variant: reduces height + hides image. */
  compact?: boolean;
  /** Optional children rendered under the subtitle (e.g. trust strip). */
  children?: ReactNode;
  className?: string;
};

/** Tokenize a title so each word can be independently animated. */
function tokens(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function KineticHeading({ title, accent }: { title: string; accent?: string }) {
  const words = tokens(title);
  return (
    <h1
      className={cn(
        "font-heading mt-3 text-balance font-semibold tracking-[-0.02em] text-foreground",
        "text-[2rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.1rem] leading-[1.08]",
      )}
    >
      {words.map((raw, i) => {
        const clean = raw.replace(/[.,;:!?]+$/, "");
        const isAccent =
          !!accent && clean.toLowerCase() === accent.toLowerCase();
        const trailing = i < words.length - 1 ? " " : "";
        return (
          <span key={`${raw}-${i}`} className="ebm-word-mask">
            <span
              className="ebm-word"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              {isAccent ? (
                <span className="relative inline-block align-baseline">
                  <span className="relative z-10">{raw}</span>
                  <span
                    className="ebm-underline-draw absolute inset-x-0 -bottom-[0.05em]"
                    aria-hidden
                  />
                </span>
              ) : (
                raw
              )}
              {trailing}
            </span>
          </span>
        );
      })}
    </h1>
  );
}

/**
 * Universal marketing hero: eyebrow + kinetic H1 + subtitle + CTAs,
 * over an animated mesh and an optional full-bleed photo.
 *
 * Server component; only the CTA buttons hydrate for magnetic hover.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  ctas,
  image,
  compact = false,
  children,
  className,
}: PageHeroProps) {
  const wordCount = tokens(title).length;
  const heightClass = compact
    ? "min-h-[18rem] sm:min-h-[22rem] lg:min-h-[24rem]"
    : "min-h-[26rem] sm:min-h-[32rem] lg:min-h-[36rem]";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b",
        heightClass,
        className,
      )}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover"
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-muted/60 to-background" aria-hidden />
      )}

      {/* Animated mesh overlay */}
      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden" aria-hidden>
        <div className="ebm-mesh" />
      </div>

      {/* Readability scrims */}
      <div
        className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-background/80 via-background/55 to-background/25 sm:via-background/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-3 h-[min(32%,12rem)] bg-linear-to-b from-background/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-3 h-[min(28%,10rem)] bg-linear-to-t from-background/30 to-transparent"
        aria-hidden
      />

      {/* Copy */}
      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center px-4 sm:px-6",
          compact ? "py-12 sm:py-14" : "py-14 sm:py-20",
          compact ? "min-h-[18rem] sm:min-h-[22rem] lg:min-h-[24rem]" : "min-h-[26rem] sm:min-h-[32rem] lg:min-h-[36rem]",
        )}
      >
        <div className={cn("max-w-3xl", compact && "mx-auto text-center")}>
          {eyebrow ? (
            <p
              className="ebm-word inline-block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary sm:text-[0.75rem]"
              style={{ animationDelay: "60ms" }}
            >
              {eyebrow}
            </p>
          ) : null}
          <KineticHeading title={title} accent={accent} />
          {subtitle ? (
            <p
              className="ebm-word mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: `${160 + wordCount * 60}ms` }}
            >
              {subtitle}
            </p>
          ) : null}
          {ctas && ctas.length > 0 ? (
            <div
              className={cn(
                "ebm-word mt-7 flex flex-wrap gap-3",
                compact && "justify-center",
              )}
              style={{ animationDelay: `${260 + wordCount * 60}ms` }}
            >
              {ctas.map((cta) => (
                <Button
                  key={cta.href + cta.label}
                  asChild
                  size="lg"
                  variant={cta.variant ?? "default"}
                  className={cn(
                    cta.variant === "outline"
                      ? "border-foreground/25 bg-background/75"
                      : "shadow-md shadow-primary/15",
                    "transition-[box-shadow,background-color] duration-300 hover:shadow-lg",
                  )}
                >
                  <MagneticLink href={cta.href} className="will-change-transform">
                    {cta.label}
                  </MagneticLink>
                </Button>
              ))}
            </div>
          ) : null}
          {children ? (
            <div
              className="ebm-word mt-8"
              style={{ animationDelay: `${340 + wordCount * 60}ms` }}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Convenience: fallback Link+Button for cases you don't want magnetic. */
export function PageHeroPlainCta({ href, label, variant }: PageHeroCta) {
  return (
    <Button asChild size="lg" variant={variant ?? "default"}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
