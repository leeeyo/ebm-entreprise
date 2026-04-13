"use client";

import { Quote } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { temoignages } from "@/content/home";
import { cn } from "@/lib/utils";

export function LandingTemoignages() {
  return (
    <section className="border-t py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade-up">
          <div>
            <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Ce que nos clients disent de nous
            </h2>
          </div>
        </Reveal>

        <div
          className={cn(
            "mt-10 flex gap-4 pb-2 md:grid md:grid-cols-3 md:gap-6 md:pb-0",
            "snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] md:snap-none md:overflow-visible [&::-webkit-scrollbar]:hidden",
          )}
        >
          {temoignages.map((t, idx) => (
            <Reveal
              key={t.author}
              className="max-md:w-[min(100%,22rem)] max-md:shrink-0 max-md:snap-center md:min-w-0"
              delayMs={idx * 75}
              variant="fade-up"
            >
              <figure
                className={cn(
                  "relative flex h-full min-h-[14rem] flex-col rounded-2xl border border-border/50 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300",
                  "hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg md:min-h-0",
                )}
              >
                <Quote
                  className="absolute right-5 top-5 size-10 text-primary/15"
                  aria-hidden
                  strokeWidth={1.25}
                />
                <blockquote className="relative z-10 flex-1 pt-1 text-pretty text-base font-medium leading-relaxed text-foreground/95">
                  « {t.quote} »
                </blockquote>
                <figcaption className="relative z-10 mt-5 border-t border-border/50 pt-4 text-xs font-medium tracking-wide text-muted-foreground">
                  — {t.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
