"use client";

import { useEffect, useRef } from "react";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaViewContent } from "@/lib/meta-pixel";

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

  useEffect(() => {
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
  }, [contentCategory, contentId, contentName, value]);

  return null;
}
