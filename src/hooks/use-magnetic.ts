"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionOk } from "./use-motion-ok";

type Options = {
  /** Max pixel offset the element can travel toward the pointer. */
  strength?: number;
  /** Radius in px past which the pointer stops pulling the element. */
  radius?: number;
};

/**
 * Pointer-follow transform. Mutates the ref'd element's `transform`
 * inside a single RAF tick; releases on pointerleave/blur.
 *
 * Pointer coarse (touch) devices are skipped — there is no hover.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 14,
  radius = 140,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const motionOk = useMotionOk();

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    targetRef.current = { x: 0, y: 0 };
    el.style.transform = "";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOk) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        targetRef.current = { x: 0, y: 0 };
      } else {
        const pull = 1 - dist / radius;
        targetRef.current = {
          x: (dx / radius) * strength * pull,
          y: (dy / radius) * strength * pull,
        };
      }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const node = ref.current;
          if (!node) return;
          const { x, y } = targetRef.current;
          node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        });
      }
    };

    const onLeave = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      reset();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("blur", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("blur", onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      reset();
    };
  }, [motionOk, radius, strength, reset]);

  return ref;
}
