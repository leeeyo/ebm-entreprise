"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wrap motion-heavy trees so framer-motion features are loaded once and
 * the bundle ships only `domAnimation`. Components inside this tree must
 * use `m.*` from `framer-motion` (not `motion.*`) to benefit from the split.
 */
export function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
