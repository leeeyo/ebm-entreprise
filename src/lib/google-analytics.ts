export const GA_CURRENCY = "TND";

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

type GtagCommand = [command: string, ...args: unknown[]];
type GaEventParams = Record<string, string | number | boolean | undefined | null>;

export type GoogleAnalyticsClientState = {
  measurementId?: string;
  disabled: boolean;
  debugMode: boolean;
  initialized: boolean;
  scriptLoaded: boolean;
  scriptLoadError?: string;
  lastPagePath?: string;
  lastEventName?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagCommand) => void;
    __EBM_GA?: GoogleAnalyticsClientState;
  }
}

export function isValidGaMeasurementId(measurementId: string | undefined): measurementId is string {
  return Boolean(measurementId && GA_MEASUREMENT_ID_PATTERN.test(measurementId));
}

function compactParams(params?: GaEventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer ?? [];
}

function ensureGtag() {
  ensureDataLayer();
  window.gtag =
    window.gtag ??
    function gtag() {
      window.dataLayer?.push(arguments);
    };
}

function getClientGaState(): GoogleAnalyticsClientState | undefined {
  if (typeof window === "undefined") return undefined;
  return window.__EBM_GA;
}

function isClientGoogleAnalyticsEnabled(): boolean {
  const state = getClientGaState();
  return Boolean(state?.measurementId && !state.disabled);
}

function getClientMeasurementId(): string | undefined {
  return getClientGaState()?.measurementId;
}

function dispatchGtag(...args: GtagCommand) {
  ensureGtag();
  window.gtag?.(...args);
}

export function initializeGoogleAnalytics({
  measurementId,
  debugMode = false,
}: {
  measurementId: string;
  debugMode?: boolean;
}) {
  if (typeof window === "undefined") return;
  if (!isValidGaMeasurementId(measurementId)) return;

  const existing = window.__EBM_GA;
  window.__EBM_GA = {
    measurementId,
    disabled: false,
    debugMode,
    initialized: true,
    scriptLoaded: existing?.scriptLoaded ?? false,
    scriptLoadError: existing?.scriptLoadError,
    lastPagePath: existing?.lastPagePath,
    lastEventName: existing?.lastEventName,
  };

  ensureGtag();

  if (existing?.initialized && existing.measurementId === measurementId) return;

  dispatchGtag("js", new Date());
  dispatchGtag("config", measurementId, {
    send_page_view: false,
    ...(debugMode ? { debug_mode: true } : {}),
  });
}

export function disableGoogleAnalyticsClient() {
  if (typeof window === "undefined") return;
  window.__EBM_GA = {
    measurementId: window.__EBM_GA?.measurementId,
    disabled: true,
    debugMode: window.__EBM_GA?.debugMode ?? false,
    initialized: window.__EBM_GA?.initialized ?? false,
    scriptLoaded: window.__EBM_GA?.scriptLoaded ?? false,
    scriptLoadError: window.__EBM_GA?.scriptLoadError,
    lastPagePath: window.__EBM_GA?.lastPagePath,
    lastEventName: window.__EBM_GA?.lastEventName,
  };
}

export function markGoogleAnalyticsScriptLoaded() {
  if (typeof window === "undefined") return;
  window.__EBM_GA = {
    measurementId: window.__EBM_GA?.measurementId,
    disabled: window.__EBM_GA?.disabled ?? false,
    debugMode: window.__EBM_GA?.debugMode ?? false,
    initialized: window.__EBM_GA?.initialized ?? false,
    scriptLoaded: true,
    scriptLoadError: undefined,
    lastPagePath: window.__EBM_GA?.lastPagePath,
    lastEventName: window.__EBM_GA?.lastEventName,
  };
}

export function markGoogleAnalyticsScriptError(error: string) {
  if (typeof window === "undefined") return;
  window.__EBM_GA = {
    measurementId: window.__EBM_GA?.measurementId,
    disabled: window.__EBM_GA?.disabled ?? false,
    debugMode: window.__EBM_GA?.debugMode ?? false,
    initialized: window.__EBM_GA?.initialized ?? false,
    scriptLoaded: false,
    scriptLoadError: error,
    lastPagePath: window.__EBM_GA?.lastPagePath,
    lastEventName: window.__EBM_GA?.lastEventName,
  };
}

export function trackGaPageView(pagePath: string): void {
  if (typeof window === "undefined") return;
  if (!isClientGoogleAnalyticsEnabled()) return;
  const measurementId = getClientMeasurementId();
  if (!measurementId) return;

  dispatchGtag("event", "page_view", {
    send_to: measurementId,
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });

  if (window.__EBM_GA) {
    window.__EBM_GA.lastPagePath = pagePath;
    window.__EBM_GA.lastEventName = "page_view";
  }
}

/**
 * Thin wrapper around the gtag dataLayer. It is a no-op unless the GA bootstrap
 * has mounted, but once mounted it queues events even if gtag.js is still loading.
 */
export function trackGaEvent(eventName: string, params?: GaEventParams): void {
  if (typeof window === "undefined") return;
  if (!isClientGoogleAnalyticsEnabled()) return;
  const measurementId = getClientMeasurementId();
  if (!measurementId) return;

  dispatchGtag("event", eventName, {
    send_to: measurementId,
    ...compactParams(params),
  });

  if (window.__EBM_GA) {
    window.__EBM_GA.lastEventName = eventName;
  }
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
