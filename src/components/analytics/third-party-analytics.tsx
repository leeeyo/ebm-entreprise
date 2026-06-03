"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaPageView } from "@/lib/meta-pixel";

export function ThirdPartyAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isMetaPixelEnabled()) return;
    if (pathname.startsWith("/admin")) return;

    const eventId = createMetaEventId("page_view");
    trackMetaPageView({ eventId });
    sendMetaCapiClientEvent({
      eventName: "PageView",
      eventId,
    });
  }, [pathname, searchParams]);

  return null;
}
