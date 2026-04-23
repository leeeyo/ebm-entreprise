import type { Metadata } from "next";
import { Lock, ShieldCheck, Timer } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { PageHero, TrustStrip } from "@/components/marketing";
import { SimulateurWizard } from "@/components/simulateur/simulateur-wizard";
import { simulateurPage } from "@/content/simulateur";

export const metadata: Metadata = {
  title: "Simulateur de devis",
  description:
    "Estimez le budget de votre projet en 2 minutes — coûts indicatifs basés sur le marché tunisien 2026.",
};

const TRUST_ITEMS = [
  { icon: Timer, label: "Estimation en 2 minutes", hint: "Aucune inscription requise" },
  { icon: Lock, label: "Confidentiel", hint: "Vos données ne sont ni stockées ni partagées" },
  { icon: ShieldCheck, label: "Sans engagement", hint: "Résultat gratuit et immédiat" },
];

export default function SimulateurPage() {
  return (
    <LazyMotionProvider>
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
        className="cv-auto mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
        style={{ containIntrinsicSize: "auto 1200px" }}
      >
        <SimulateurWizard />
      </section>
    </LazyMotionProvider>
  );
}
