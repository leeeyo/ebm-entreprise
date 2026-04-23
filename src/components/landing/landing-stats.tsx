"use client";

import { animate, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { useMotionOk } from "@/hooks/use-motion-ok";
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

const COUNT_EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedNumber({
  value,
  active,
  startDelayMs,
  motionOk,
}: {
  value: number;
  active: boolean;
  startDelayMs: number;
  motionOk: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    setDisplay(0);
    setLanded(false);
    if (!active) return;

    if (!motionOk) {
      setDisplay(value);
      setLanded(true);
      return;
    }

    let cancelled = false;
    let controls: { stop: () => void } | null = null;

    const tid = setTimeout(() => {
      if (cancelled) return;
      controls = animate(0, value, {
        duration: 1.6,
        ease: COUNT_EASE,
        onUpdate: (v) => {
          if (!cancelled) setDisplay(Math.round(v));
        },
        onComplete: () => {
          if (!cancelled) setLanded(true);
        },
      });
    }, startDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(tid);
      controls?.stop();
    };
  }, [active, value, startDelayMs, motionOk]);

  return (
    <m.span
      className="inline-flex items-baseline gap-0.5"
      animate={landed && motionOk ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-primary/90" aria-hidden>
        +
      </span>
      <span className="tabular-nums tracking-tight">{display}</span>
    </m.span>
  );
}

const statContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const STAT_ITEM_EASE = [0.22, 1, 0.36, 1] as const;

const statItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: STAT_ITEM_EASE },
  },
};

export function LandingStats() {
  const { ref, active } = useInViewOnce<HTMLElement>();
  const motionOk = useMotionOk();

  return (
    <section
      ref={ref}
      className="cv-auto relative isolate overflow-hidden border-y border-border/50 bg-muted/20 py-20 sm:py-24"
      style={{ containIntrinsicSize: "auto 600px" }}
    >
      {/* Ambient mesh background — transform-only, paused off-screen via cv-auto. */}
      {motionOk ? (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="ebm-mesh opacity-70" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.96_0.02_48/0.35),transparent)]"
          aria-hidden
        />
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade">
          <div className="text-center">
            <span className="mx-auto mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Notre engagement en chiffres
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              Des résultats mesurables, bâtis chantier après chantier.
            </p>
          </div>
        </Reveal>

        <m.div
          className="mt-14 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-6"
          variants={statContainer}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
        >
          {stats.map((s, idx) => (
            <m.div
              key={s.label}
              variants={statItem}
              className="relative flex flex-col items-center text-center md:px-6"
            >
              {idx > 0 ? (
                <span
                  className="pointer-events-none absolute left-0 top-8 hidden h-20 w-px bg-linear-to-b from-transparent via-border to-transparent md:block"
                  aria-hidden
                />
              ) : null}
              <p className="font-heading font-semibold leading-none tabular-nums tracking-tight text-primary text-[clamp(3.25rem,8vw,5.5rem)]">
                <AnimatedNumber
                  value={s.value}
                  active={active}
                  startDelayMs={motionOk ? 200 + idx * 140 : 0}
                  motionOk={motionOk}
                />
              </p>
              <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {s.label}
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
