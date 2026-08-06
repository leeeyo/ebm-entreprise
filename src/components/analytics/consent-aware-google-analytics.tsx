"use client";

import { GoogleAnalyticsClient } from "@/components/analytics/google-analytics-client";
import { useTrackingConsent } from "@/lib/tracking-consent";

export function ConsentAwareGoogleAnalytics({
  measurementId,
  debugMode,
}: {
  measurementId: string;
  debugMode: boolean;
}) {
  const consent = useTrackingConsent();
  return consent === "accepted" ? (
    <GoogleAnalyticsClient measurementId={measurementId} debugMode={debugMode} />
  ) : null;
}
