"use client";

import { m, useScroll, useTransform } from "framer-motion";
import {
  ClipboardCheck,
  Compass,
  HardHat,
  Headphones,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/home/reveal";

type Step = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    title: "Écoute",
    body: "Analyse du besoin, contraintes du terrain et budget.",
    Icon: Compass,
  },
  {
    title: "Étude",
    body: "Plans, chiffrage détaillé, calendrier et jalons validés.",
    Icon: ClipboardCheck,
  },
  {
    title: "Chantier",
    body: "Exécution coordonnée, suivi qualité et reporting régulier.",
    Icon: HardHat,
  },
  {
    title: "Livraison",
    body: "Contrôle final, levée des réserves et remise des clés.",
    Icon: KeyRound,
  },
  {
    title: "SAV",
    body: "Accompagnement, garantie décennale et interventions.",
    Icon: Headphones,
  },
];

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const railScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const total = STEPS.length;

  return (
    <section
      ref={ref}
      className="cv-auto border-t py-16 sm:py-20"
      style={{ containIntrinsicSize: "auto 700px" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade-up">
          <div>
            <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Notre méthode, étape par étape
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              Un processus transparent, de la première discussion à l&apos;entretien post-livraison.
            </p>
          </div>
        </Reveal>

        {/* Desktop: horizontal timeline with scroll-linked line draw */}
        <div className="relative mt-14 hidden md:block">
          <svg
            className="pointer-events-none absolute inset-x-0 top-8 h-2 w-full"
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke="var(--border)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            <m.line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke="var(--ebm-orange)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          <ol
            className="relative grid gap-6"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
          >
            {STEPS.map((s, idx) => (
              <Reveal key={s.title} delayMs={idx * 80} variant="fade-up">
                <li className="relative flex flex-col items-center text-center">
                  <span
                    className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border/70 bg-background text-primary shadow-sm transition-[border-color,box-shadow] duration-300 group-hover:border-primary/40"
                  >
                    <s.Icon className="size-6" aria-hidden />
                  </span>
                  <p className="font-heading mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Étape {idx + 1}
                  </p>
                  <h3 className="font-heading mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-56 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Mobile: vertical rail with scroll-linked scaleY */}
        <div className="relative mt-10 md:hidden">
          <div className="absolute left-6.25 top-0 h-full w-[3px] overflow-hidden rounded-full bg-border/60">
            <m.div
              className="h-full origin-top bg-primary"
              style={{ scaleY: railScaleX }}
            />
          </div>
          <ol className="space-y-6">
            {STEPS.map((s, idx) => (
              <Reveal key={s.title} delayMs={idx * 80} variant="fade-up">
                <li className="relative pl-16">
                  <span className="absolute left-0 top-0 flex size-13 items-center justify-center rounded-full border border-border/70 bg-background text-primary shadow-sm">
                    <s.Icon className="size-5" aria-hidden />
                  </span>
                  <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Étape {idx + 1}
                  </p>
                  <h3 className="font-heading mt-1 text-base font-semibold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
