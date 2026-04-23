"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return true;
}

/**
 * Single source of truth for `prefers-reduced-motion` on the landing tree.
 * Returns `true` when it is safe to animate.
 */
export function useMotionOk(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
