"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeHero } from "@/content/home";
import {
  HERO_FALLBACK_IMAGE_SRC,
  HERO_VIDEO_END_STATIC_SRC,
  HERO_VIDEO_LAYOUT_MIN_WIDTH_PX,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_SRC,
} from "@/content/hero-video";
import { cn } from "@/lib/utils";

const HERO_END_CROSSFADE = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
};

const HERO_VIDEO_INTRO = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

let clientReady = false;

function subscribeClientReady(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  queueMicrotask(() => {
    if (!clientReady) {
      clientReady = true;
      onStoreChange();
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

type HeroFullBleedMediaProps = {
  mounted: boolean;
  motionOk: boolean;
};

/**
 * Poster + optional video. Keyed by motionOk in the parent so toggling
 * prefers-reduced-motion remounts and resets playback state without effects.
 */
function HeroFullBleedMedia({ mounted, motionOk }: HeroFullBleedMediaProps) {
  const showVideo = mounted && motionOk;
  const [videoSurfaceActive, setVideoSurfaceActive] = useState(false);
  const [playbackEnded, setPlaybackEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const posterVisible =
    !motionOk ||
    !showVideo ||
    (!videoSurfaceActive && !playbackEnded);

  const videoOpacity = playbackEnded ? 0 : videoSurfaceActive ? 1 : 0;

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
          <motion.div
            className="absolute inset-0 z-1 h-full w-full"
            initial={false}
            animate={{ opacity: playbackEnded ? 1 : 0 }}
            transition={HERO_END_CROSSFADE}
          >
            <Image
              src={HERO_VIDEO_END_STATIC_SRC}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              aria-hidden
            />
          </motion.div>
          <motion.video
            ref={videoRef}
            className="absolute inset-0 z-2 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: videoOpacity }}
            transition={playbackEnded ? HERO_END_CROSSFADE : HERO_VIDEO_INTRO}
            muted
            playsInline
            preload="auto"
            onCanPlay={() => {
              const el = videoRef.current;
              if (el) void el.play().catch(() => {});
            }}
            onPlaying={() => setVideoSurfaceActive(true)}
            onEnded={() => setPlaybackEnded(true)}
            aria-label="Présentation vidéo des réalisations EBM Ben Mokhtar"
          >
            <source
              src={HERO_VIDEO_MOBILE_SRC}
              type="video/mp4"
              media={`(max-width: ${HERO_VIDEO_LAYOUT_MIN_WIDTH_PX - 1}px)`}
            />
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </motion.video>
        </>
      ) : null}
    </div>
  );
}

/**
 * Full-viewport hero (below fixed header): poster image first, then fullscreen video.
 * When playback finishes, the video crossfades to the static Résidence Amira cover.
 */
export function HeroSectionSplit() {
  const mounted = useSyncExternalStore(
    subscribeClientReady,
    getClientReadySnapshot,
    getClientReadyServerSnapshot,
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const motionOk = !prefersReducedMotion;

  return (
    <section className="relative z-0 border-b pt-0 lg:pt-[calc(6rem-3px)]">
      <div className="relative isolate pt-[calc(6rem-3px)] lg:pt-0 min-h-[min(36rem,calc(100svh-6rem))] w-full overflow-hidden lg:min-h-0 lg:h-[min(56rem,calc(100svh-6rem))] lg:max-h-[calc(100svh-6rem)]">
        {/* Full-bleed media: poster → video → crossfade to static cover at end. */}
        <HeroFullBleedMedia key={String(motionOk)} mounted={mounted} motionOk={motionOk} />

        {/* Readability scrims above media (z-0–1), below copy (z-10) */}
        <div
          className="pointer-events-none absolute inset-0 z-5 bg-linear-to-r from-background/58 via-background/32 to-background/5 sm:via-background/26"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-background/10 via-transparent to-background/22"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-6 h-[min(30%,14rem)] bg-linear-to-b from-background/18 to-transparent sm:from-background/15"
          aria-hidden
        />

        {/* Copy — entrance stagger via globals `.ebm-hero-intro` */}
        <div className="relative z-10 mx-auto flex min-h-[min(36rem,calc(100svh-6rem))] w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-6 sm:py-14 lg:min-h-0 lg:h-full lg:max-h-[calc(100svh-6rem)] lg:py-10 lg:pr-[42%]">
          <div className="ebm-hero-intro w-full max-w-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary sm:text-[0.7rem]">
              Entreprise de construction
            </p>
            <h1 className="font-heading mt-3.5 text-balance text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[1.65rem] sm:leading-[1.15] md:text-[1.85rem] md:leading-[1.1] lg:text-[2.05rem]">
              {homeHero.h1}
            </h1>
            <p className="mt-3.5 text-pretty text-sm font-medium leading-relaxed text-foreground/92 sm:text-[0.9375rem]">
              {homeHero.subtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
              <Button
                size="lg"
                asChild
                className="shadow-md shadow-primary/15 transition-transform hover:-translate-y-0.5"
              >
                <Link href="/simulateur">{homeHero.ctaPrimary}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-foreground/25 bg-background/75 transition-transform hover:-translate-y-0.5"
              >
                <Link href="/projets">{homeHero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
