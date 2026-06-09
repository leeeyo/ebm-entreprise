import { isValidGaMeasurementId } from "@/lib/google-analytics";

const TRUE_VALUES = new Set(["1", "true", "yes"]);

function firstEnvValue(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function isGaTrackingDisabled(): boolean {
  const value = firstEnvValue("GA_DISABLED", "NEXT_PUBLIC_GA_DISABLED")?.toLowerCase();
  return TRUE_VALUES.has(value ?? "");
}

export function getGaMeasurementId(): string | undefined {
  return firstEnvValue("GA_MEASUREMENT_ID", "NEXT_PUBLIC_GA_MEASUREMENT_ID");
}

export function isGaDebugModeEnabled(): boolean {
  const value = firstEnvValue("GA_DEBUG", "NEXT_PUBLIC_GA_DEBUG")?.toLowerCase();
  return TRUE_VALUES.has(value ?? "");
}

export function isGoogleAnalyticsEnabled(): boolean {
  return isValidGaMeasurementId(getGaMeasurementId()) && !isGaTrackingDisabled();
}
