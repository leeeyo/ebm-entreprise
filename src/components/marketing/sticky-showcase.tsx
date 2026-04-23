"use client";

import { AnimatePresence, m } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { cn } from "@/lib/utils";

export type ShowcaseStep = {
  title: string;
  body: string;
  image: { src: string; alt: string };
};

export type StickyShowcaseProps = {
  steps: ShowcaseStep[];
  /** Side of the sticky image on desktop. Defaults to left. */
  imageSide?: "left" | "right";
  className?: string;
};

/**
 * A sticky image paired with a scroll-synced, numbered step list.
 * The image crossfades to the active step's visual as the user scrolls.
 * Mobile collapses to a simple stacked card list.
 *
 * Must render inside a `LazyMotionProvider`.
 */
export function StickyShowcase({
  steps,
  imageSide = "left",
  className,
}: StickyShowcaseProps) {
  const motionOk = useMotionOk();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!motionOk) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const idx = refs.current.findIndex((el) => el === visible.target);
        if (idx !== -1) setActive(idx);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [motionOk, steps.length]);

  const flip = imageSide === "right";
  const currentImage = steps[active]?.image ?? steps[0].image;

  return (
    <div
      className={cn(
        "grid gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] md:gap-14",
        flip && "md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)]",
        className,
      )}
    >
      {/* Sticky image column — desktop only */}
      <div className={cn("hidden md:block", flip && "md:order-2")}>
        <div className="sticky top-24">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border/55 bg-muted shadow-sm">
            <AnimatePresence mode="popLayout">
              <m.div
                key={currentImage.src}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </m.div>
            </AnimatePresence>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex gap-1.5 p-4"
              aria-hidden
            >
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full bg-white/35 transition-all duration-500",
                    i === active && "bg-white",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps column */}
      <ol className={cn("space-y-8 md:space-y-16", flip && "md:order-1")}>
        {steps.map((step, idx) => {
          const setRef = (el: HTMLLIElement | null) => {
            refs.current[idx] = el;
          };
          return (
            <li key={step.title} ref={setRef}>
              <Reveal variant="fade-up" delayMs={idx * 60}>
                <div className="flex gap-5 sm:gap-6">
                  <span
                    className={cn(
                      "font-heading mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border text-base font-semibold tabular-nums transition-colors duration-300",
                      idx === active
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border-border bg-card text-foreground/70",
                    )}
                    aria-hidden
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                      {step.body}
                    </p>
                    {/* Inline image for mobile layout */}
                    <div className="mt-5 md:hidden">
                      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/55 bg-muted">
                        <Image
                          src={step.image.src}
                          alt={step.image.alt}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
