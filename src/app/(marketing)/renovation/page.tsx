import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingInnerPage } from "@/components/templates/marketing-inner-page";

export const metadata: Metadata = {
  title: "Rénovation",
  description:
    "Rénovation maison, appartement et salles de bain en Tunisie — diagnostic, phasage et finitions EBM Ben Mokhtar.",
};

const pages = [
  {
    href: "/renovation/maison-appartement",
    title: "Rénovation maison et appartement",
    description:
      "Réhabilitation complète ou partielle : restructuration, second œuvre et respect de l’existant.",
  },
  {
    href: "/renovation/salle-de-bain",
    title: "Rénovation salle de bain",
    description:
      "Étanchéité, réseaux, agencement et finitions pour une salle de bain durable et confortable.",
  },
] as const;

export default function RenovationHubPage() {
  return (
    <MarketingInnerPage
      h1="Rénovation"
      intro="Valorisez votre bien avec des travaux maîtrisés : nous sécurisons l’existant, phasons les interventions et coordonnons les corps de métier."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {pages.map((p) => (
          <Link key={p.href} href={p.href} className="block transition-[transform,box-shadow] hover:-translate-y-0.5">
            <Card className="h-full hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{p.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </MarketingInnerPage>
  );
}
