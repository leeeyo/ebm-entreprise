import type { Metadata } from "next";
import { Lock, ShieldCheck, Timer } from "lucide-react";
import { MetaViewContentTracker } from "@/components/analytics/meta-view-content-tracker";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { PageHero, TrustStrip } from "@/components/marketing";
import { AdvancedSimulator } from "@/components/simulateur/advanced-simulator";
import { simulateurPage } from "@/content/simulateur";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Simulateur de devis",
  description:
    "Estimez le budget de votre projet en 2 minutes avec un résultat indicatif à confirmer par une étude et un devis.",
  path: "/simulateur",
});

const TRUST_ITEMS = [
  { icon: Timer, label: "Estimation en 2 minutes", hint: "Formulaire requis pour recevoir le prix" },
  { icon: Lock, label: "Données encadrées", hint: "Consultez notre politique de confidentialité" },
  { icon: ShieldCheck, label: "Sans engagement", hint: "Estimation indicative, distincte d'un devis" },
];

export default function SimulateurPage() {
  return (
    <LazyMotionProvider>
      <MetaViewContentTracker
        contentId="simulateur:devis"
        contentName="Simulateur de devis EBM"
        contentCategory="simulateur"
      />

      <PageHero
        eyebrow="Simulateur EBM"
        title={simulateurPage.title}
        accent="Projet"
        subtitle={simulateurPage.subtitle}
        compact
      >
        <TrustStrip items={TRUST_ITEMS} variant="inline" />
      </PageHero>

      <section
        className="cv-auto mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16"
        style={{ containIntrinsicSize: "auto 1200px" }}
      >
        <AdvancedSimulator />
      </section>
    </LazyMotionProvider>
  );
}
