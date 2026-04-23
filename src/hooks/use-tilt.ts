"use client";

import { useEffect, useRef } from "react";
import { useMotionOk } from "./use-motion-ok";

type Options = {
  /** Max rotation in degrees on either axis. */
  max?: number;
  /** Additional scale applied on hover (1 = none). */
  scale?: number;
};

/**
 * 3D pointer-tilt applied directly to `transform` via a single RAF tick.
 * Skips coarse-pointer (touch) devices and reduced-motion users.
 */
export function useTilt<T extends HTMLElement>({ max = 6, scale = 1 }: Options = {}) {
  const ref = useRef<T | null>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ rx: 0, ry: 0 });
  const motionOk = useMotionOk();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOk) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    el.style.transformStyle = "preserve-3d";

    const apply = () => {
      rafRef.current = null;
      const node = ref.current;
      if (!node) return;
      const { rx, ry } = target.current;
      node.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      target.current = {
        rx: (0.5 - py) * max * 2,
        ry: (px - 0.5) * max * 2,
      };
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      target.current = { rx: 0, ry: 0 };
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      el.style.transform = "";
    };
  }, [motionOk, max, scale]);

  return ref;
}
