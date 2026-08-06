"use client";

import { resetTrackingConsent } from "@/lib/tracking-consent";

export function TrackingPreferencesButton() {
  return (
    <button
      type="button"
      className="underline underline-offset-4"
      onClick={() => {
        resetTrackingConsent();
        window.location.reload();
      }}
    >
      Gérer les traceurs
    </button>
  );
}
