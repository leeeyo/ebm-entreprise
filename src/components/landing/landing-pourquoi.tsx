"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/home/reveal";
import { useTilt } from "@/hooks/use-tilt";
import { pourquoiIntro, pourquoiPillars } from "@/content/home";
import { cn } from "@/lib/utils";

function PillarCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  const ref = useTilt<HTMLElement>({ max: 5, scale: 1 });
  return (
    <article
      ref={ref}
      className={cn(
        "group relative rounded-2xl border border-border/55 bg-card/70 p-5 shadow-sm backdrop-blur-sm",
        "transition-[box-shadow,border-color] duration-300 ease-out will-change-transform",
        "hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative flex gap-4 sm:gap-5">
        <span
          className="font-heading mt-0.5 shrink-0 text-2xl font-semibold tabular-nums text-primary/35 transition-colors duration-300 group-hover:text-primary/65"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 border-l border-primary/15 pl-4 sm:pl-5">
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground sm:text-lg">
            {title}
          </h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/85 sm:text-[0.9375rem]">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LandingPourquoi() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 20%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="cv-auto border-t bg-muted/10 py-16 sm:py-20"
      style={{ containIntrinsicSize: "auto 900px" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="fade-up">
              <div>
                <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
                <h2 className="font-heading text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  Pourquoi choisir l&apos;Entreprise Ben Mokhtar ?
                </h2>
              </div>
            </Reveal>
            <Reveal delayMs={120} variant="fade-up">
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {pourquoiIntro}
              </p>
            </Reveal>

            {/* Vertical progress rail */}
            <div className="mt-8 hidden items-center gap-3 lg:flex">
              <div className="h-28 w-[3px] overflow-hidden rounded-full bg-border/60">
                <m.div
                  className="block h-full origin-top bg-primary"
                  style={{ scaleY: railScale }}
                />
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Nos piliers
              </span>
            </div>
          </div>

          <ul className="mt-10 space-y-4 lg:mt-0">
            {pourquoiPillars.map((p, idx) => (
              <Reveal key={p.title} delayMs={idx * 65} variant="fade-up">
                <li>
                  <PillarCard title={p.title} body={p.body} index={idx} />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
