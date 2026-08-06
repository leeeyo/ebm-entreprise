"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTrackingConsent, useTrackingConsent } from "@/lib/tracking-consent";

export function TrackingConsentBanner() {
  const consent = useTrackingConsent();
  if (consent !== null) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-4xl rounded-3xl border border-white/10 bg-ebm-navy p-4 text-white shadow-2xl shadow-black/30 sm:bottom-5 sm:p-5"
      aria-label="Choix des traceurs"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-heading font-semibold">Votre choix concernant la mesure d'audience</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
              Avec votre accord, Google Analytics et Meta nous aident à mesurer l'utilisation du site et les
              campagnes. Vous pouvez continuer sans ces traceurs. Consultez la{" "}
              <Link href="/confidentialite" className="underline underline-offset-4 hover:text-white">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => setTrackingConsent("declined")}
          >
            Continuer sans mesure
          </Button>
          <Button type="button" onClick={() => setTrackingConsent("accepted")}>
            Tout accepter
          </Button>
        </div>
      </div>
    </aside>
  );
}
