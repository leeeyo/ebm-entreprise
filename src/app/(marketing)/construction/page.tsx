import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingInnerPage } from "@/components/templates/marketing-inner-page";

export const metadata: Metadata = {
  title: "Construction",
  description:
    "Construction de villas et programmes immeubles & résidences en Tunisie — méthode EBM Ben Mokhtar.",
};

const pages = [
  {
    href: "/construction/villa",
    title: "Construction villa",
    description:
      "Du gros œuvre aux finitions : villas sur mesure, suivi de chantier et références qualité.",
  },
  {
    href: "/construction/immeubles-residences",
    title: "Construction Immeubles & résidences",
    description:
      "Programmes collectifs, coordination technique et livraison conforme aux exigences du projet.",
  },
] as const;

export default function ConstructionHubPage() {
  return (
    <MarketingInnerPage
      h1="Construction"
      intro="EBM accompagne vos projets neufs : villas individuelles et programmes résidentiels, avec une exécution structurée du gros œuvre au second œuvre."
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
