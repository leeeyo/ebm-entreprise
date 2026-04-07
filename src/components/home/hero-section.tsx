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

export function HeroSection() {
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
      {/* pt-24 clears the fixed header; hero body height = remaining viewport so the fold is not pushed down with extra white */}
      <div className="relative min-h-[min(56rem,calc(100svh-6rem))] w-full">
        <div className="absolute inset-0 z-0 overflow-hidden bg-muted">
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
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[min(38vh,26rem)] bg-linear-to-t from-background via-background/55 to-transparent md:h-[min(36vh,28rem)]"
          aria-hidden
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 sm:p-10 md:p-14">
          <div className="ebm-hero-intro mx-auto w-full max-w-6xl text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
              Entreprise de construction
            </p>
            <h1 className="font-heading mx-auto mt-4 max-w-4xl text-balance text-3xl font-semibold tracking-[-0.025em] text-black sm:text-4xl md:text-5xl md:leading-[1.1] lg:text-6xl">
              {homeHero.h1}
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="shadow-md shadow-primary/15 transition-transform hover:-translate-y-0.5">
                <Link href="/simulateur">{homeHero.ctaPrimary}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-foreground/20 bg-background/80 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
              >
                <Link href="/projets">{homeHero.ctaSecondary}</Link>
              </Button>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setI(idx)}
                  className={cn(
                    "h-2 w-8 rounded-full transition-colors duration-300",
                    idx === i ? "bg-primary" : "bg-foreground/20 hover:bg-foreground/35",
                  )}
                  aria-label={`Voir visuel ${idx + 1} — ${s.label}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
