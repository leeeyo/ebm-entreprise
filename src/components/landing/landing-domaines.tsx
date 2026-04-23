"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Box, Building2, Hammer, Layers } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { domaines } from "@/content/home";
import { cn } from "@/lib/utils";

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "Gros Œuvre & Structure": Building2,
  "Projets Clé en Main": Layers,
  "Rénovation & Extension": Hammer,
  "Ouvrages Spécialisés": Box,
};

const AUTO_ADVANCE_MS = 5500;

type Domaine = (typeof domaines)[number];

/** Desktop: horizontal image-accordion. Active panel grows, others collapse. */
function DomainesAccordion() {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const motionOk = useMotionOk();

  const pausedRef = useRef(false);

  const onEnter = useCallback((i: number) => {
    setActive(i);
    setInteracted(true);
    pausedRef.current = true;
  }, []);

  const onLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    if (!motionOk || interacted) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % domaines.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [motionOk, interacted]);

  return (
    <ul
      role="tablist"
      aria-label="Domaines d'intervention"
      className="hidden h-[min(70vh,38rem)] gap-2 md:flex"
      onPointerLeave={onLeave}
    >
      {domaines.map((d, i) => {
        const isActive = active === i;
        const Icon = DOMAIN_ICONS[d.title] ?? Building2;
        return (
          <li
            key={d.title}
            role="tab"
            aria-selected={isActive}
            aria-controls={`domaine-panel-${i}`}
            tabIndex={isActive ? 0 : -1}
            onPointerEnter={() => onEnter(i)}
            onFocus={() => onEnter(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                onEnter((i + 1) % domaines.length);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                onEnter((i - 1 + domaines.length) % domaines.length);
              }
            }}
            className={cn(
              "group relative isolate cursor-pointer overflow-hidden rounded-3xl border border-border/55 bg-card shadow-sm outline-none",
              "transition-[flex-grow,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive && "shadow-xl shadow-primary/5",
            )}
            style={{ flexGrow: isActive ? 5 : 1, flexShrink: 1, flexBasis: 0 }}
          >
            <Image
              src={d.image.src}
              alt={d.image.alt}
              fill
              sizes={isActive ? "(min-width: 1024px) 50vw, 45vw" : "15vw"}
              className={cn(
                "object-cover transition-[transform,filter] duration-700 ease-out",
                isActive ? "scale-100" : "scale-[1.06] brightness-[0.78] saturate-[0.9]",
              )}
              priority={i === 0}
            />

            {/* Darken gradient — stronger when inactive */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 transition-opacity duration-700",
                isActive
                  ? "bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-100"
                  : "bg-linear-to-t from-black/85 via-black/55 to-black/30 opacity-100",
              )}
              aria-hidden
            />

            {/* Inactive label — vertical title + small index */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-6 transition-opacity duration-500",
                isActive ? "opacity-0" : "opacity-100 delay-200",
              )}
              aria-hidden
            >
              <span className="font-heading text-[0.7rem] font-semibold tabular-nums tracking-[0.28em] text-white/75">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white/95"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {d.title}
              </h3>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                <Icon className="size-4" />
              </span>
            </div>

            {/* Active content */}
            <div
              id={`domaine-panel-${i}`}
              className={cn(
                "absolute inset-x-0 bottom-0 p-6 text-white transition-[opacity,transform] duration-700 ease-out sm:p-7",
                isActive
                  ? "translate-y-0 opacity-100 delay-150"
                  : "pointer-events-none translate-y-3 opacity-0",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/95 text-primary-foreground ring-1 ring-white/20 shadow-lg shadow-primary/25">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-heading text-[0.7rem] font-semibold tabular-nums tracking-[0.28em] text-white/75">
                    {String(i + 1).padStart(2, "0")} / {String(domaines.length).padStart(2, "0")}
                  </span>
                </div>
                <ArrowUpRight className="size-5 text-white/80" aria-hidden />
              </div>
              <h3 className="font-heading mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-[1.65rem]">
                {d.title}
              </h3>
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                {d.description}
              </p>
            </div>

            {/* Auto-advance progress bar (active panel only) */}
            {isActive && motionOk && !interacted ? (
              <div className="absolute inset-x-5 bottom-2 z-10 h-[2px] overflow-hidden rounded-full bg-white/15">
                <span
                  key={`progress-${i}`}
                  className="ebm-domaine-progress block h-full origin-left bg-white/85"
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Mobile: compact stacked cards (one viewport per card, no scroll-pinning). */
function DomainesStack() {
  return (
    <ul className="mt-8 space-y-4 md:hidden">
      {domaines.map((d, i) => {
        const Icon = DOMAIN_ICONS[d.title] ?? Building2;
        return (
          <Reveal key={d.title} delayMs={i * 70} variant="fade-up">
            <li>
              <article className="group relative overflow-hidden rounded-2xl border border-border/55 bg-card shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/25 hover:shadow-lg">
                <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                  <Image
                    src={d.image.src}
                    alt={d.image.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-heading absolute right-4 top-4 text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-white/90">
                    {String(i + 1).padStart(2, "0")} / {String(domaines.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold leading-snug tracking-tight text-foreground">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                </div>
              </article>
            </li>
          </Reveal>
        );
      })}
    </ul>
  );
}

export function LandingDomaines() {
  return (
    <section
      className="cv-auto relative py-16 sm:py-20"
      style={{ containIntrinsicSize: "auto 720px" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade-up">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
              <h2 className="font-heading text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Nos domaines d&apos;intervention
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                De la structure porteuse aux ouvrages les plus exigeants — quatre pôles d&apos;expertise, un seul
                interlocuteur.
              </p>
            </div>
            <p className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
              Survolez un panneau
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={100} variant="fade-up" className="mt-10">
          <div>
            <DomainesAccordion />
            <DomainesStack />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
