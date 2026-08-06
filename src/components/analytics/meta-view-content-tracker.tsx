"use client";

import { useEffect, useRef } from "react";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaViewContent } from "@/lib/meta-pixel";
import { useTrackingConsent } from "@/lib/tracking-consent";

type MetaViewContentTrackerProps = {
  contentId: string;
  contentName: string;
  contentCategory: string;
  value?: number;
};

export function MetaViewContentTracker({
  contentId,
  contentName,
  contentCategory,
  value,
}: MetaViewContentTrackerProps) {
  const firedKeyRef = useRef<string | null>(null);
  const consent = useTrackingConsent();

  useEffect(() => {
    if (consent !== "accepted") return;
    if (!isMetaPixelEnabled()) return;

    const key = `${contentCategory}:${contentId}`;
    if (firedKeyRef.current === key) return;
    firedKeyRef.current = key;

    const eventId = createMetaEventId("view_content");
    const payload = {
      contentId,
      contentName,
      contentCategory,
      value,
      eventId,
    };

    trackMetaViewContent(payload);
    sendMetaCapiClientEvent({
      eventName: "ViewContent",
      ...payload,
    });
  }, [consent, contentCategory, contentId, contentName, value]);

  return null;
}
