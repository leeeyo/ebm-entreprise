"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { homeHero } from "@/content/home";
import {
  HERO_FALLBACK_IMAGE_SRC,
  HERO_VIDEO_END_STATIC_SRC,
  HERO_VIDEO_LAYOUT_MIN_WIDTH_PX,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_SRC,
} from "@/content/hero-video";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { cn } from "@/lib/utils";

const ACCENT_WORD = "Rigueur";

/** Split H1 into word tokens, preserving punctuation like ":" as its own token. */
function tokenizeH1(h1: string): string[] {
  return h1.split(/\s+/).filter(Boolean);
}

let clientReady = false;
function subscribeClientReady(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  queueMicrotask(() => {
    if (!clientReady) {
      clientReady = true;
      onChange();
    }
  });
  return () => {};
}
function getClientReadySnapshot() {
  return typeof window !== "undefined" && clientReady;
}
function getClientReadyServerSnapshot() {
  return false;
}

type HeroMediaProps = {
  mounted: boolean;
  motionOk: boolean;
};

function HeroMedia({ mounted, motionOk }: HeroMediaProps) {
  const showVideo = mounted && motionOk;
  const [videoActive, setVideoActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const posterVisible = !motionOk || !showVideo || (!videoActive && !ended);

  return (
    <div className="absolute inset-0 z-0 bg-muted">
      <Image
        src={HERO_FALLBACK_IMAGE_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(
          "z-0 object-cover transition-opacity duration-500 ease-out",
          posterVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />
      {showVideo ? (
        <>
          <Image
            src={HERO_VIDEO_END_STATIC_SRC}
            alt=""
            fill
            sizes="100vw"
            className={cn(
              "absolute inset-0 z-1 object-cover transition-opacity duration-700 ease-out",
              ended ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 z-2 h-full w-full object-cover transition-opacity duration-500 ease-out",
              ended ? "opacity-0" : videoActive ? "opacity-100" : "opacity-0",
            )}
            muted
            playsInline
            preload="auto"
            onCanPlay={() => {
              const el = videoRef.current;
              if (el) void el.play().catch(() => {});
            }}
            onPlaying={() => setVideoActive(true)}
            onEnded={() => setEnded(true)}
            aria-label="Présentation vidéo des réalisations EBM Ben Mokhtar"
          >
            <source
              src={HERO_VIDEO_MOBILE_SRC}
              type="video/mp4"
              media={`(max-width: ${HERO_VIDEO_LAYOUT_MIN_WIDTH_PX - 1}px)`}
            />
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        </>
      ) : null}
    </div>
  );
}

function KineticH1({ text }: { text: string }) {
  const tokens = tokenizeH1(text);
  return (
    <h1 className="font-heading mt-3.5 text-balance text-[2.125rem] font-semibold leading-[1.1] tracking-[-0.015em] text-foreground sm:text-[2.375rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem]">
      {tokens.map((raw, i) => {
        const isAccent = raw === ACCENT_WORD;
        return (
          <Fragment key={`${raw}-${i}`}>
            <span className="ebm-word-mask">
              <span
                className="ebm-word"
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                {isAccent ? (
                  <span className="relative inline-block align-baseline">
                    <span className="relative z-10">{raw}</span>
                    <span
                      className="ebm-underline-draw ebm-underline-hero-soft absolute inset-x-0 bottom-[0.05em]"
                      aria-hidden
                    />
                  </span>
                ) : (
                  raw
                )}
              </span>
            </span>
            {i < tokens.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </h1>
  );
}

function MagneticCta({
  href,
  label,
  variant = "default",
}: {
  href: string;
  label: string;
  variant?: "default" | "outline";
}) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 8, radius: 120 });
  return (
    <Button
      size="lg"
      asChild
      variant={variant}
      className={cn(
        variant === "default"
          ? "shadow-md shadow-primary/10"
          : "border-foreground/25 bg-background/75",
        "transition-[box-shadow,background-color] duration-300 hover:shadow-lg",
      )}
    >
      <Link ref={ref} href={href} className="will-change-transform">
        {label}
      </Link>
    </Button>
  );
}

/**
 * Fullscreen hero: fullbleed media (video → crossfade) + kinetic copy
 * with animated mesh overlay and magnetic CTAs.
 */
export function HeroKinetic() {
  const mounted = useSyncExternalStore(
    subscribeClientReady,
    getClientReadySnapshot,
    getClientReadyServerSnapshot,
  );
  const motionOk = useMotionOk();

  const wordCount = tokenizeH1(homeHero.h1).length;
  const ctaDelay = 120 + wordCount * 70 + 220;

  return (
    <section className="relative z-0 border-b pt-16 md:pt-20 lg:pt-32">
      <div className="relative isolate flex min-h-[min(44rem,calc(100dvh-4rem))] w-full flex-col overflow-hidden md:min-h-[min(46rem,calc(100dvh-5rem))] lg:min-h-0 lg:h-[calc(100dvh-8rem)] lg:max-h-224">
        <HeroMedia key={String(motionOk)} mounted={mounted} motionOk={motionOk} />

        {/* Animated mesh overlay, sits above media but under scrim/copy. */}
        {motionOk ? (
          <div className="pointer-events-none absolute inset-0 z-3 overflow-hidden" aria-hidden>
            <div className="ebm-mesh ebm-mesh--hero-soft" />
          </div>
        ) : null}

        {/* Readability scrim — one cohesive stack, darker on the copy side */}
        <div
          className="pointer-events-none absolute inset-0 z-5 bg-linear-to-r from-background/60 via-background/20 to-transparent lg:via-background/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-48 bg-linear-to-t from-background/30 to-transparent"
          aria-hidden
        />

        {/* Decorative left rail — subtle vertical hairline */}
        <span
          className="pointer-events-none absolute inset-y-10 left-4 z-6 hidden w-px bg-linear-to-b from-transparent via-foreground/20 to-transparent md:block md:left-6 lg:left-8 xl:left-10"
          aria-hidden
        />

        {/* Copy — flex-1 + justify-center so vertical centering works below lg (h-full on min-h parents is unreliable). */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-center px-5 pb-28 pt-3 max-[380px]:pb-32 sm:px-6 sm:pb-29 md:pb-24 md:pt-0 lg:flex-none lg:h-full lg:min-h-0 lg:justify-center lg:px-10 lg:pb-0 lg:pt-0 xl:px-14">
          <div className="w-full max-w-[min(42rem,90vw)] lg:max-w-176">
            {/* Chapter number + eyebrow */}
            <div
              className="ebm-word flex items-center gap-3"
              style={{ animationDelay: "60ms" }}
            >
              <span className="h-px w-8 bg-primary/43" aria-hidden />
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-primary/88 sm:text-[0.8rem] lg:text-[0.75rem]">
                Entreprise de construction
              </p>
            </div>

            <KineticH1 text={homeHero.h1} />

            {/* Supporting lead sentence */}
            <p
              className="ebm-word mt-5 max-w-152 text-balance text-[1rem] leading-relaxed text-foreground/75 sm:mt-6 sm:text-[1.0625rem] lg:text-base"
              style={{ animationDelay: `${ctaDelay - 120}ms` }}
            >
              Quinze ans d&rsquo;expertise au service du bâtiment, du gros œuvre
              aux finitions — partout en Tunisie.
            </p>

            <div
              className="ebm-word mt-7 flex flex-wrap gap-3 sm:mt-8"
              style={{ animationDelay: `${ctaDelay}ms` }}
            >
              <MagneticCta href="/simulateur" label={homeHero.ctaPrimary} />
              <MagneticCta href="/projets" label={homeHero.ctaSecondary} variant="outline" />
            </div>
          </div>
        </div>

        {/* Residence caption — bottom-right on the media side */}
        <div
          className="pointer-events-none absolute bottom-6 right-5 z-10 hidden items-end gap-3 text-right md:flex md:bottom-8 md:right-6 lg:bottom-10 lg:right-10 xl:right-14"
          aria-hidden
        >
          <span className="h-px w-10 bg-foreground/30 md:w-14" />
          <div className="min-w-0">
            <span className="block font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-foreground/55">
              Résidence en vedette
            </span>
            <span className="block font-heading text-sm font-semibold tracking-tight text-foreground/85 md:text-base">
              Résidence Amira
            </span>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-1.5 sm:bottom-6"
          aria-hidden
        >
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.28em] text-foreground/55">
            Découvrir
          </span>
          <span className="ebm-scroll-cue inline-flex size-9 items-center justify-center rounded-full border border-foreground/25 bg-background/70 text-foreground/80 backdrop-blur-sm">
            <ChevronDown className="size-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
