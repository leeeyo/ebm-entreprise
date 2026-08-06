"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaPageView } from "@/lib/meta-pixel";
import { useTrackingConsent } from "@/lib/tracking-consent";

export function ThirdPartyAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useTrackingConsent();

  useEffect(() => {
    if (consent !== "accepted") return;
    if (!isMetaPixelEnabled()) return;
    if (pathname.startsWith("/admin")) return;

    const eventId = createMetaEventId("page_view");
    trackMetaPageView({ eventId });
    sendMetaCapiClientEvent({
      eventName: "PageView",
      eventId,
    });
  }, [consent, pathname, searchParams]);

  return null;
}
