import { sendGAEvent } from "@next/third-parties/google";

export const GA_CURRENCY = "TND";

export function isGaTrackingDisabled(): boolean {
  const value = process.env.NEXT_PUBLIC_GA_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined;
}

export function isGoogleAnalyticsEnabled(): boolean {
  return Boolean(getGaMeasurementId()) && !isGaTrackingDisabled();
}

type GaEventParams = Record<string, string | number | boolean | undefined | null>;

function compactParams(params?: GaEventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

/**
 * Thin wrapper around `sendGAEvent` from `@next/third-parties`. It is a no-op
 * unless GA is enabled and the gtag bootstrap (GoogleAnalytics component) has
 * mounted, so it is always safe to call from any client component.
 */
export function trackGaEvent(eventName: string, params?: GaEventParams): void {
  if (typeof window === "undefined") return;
  if (!isGoogleAnalyticsEnabled()) return;
  sendGAEvent("event", eventName, compactParams(params));
}

/** GA4 recommended `generate_lead` conversion event. */
export function trackGaGenerateLead(params: {
  value?: number;
  currency?: string;
  leadSource?: string;
} & GaEventParams): void {
  const { value, currency, leadSource, ...rest } = params;
  trackGaEvent("generate_lead", {
    ...rest,
    lead_source: leadSource,
    ...(typeof value === "number" && Number.isFinite(value)
      ? { value, currency: currency ?? GA_CURRENCY }
      : {}),
  });
}
