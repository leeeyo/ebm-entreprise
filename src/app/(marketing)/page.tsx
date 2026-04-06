import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSection } from "@/components/home/hero-section";
import { MasonryGallery } from "@/components/home/masonry-gallery";
import { Reveal } from "@/components/home/reveal";
import { StatCounters } from "@/components/home/stat-counters";
import {
  domaines,
  pourquoiIntro,
  pourquoiPillars,
  simulateurTeaser,
  temoignages,
} from "@/content/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EBM Ben Mokhtar — Construction & génie civil en Tunisie",
  description:
    "Entreprise de construction Tunisie : gros œuvre, projets clé en main, rénovation. Estimez votre budget avec notre simulateur — prix construction m² Tunisie (indicatif).",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Nos domaines d&apos;intervention
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {domaines.map((d, idx) => (
              <Reveal key={d.title} delayMs={idx * 70}>
                <Card className="h-full border-muted-foreground/15 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium leading-snug">{d.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{d.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatCounters />

      <section className="border-t bg-muted/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Pourquoi choisir l&apos;Entreprise Ben Mokhtar ?
            </h2>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{pourquoiIntro}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pourquoiPillars.map((p, idx) => (
              <Reveal key={p.title} delayMs={idx * 60}>
                <Card className="h-full transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">{p.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-foreground/90">{p.body}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MasonryGallery />

      <section className="border-t py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Ce que nos clients disent de nous
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {temoignages.map((t, idx) => (
              <Reveal key={t.author} delayMs={idx * 80}>
                <figure className="h-full rounded-xl border border-l-4 border-l-primary bg-card p-6 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <blockquote className="text-sm leading-relaxed text-foreground/90">
                    « {t.quote} »
                  </blockquote>
                  <figcaption className="mt-4 text-xs font-medium tracking-wide text-muted-foreground">
                    — {t.author}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ebm-teaser-bg border-t py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <Reveal>
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {simulateurTeaser.title}
                </h2>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
                  {simulateurTeaser.text}
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={100} className="flex md:justify-end">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Link href="/simulateur">{simulateurTeaser.cta}</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
