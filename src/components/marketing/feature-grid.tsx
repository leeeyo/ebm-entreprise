"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/home/reveal";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

export type FeatureItem = {
  title: string;
  body?: string;
  /**
   * Optional pre-rendered icon element (e.g. `<Home className="size-5" />`).
   * Must be a rendered ReactNode — server components cannot pass component
   * references across the server/client boundary.
   */
  icon?: ReactNode;
};

export type FeatureGridProps = {
  items: FeatureItem[];
  /** Number of columns at lg breakpoint. Defaults to 3. */
  cols?: 2 | 3 | 4;
  className?: string;
};

function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const ref = useTilt<HTMLElement>({ max: 4, scale: 1 });

  return (
    <article
      ref={ref}
      className={cn(
        "group relative h-full rounded-2xl border border-border/55 bg-card/70 p-6 shadow-sm backdrop-blur-sm",
        "transition-[box-shadow,border-color] duration-300 ease-out will-change-transform",
        "hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative flex h-full flex-col">
        {item.icon ? (
          <span
            className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden
          >
            {item.icon}
          </span>
        ) : (
          <span
            className="font-heading mb-4 block text-xl font-semibold tabular-nums text-primary/40 transition-colors duration-300 group-hover:text-primary/70"
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-foreground">
          {item.title}
        </h3>
        {item.body ? (
          <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-foreground/80 sm:text-[0.9375rem]">
            {item.body}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function FeatureGrid({ items, cols = 3, className }: FeatureGridProps) {
  const colClass =
    cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : cols === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={cn("grid gap-5", colClass, className)}>
      {items.map((item, idx) => (
        <Reveal key={item.title} delayMs={idx * 60} variant="fade-up">
          <li className="h-full">
            <FeatureCard item={item} index={idx} />
          </li>
        </Reveal>
      ))}
    </ul>
  );
}
