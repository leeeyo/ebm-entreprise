"use client";

import { Reveal } from "@/components/home/reveal";
import { pourquoiIntro, pourquoiPillars } from "@/content/home";
import { cn } from "@/lib/utils";

export function LandingPourquoi() {
  return (
    <section className="border-t bg-muted/10 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:gap-12 lg:gap-x-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="fade-up">
              <div>
                <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
                <h2 className="font-heading text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  Pourquoi choisir l&apos;Entreprise Ben Mokhtar ?
                </h2>
              </div>
            </Reveal>
            <Reveal delayMs={100} variant="fade-up">
              <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground lg:mt-6">{pourquoiIntro}</p>
            </Reveal>
          </div>

          <ul className="mt-10 space-y-4 lg:mt-0">
            {pourquoiPillars.map((p, idx) => (
              <Reveal key={p.title} delayMs={idx * 55} variant="fade-up">
                <li>
                  <article
                    className={cn(
                      "group rounded-2xl border border-border/50 bg-card/60 p-5 shadow-sm transition-all duration-300",
                      "hover:border-primary/20 hover:bg-card hover:shadow-md",
                    )}
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <span
                        className="font-heading mt-0.5 shrink-0 text-2xl font-semibold tabular-nums text-primary/35 transition-colors group-hover:text-primary/55"
                        aria-hidden
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 border-l border-primary/15 pl-4 sm:pl-5">
                        <h3 className="font-heading text-base font-semibold leading-snug text-foreground">{p.title}</h3>
                        <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/85 sm:text-[0.9375rem]">{p.body}</p>
                      </div>
                    </div>
                  </article>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
