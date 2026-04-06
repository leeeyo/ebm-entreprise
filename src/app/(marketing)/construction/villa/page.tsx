import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chantierSteps,
  chantierStepsIntro,
  constructionVillaAccroche,
  constructionVillaHero,
  faqConstructionVilla,
  referencesSection,
  suiviSection,
} from "@/content/construction-villa";

export const metadata: Metadata = {
  title: "Construction villa",
  description:
    "Construction de villa en Tunisie : méthode EBM, gros œuvre, second œuvre et finitions — entreprise BTP Ben Mokhtar.",
};

export default function ConstructionVillaPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="rounded-2xl border bg-linear-to-br from-muted/60 to-background p-8 sm:p-12">
        <p className="text-sm font-medium text-primary">{constructionVillaHero.title}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{constructionVillaHero.tagline}</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">{constructionVillaAccroche}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/contact">{constructionVillaHero.cta}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/simulateur">Lancer le simulateur</Link>
          </Button>
        </div>
      </header>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">{chantierStepsIntro.title}</h2>
        <p className="mt-2 text-lg text-ebm-navy">{chantierStepsIntro.subtitle}</p>
        <p className="mt-4 max-w-3xl text-muted-foreground">{chantierStepsIntro.lead}</p>
        <ol className="mt-10 space-y-6">
          {chantierSteps.map((s, idx) => (
            <li key={s.title}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {idx + 1}. {s.title}
                  </CardTitle>
                  <CardDescription className="text-base text-foreground/90">{s.body}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 rounded-xl border bg-muted/30 p-8">
        <h2 className="text-xl font-semibold">{suiviSection.title}</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">{suiviSection.text}</p>
        <Button asChild className="mt-6">
          <Link href="/contact">{suiviSection.cta}</Link>
        </Button>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">{referencesSection.title}</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">{referencesSection.intro}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-4/3 overflow-hidden rounded-xl border bg-linear-to-br from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-950"
            >
              <div className="flex h-full items-end p-3 text-xs text-white drop-shadow">
                Exemple de villa — visuel placeholder
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">FAQ — Spécial construction maison</h2>
        <div className="mt-6 space-y-3">
          {faqConstructionVilla.map((item) => (
            <details key={item.q} className="rounded-lg border bg-card px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium">{item.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-3 rounded-xl border bg-card p-6">
        <Button asChild>
          <Link href="/contact">Obtenez votre devis</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">{suiviSection.cta}</Link>
        </Button>
      </div>
    </article>
  );
}
