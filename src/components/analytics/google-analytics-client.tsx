"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  initializeGoogleAnalytics,
  markGoogleAnalyticsScriptError,
  markGoogleAnalyticsScriptLoaded,
  trackGaPageView,
} from "@/lib/google-analytics";

type GoogleAnalyticsClientProps = {
  measurementId: string;
  debugMode?: boolean;
};

function buildPagePath(pathname: string | null, searchParams: { toString(): string }) {
  if (!pathname) return undefined;
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function GoogleAnalyticsClient({
  measurementId,
  debugMode = false,
}: GoogleAnalyticsClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPageRef = useRef<string | null>(null);
  const pagePath = useMemo(
    () => buildPagePath(pathname, searchParams),
    [pathname, searchParams],
  );

  useEffect(() => {
    initializeGoogleAnalytics({ measurementId, debugMode });
  }, [debugMode, measurementId]);

  useEffect(() => {
    if (!pagePath) return;

    const handle = window.setTimeout(() => {
      if (lastTrackedPageRef.current === pagePath) return;
      lastTrackedPageRef.current = pagePath;
      trackGaPageView(pagePath);
    }, 0);

    return () => window.clearTimeout(handle);
  }, [pagePath]);

  const bootstrap = `
(function(w,id,debugMode){
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function(){w.dataLayer.push(arguments);};
  var existing = w.__EBM_GA || {};
  w.__EBM_GA = {
    measurementId: id,
    disabled: false,
    debugMode: Boolean(debugMode),
    initialized: true,
    scriptLoaded: Boolean(existing.scriptLoaded),
    scriptLoadError: existing.scriptLoadError,
    lastPagePath: existing.lastPagePath,
    lastEventName: existing.lastEventName
  };
  if (!existing.initialized || existing.measurementId !== id) {
    w.gtag('js', new Date());
    w.gtag('config', id, Object.assign(
      { send_page_view: false },
      debugMode ? { debug_mode: true } : {}
    ));
  }
})(window, ${JSON.stringify(measurementId)}, ${JSON.stringify(debugMode)});
`;

  return (
    <>
      <Script id="ebm-ga-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="ebm-ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
        onLoad={markGoogleAnalyticsScriptLoaded}
        onReady={markGoogleAnalyticsScriptLoaded}
        onError={() => markGoogleAnalyticsScriptError("gtag.js failed to load")}
      />
    </>
  );
}
