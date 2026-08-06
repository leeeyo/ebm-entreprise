import { getMetaFbpFbcFromDocument } from "@/lib/meta-browser";
import { META_CURRENCY, type MetaContentParams } from "@/lib/meta-pixel";
import { hasTrackingConsent } from "@/lib/tracking-consent";

export type MetaCapiClientEventName =
  | "PageView"
  | "ViewContent"
  | "SimulationStarted"
  | "ContactFormStarted";

export type MetaClientContext = {
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
  consent: boolean;
};

export function createMetaEventId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}.${Date.now()}.${random}`;
}

export function getMetaClientContext(): MetaClientContext {
  const { fbp, fbc } = getMetaFbpFbcFromDocument();
  const eventSourceUrl =
    typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  return { fbp, fbc, eventSourceUrl, consent: hasTrackingConsent() };
}

export function sendMetaCapiClientEvent(input: {
  eventName: MetaCapiClientEventName;
  eventId: string;
} & MetaContentParams) {
  if (!hasTrackingConsent()) return;
  const meta = getMetaClientContext();

  void fetch("/api/meta/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      ...input,
      currency: input.currency ?? META_CURRENCY,
      meta,
    }),
  }).catch(() => {
    /* CAPI coverage is best-effort and must never block user interactions. */
  });
}
