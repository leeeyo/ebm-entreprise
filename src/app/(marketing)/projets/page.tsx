import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projets } from "@/content/projets";

export const metadata: Metadata = {
  title: "Nos projets",
  description:
    "Résidences et réalisations EBM Ben Mokhtar — construction résidentielle et projets clé en main en Tunisie.",
};

export default function ProjetsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Nos projets</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Une sélection de références résidentielles. Chaque fiche présente le périmètre et les enjeux du projet.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projets.map((p) => (
          <Link key={p.slug} href={`/projets/${p.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="aspect-16/10 bg-linear-to-br from-zinc-200 to-zinc-500 dark:from-zinc-800 dark:to-zinc-950" />
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription>{p.shortDescription}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
