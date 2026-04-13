"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "fade-up" | "fade" | "scale";

const variantHidden: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-6",
  fade: "opacity-0",
  scale: "opacity-0 scale-[0.97]",
};

const variantVisible: Record<RevealVariant, string> = {
  "fade-up": "opacity-100 translate-y-0",
  fade: "opacity-100",
  scale: "opacity-100 scale-100",
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay after entering view (ms), for staggered lists */
  delayMs?: number;
  /** Animation preset; ignored when prefers-reduced-motion */
  variant?: RevealVariant;
};

export function Reveal({ children, className, delayMs = 0, variant = "fade-up" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setVisible(true);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const v = variant;
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        visible ? variantVisible[v] : variantHidden[v],
        reducedMotion && "scale-100 opacity-100 translate-y-0",
        className,
      )}
      style={
        visible && !reducedMotion
          ? { transitionDelay: `${delayMs}ms` }
          : reducedMotion
            ? { transitionDelay: "0ms" }
            : undefined
      }
    >
      {children}
    </div>
  );
}
