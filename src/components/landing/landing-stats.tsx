"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
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
      { threshold: 0.2 },
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
}: {
  value: number;
  active: boolean;
  startDelayMs: number;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    setDisplay(0);
    setLanded(false);
    if (!active) return;

    if (reduceMotion) {
      setDisplay(value);
      setLanded(true);
      return;
    }

    let cancelled = false;
    let controls: { stop: () => void } | null = null;

    const tid = setTimeout(() => {
      if (cancelled) return;
      controls = animate(0, value, {
        duration: 1.45,
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
  }, [active, value, startDelayMs, reduceMotion]);

  return (
    <motion.span
      className="inline-flex items-baseline gap-0.5"
      animate={
        landed && !reduceMotion
          ? { scale: [1, 1.06, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-primary/90" aria-hidden>
        +
      </span>
      <span className="tabular-nums tracking-tight">{display}</span>
    </motion.span>
  );
}

const statContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const STAT_ITEM_EASE = [0.22, 1, 0.36, 1] as const;

const statItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: STAT_ITEM_EASE },
  },
};

export function LandingStats() {
  const { ref, active } = useInViewOnce<HTMLElement>();
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative border-y border-border/50 bg-muted/25 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.96_0.02_48/0.35),transparent)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade">
          <h2 className="font-heading text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Notre engagement en chiffres
          </h2>
        </Reveal>

        <motion.div
          className="mt-12 flex flex-col divide-y divide-border/60 md:mt-14 md:flex-row md:divide-x md:divide-y-0"
          variants={statContainer}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
        >
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              variants={statItem}
              className="flex-1 px-2 py-8 first:pt-0 last:pb-0 md:px-6 md:py-4 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex flex-col items-center text-center md:min-h-30 md:justify-center">
                <p className="font-heading text-4xl font-semibold tabular-nums tracking-tight text-primary sm:text-5xl md:text-[3.25rem]">
                  <AnimatedNumber
                    value={s.value}
                    active={active}
                    startDelayMs={reduceMotion ? 0 : 180 + idx * 140}
                  />
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
