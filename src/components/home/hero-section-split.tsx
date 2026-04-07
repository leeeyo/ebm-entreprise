"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeHero } from "@/content/home";
import { heroSlides } from "@/components/home/hero-slides";
import { cn } from "@/lib/utils";

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

/**
 * Split hero: left column is a mini-grid (copy row + horizontal mascot), right column = slides (unchanged ratio).
 */
export function HeroSectionSplit() {
  const [i, setI] = useState(0);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const motionOk = !prefersReducedMotion;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative z-0 border-b bg-muted pt-24">
      {/* lg+: fixed hero height so the split doesn’t extend the page */}
      <div className="mx-auto grid min-h-0 w-full max-w-[1920px] grid-cols-1 lg:h-[min(56rem,calc(100svh-6rem))] lg:max-h-[calc(100svh-6rem)] lg:grid-cols-[9fr_16fr] lg:grid-rows-1 lg:overflow-hidden">
        {/* Left (~36%): two equal rows — copy (full-bleed muted) + mascot (object-cover, no gaps) */}
        <div className="relative order-2 grid min-h-88 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] overflow-hidden bg-muted lg:order-1 lg:h-full lg:min-h-0">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-linear-to-l from-muted to-transparent sm:w-14 lg:w-16"
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-0 flex-col justify-center overflow-y-auto overflow-x-hidden bg-muted px-5 py-6 sm:px-6 sm:py-7 lg:px-7">
            <div className="ebm-hero-intro w-full max-w-none">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                Entreprise de construction
              </p>
              <h1 className="font-heading mt-3 text-balance text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl md:text-[1.75rem] md:leading-[1.15] lg:text-[1.85rem] lg:leading-[1.12]">
                {homeHero.h1}
              </h1>
              <p className="mt-3 text-pretty text-sm font-medium leading-relaxed text-foreground/90 sm:text-[0.9375rem]">
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
                  className="border-foreground/25 bg-background/80 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                >
                  <Link href="/projets">{homeHero.ctaSecondary}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative z-0 h-full min-h-0 overflow-hidden bg-muted">
            <Image
              src="/mascot/mascot-hero.png"
              alt="Illustration EBM : équipe et projets"
              fill
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Right (~64%): carousel — unchanged proportion */}
        <div className="relative order-1 min-h-[min(20rem,42svh)] w-full overflow-hidden bg-muted lg:order-2 lg:h-full lg:min-h-0">
          <div className="absolute inset-0">
            {heroSlides.map((s, idx) => (
              <div
                key={s.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-out",
                  idx === i ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                aria-hidden={idx !== i}
              >
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden",
                    idx === i && motionOk && "ebm-hero-ken",
                  )}
                >
                  <Image
                    src={s.src}
                    alt={s.label}
                    fill
                    priority={idx === 0}
                    sizes="(min-width: 1024px) 64vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-linear-to-t from-background/90 via-background/35 to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-2 pb-4 pt-6">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setI(idx)}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors duration-300",
                  idx === i ? "bg-primary" : "bg-foreground/25 hover:bg-foreground/40",
                )}
                aria-label={`Voir visuel ${idx + 1} — ${s.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
