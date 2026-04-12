import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getResidenceCover } from "@/content/residence-covers";
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
        {projets.map((p) => {
          const cover = getResidenceCover(p.slug, p.title);
          return (
            <Link key={p.slug} href={`/projets/${p.slug}`}>
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-16/10 bg-muted">
                  {cover ? (
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-zinc-200 to-zinc-500 dark:from-zinc-800 dark:to-zinc-950" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <CardDescription>{p.shortDescription}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
