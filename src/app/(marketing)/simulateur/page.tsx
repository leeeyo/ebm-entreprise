import type { Metadata } from "next";
import { SimulateurWizard } from "@/components/simulateur/simulateur-wizard";
import { simulateurPage } from "@/content/simulateur";

export const metadata: Metadata = {
  title: "Simulateur de devis",
  description:
    "Estimez le budget de votre projet en 2 minutes — coûts indicatifs basés sur le marché tunisien 2026.",
};

export default function SimulateurPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{simulateurPage.title}</h1>
        <p className="text-muted-foreground">{simulateurPage.subtitle}</p>
        <p className="text-sm font-medium text-ebm-navy">{simulateurPage.reassurance}</p>
      </header>
      <SimulateurWizard />
    </div>
  );
}
