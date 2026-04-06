"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/home";

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen]);

  return { ref, active: seen };
}

function AnimatedNumber({ value, active }: { value: number; active: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.floor(value * (0.5 + 0.5 * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return <span>{n}</span>;
}

export function StatCounters() {
  const { ref, active } = useInViewOnce<HTMLDivElement>();

  return (
    <section ref={ref} className="border-b bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          Notre engagement en chiffres
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-card p-6 text-center shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-heading text-4xl font-semibold tabular-nums text-primary sm:text-5xl">
                +<AnimatedNumber value={s.value} active={active} />
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
