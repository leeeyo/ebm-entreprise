import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Actualités EBM Ben Mokhtar — chantiers, réalisations et informations entreprise.",
};

export default function ActualitesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Actualités</h1>
      <p className="mt-4 text-muted-foreground">
        Les prochaines actualités seront publiées ici. En attendant, découvrez nos réalisations ou lancez une estimation.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/projets">Voir nos projets</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/simulateur">Simulateur</Link>
        </Button>
      </div>
    </div>
  );
}
