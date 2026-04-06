"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeHero } from "@/content/home";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    label: "Plans et structure",
    src: "/hero/hero1.png",
  },
  {
    id: 2,
    label: "Gros œuvre",
    src: "/hero/hero2.png",
  },
  {
    id: 3,
    label: "Finitions",
    src: "/hero/hero3.png",
  },
  {
    id: 4,
    label: "Réalisations",
    src: "/hero/hero4.png",
  },
] as const;

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
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative z-0 border-b">
      <div className="relative min-h-[min(92vh,56rem)] w-full">
        {/* z-0: slides never stack above copy */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-muted">
          {slides.map((s, idx) => (
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
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-background/35 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-14">
          <div className="ebm-hero-intro mx-auto w-full max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
              Entreprise de construction
            </p>
            <h1 className="font-heading mt-3 max-w-4xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl md:leading-[1.08] lg:text-6xl">
              {homeHero.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {homeHero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5">
                <Link href="/simulateur">{homeHero.ctaPrimary}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-ebm-navy/25 bg-background/85 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
              >
                <Link href="/projets">{homeHero.ctaSecondary}</Link>
              </Button>
            </div>
            <div className="mt-6 flex justify-start gap-2 sm:justify-center md:justify-start">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setI(idx)}
                  className={cn(
                    "h-2 w-8 rounded-full transition-all duration-300",
                    idx === i
                      ? "bg-primary shadow-[0_0_12px_rgba(249,115,22,0.45)]"
                      : "bg-muted-foreground/35 hover:bg-muted-foreground/55",
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
