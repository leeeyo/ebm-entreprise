"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
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
    <h1 className="font-heading mt-3.5 text-balance text-[1.9rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.1rem] sm:leading-[1.08] md:text-[2.45rem] lg:text-[2.75rem]">
      {tokens.map((raw, i) => {
        const isAccent = raw === ACCENT_WORD;
        const trailingSpace = i < tokens.length - 1 ? " " : "";
        return (
          <span key={`${raw}-${i}`} className="ebm-word-mask">
            <span
              className="ebm-word"
              style={{ animationDelay: `${120 + i * 70}ms` }}
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
              {trailingSpace}
            </span>
          </span>
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
          ? "shadow-md shadow-primary/15"
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

  return (
    <section className="relative z-0 border-b pt-0 lg:pt-[calc(6rem-3px)]">
      <div className="relative isolate pt-[calc(6rem-3px)] lg:pt-0 min-h-[min(40rem,calc(100svh-6rem))] w-full overflow-hidden lg:min-h-0 lg:h-[min(56rem,calc(100svh-6rem))] lg:max-h-[calc(100svh-6rem)]">
        <HeroMedia key={String(motionOk)} mounted={mounted} motionOk={motionOk} />

        {/* Animated mesh overlay, sits above media but under scrim/copy. */}
        {motionOk ? (
          <div className="pointer-events-none absolute inset-0 z-3 overflow-hidden" aria-hidden>
            <div className="ebm-mesh" />
          </div>
        ) : null}

        {/* Readability scrims */}
        <div
          className="pointer-events-none absolute inset-0 z-5 bg-linear-to-r from-background/65 via-background/35 to-background/5 sm:via-background/28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-background/15 via-transparent to-background/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-6 h-[min(30%,14rem)] bg-linear-to-b from-background/20 to-transparent"
          aria-hidden
        />

        {/* Copy */}
        <div className="relative z-10 mx-auto flex min-h-[min(40rem,calc(100svh-6rem))] w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-6 sm:py-14 lg:min-h-0 lg:h-full lg:max-h-[calc(100svh-6rem)] lg:py-10 lg:pr-[40%]">
          <div className="w-full max-w-2xl">
            <p
              className="ebm-word inline-block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary sm:text-[0.75rem]"
              style={{ animationDelay: "60ms" }}
            >
              Entreprise de construction
            </p>
            <KineticH1 text={homeHero.h1} />
            <div
              className="ebm-word mt-6 flex flex-wrap gap-3 sm:mt-7"
              style={{ animationDelay: `${120 + tokenizeH1(homeHero.h1).length * 70 + 220}ms` }}
            >
              <MagneticCta href="/simulateur" label={homeHero.ctaPrimary} />
              <MagneticCta href="/projets" label={homeHero.ctaSecondary} variant="outline" />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center sm:bottom-6"
          aria-hidden
        >
          <span className="ebm-scroll-cue inline-flex size-9 items-center justify-center rounded-full border border-foreground/25 bg-background/70 text-foreground/80 backdrop-blur-sm">
            <ChevronDown className="size-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
