"use client";

import { AnimatePresence, m } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { temoignages } from "@/content/home";
import { cn } from "@/lib/utils";

const ROTATE_INTERVAL_MS = 5600;

function TemoignageCard({
  quote,
  author,
  accent,
}: {
  quote: string;
  author: string;
  accent?: boolean;
}) {
  return (
    <figure
      className={cn(
        "relative flex h-full min-h-56 flex-col rounded-2xl border border-border/55 bg-card/85 p-6 shadow-sm backdrop-blur-sm",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg",
      )}
    >
      <Quote
        className={cn(
          "absolute right-5 top-5 size-10 text-primary/15",
          accent && "ebm-quote-pulse",
        )}
        aria-hidden
        strokeWidth={1.25}
      />
      <blockquote className="relative z-10 flex-1 pt-1 text-pretty text-base font-medium leading-relaxed text-foreground/95">
        « {quote} »
      </blockquote>
      <figcaption className="relative z-10 mt-5 border-t border-border/55 pt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        — {author}
      </figcaption>
    </figure>
  );
}

function MobileCarousel() {
  const [idx, setIdx] = useState(0);
  const pausedRef = useRef(false);
  const motionOk = useMotionOk();

  useEffect(() => {
    if (!motionOk) return;
    const tick = () => {
      if (pausedRef.current) return;
      setIdx((i) => (i + 1) % temoignages.length);
    };
    const id = window.setInterval(tick, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [motionOk]);

  const current = temoignages[idx];

  return (
    <div
      className="relative md:hidden"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <div className="relative min-h-64">
        <AnimatePresence mode="wait">
          {current ? (
            <m.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <TemoignageCard quote={current.quote} author={current.author} accent />
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Témoignages">
        {temoignages.map((t, i) => (
          <button
            key={t.author}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Témoignage ${i + 1}`}
            onClick={() => setIdx(i)}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-300",
              i === idx ? "w-7 bg-primary" : "w-2.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function LandingTemoignages() {
  return (
    <section
      className="cv-auto border-t py-16 sm:py-20"
      style={{ containIntrinsicSize: "auto 650px" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade-up">
          <div>
            <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Ce que nos clients disent de nous
            </h2>
          </div>
        </Reveal>

        {/* Desktop: static grid */}
        <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
          {temoignages.map((t, idx) => (
            <Reveal key={t.author} delayMs={idx * 85} variant="fade-up">
              <TemoignageCard quote={t.quote} author={t.author} accent={idx === 1} />
            </Reveal>
          ))}
        </div>

        {/* Mobile: auto-advance crossfade */}
        <div className="mt-8">
          <MobileCarousel />
        </div>
      </div>
    </section>
  );
}
