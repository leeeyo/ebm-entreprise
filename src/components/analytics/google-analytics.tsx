import { Suspense } from "react";
import { ConsentAwareGoogleAnalytics } from "@/components/analytics/consent-aware-google-analytics";
import { isValidGaMeasurementId } from "@/lib/google-analytics";
import {
  getGaMeasurementId,
  isGaDebugModeEnabled,
  isGaTrackingDisabled,
} from "@/lib/google-analytics-env";

/**
 * Loads the GA4 gtag.js tag with an explicit local bootstrap. Pageviews are
 * sent by the client component on App Router URL changes so production tracking
 * does not depend on GA4 Enhanced Measurement settings.
 *
 * Mounted only inside the (marketing) route group so the admin back-office is
 * never tracked, mirroring the Meta Pixel setup.
 */
export function GoogleAnalytics() {
  const gaId = getGaMeasurementId();
  if (!isValidGaMeasurementId(gaId) || isGaTrackingDisabled()) return null;

  return (
    <Suspense fallback={null}>
      <ConsentAwareGoogleAnalytics measurementId={gaId} debugMode={isGaDebugModeEnabled()} />
    </Suspense>
  );
}
