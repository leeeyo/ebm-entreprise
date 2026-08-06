"use client";

import { useSyncExternalStore } from "react";

export type TrackingConsent = "accepted" | "declined" | null;

const STORAGE_KEY = "ebm-tracking-consent-v1";
const CHANGE_EVENT = "ebm-tracking-consent-change";

export function getTrackingConsent(): TrackingConsent {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function hasTrackingConsent() {
  return getTrackingConsent() === "accepted";
}

export function setTrackingConsent(value: Exclude<TrackingConsent, null>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // The choice still applies to the current page through the change event.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetTrackingConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to remove when storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useTrackingConsent() {
  return useSyncExternalStore(subscribe, getTrackingConsent, () => null);
}
