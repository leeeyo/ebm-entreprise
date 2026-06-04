import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { getGaMeasurementId, isGoogleAnalyticsEnabled } from "@/lib/google-analytics";

/**
 * Loads the GA4 gtag.js tag via the official @next/third-parties component
 * (deferred, non-blocking, Core Web Vitals friendly). Automatic pageview
 * tracking on client-side navigations is handled by the component itself.
 *
 * Mounted only inside the (marketing) route group so the admin back-office is
 * never tracked, mirroring the Meta Pixel setup.
 */
export function GoogleAnalytics() {
  const gaId = getGaMeasurementId();
  if (!gaId || !isGoogleAnalyticsEnabled()) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
