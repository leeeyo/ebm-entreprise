export const META_CURRENCY = "TND";

type MetaFbq = {
  (action: "init", pixelId: string, userData?: Record<string, string | undefined>): void;
  (action: "set", key: string, value: unknown, pixelId?: string): void;
  (
    action: "track" | "trackCustom",
    event: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string },
  ): void;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: MetaFbq;
    _fbq?: unknown;
  }
}

export type MetaAdvancedMatching = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  zp?: string;
  country?: string;
  db?: string;
  external_id?: string;
  fb_login_id?: string;
};

export type MetaContentParams = {
  contentId?: string;
  contentIds?: string[];
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
};

export function isMetaTrackingDisabled(): boolean {
  const value = process.env.NEXT_PUBLIC_META_TRACKING_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function isMetaPixelEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()) && !isMetaTrackingDisabled();
}

function getPixelId(): string | undefined {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || undefined;
}

export function getFbq(): MetaFbq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.fbq;
}

function normEmail(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  return trimmed || undefined;
}

function normName(value: string | null | undefined): string | undefined {
  const trimmed = value
    ?.trim()
    .toLowerCase()
    .replace(/[\s.'"`,-]+/g, "");
  return trimmed || undefined;
}

function normPhoneDigits(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.length === 8 ? `216${digits}` : digits;
}

function normLocality(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase().replace(/\s+/g, "");
  return trimmed || undefined;
}

function normCountry(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  return trimmed && /^[a-z]{2}$/.test(trimmed) ? trimmed : undefined;
}

function normDob(value: string | null | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const raw = value.trim();

  if (/^\d{8}$/.test(raw)) return raw;

  const ymd = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const [, y, m, d] = ymd;
    return `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
  }

  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const day = d.padStart(2, "0");
    const month = m.padStart(2, "0");
    if (Number(day) >= 1 && Number(day) <= 31 && Number(month) >= 1 && Number(month) <= 12) {
      return `${y}${month}${day}`;
    }
  }

  return undefined;
}

export function buildMetaAdvancedMatching(input: {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  dob?: string | null;
  externalId?: string | null;
  fbLoginId?: string | null;
}): MetaAdvancedMatching {
  const out: MetaAdvancedMatching = {};
  const em = normEmail(input.email);
  if (em) out.em = em;
  const ph = normPhoneDigits(input.phone);
  if (ph) out.ph = ph;
  const fn = normName(input.firstName);
  if (fn) out.fn = fn;
  const ln = normName(input.lastName);
  if (ln) out.ln = ln;
  const ct = normLocality(input.city);
  if (ct) out.ct = ct;
  const st = normLocality(input.state);
  if (st) out.st = st;
  const zp = normLocality(input.zip);
  if (zp) out.zp = zp;
  const country = normCountry(input.country);
  if (country) out.country = country;
  const db = normDob(input.dob);
  if (db) out.db = db;
  const externalId = input.externalId?.trim();
  if (externalId) out.external_id = externalId;
  const fbLoginId = input.fbLoginId?.trim();
  if (fbLoginId) out.fb_login_id = fbLoginId;
  return out;
}

export function reinitMetaPixelWithAdvancedMatching(userData: MetaAdvancedMatching): void {
  const fbq = getFbq();
  const pixelId = getPixelId();
  if (!fbq || !pixelId || Object.keys(userData).length === 0) return;
  fbq("init", pixelId, userData as Record<string, string | undefined>);
}

function compactPayload(input: MetaContentParams): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ...input.customData,
  };
  const contentIds = input.contentIds ?? (input.contentId ? [input.contentId] : undefined);
  if (contentIds?.length) payload.content_ids = contentIds;
  if (input.contentName) payload.content_name = input.contentName;
  if (input.contentCategory) payload.content_category = input.contentCategory;
  if (typeof input.value === "number" && Number.isFinite(input.value)) {
    payload.value = input.value;
    payload.currency = input.currency ?? META_CURRENCY;
  }
  return payload;
}

export function trackMetaPageView(params?: { eventId?: string }): void {
  const fbq = getFbq();
  if (!fbq) return;
  if (params?.eventId) {
    fbq("track", "PageView", {}, { eventID: params.eventId });
    return;
  }
  fbq("track", "PageView");
}

export function trackMetaViewContent(params: MetaContentParams): void {
  const fbq = getFbq();
  if (!fbq) return;
  const payload = compactPayload(params);
  if (params.eventId) {
    fbq("track", "ViewContent", payload, { eventID: params.eventId });
    return;
  }
  fbq("track", "ViewContent", payload);
}

export function trackMetaLead(params: MetaContentParams & { eventId: string }): void {
  const fbq = getFbq();
  if (!fbq) return;
  fbq("track", "Lead", compactPayload(params), { eventID: params.eventId });
}

export function trackMetaContact(params: MetaContentParams & { eventId: string }): void {
  const fbq = getFbq();
  if (!fbq) return;
  fbq("track", "Contact", compactPayload(params), { eventID: params.eventId });
}

export function trackMetaCustom(
  eventName: "SimulationStarted" | "ContactFormStarted",
  params: MetaContentParams & { eventId: string },
): void {
  const fbq = getFbq();
  if (!fbq) return;
  fbq("trackCustom", eventName, compactPayload(params), { eventID: params.eventId });
}
