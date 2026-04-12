import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getResidenceCover } from "@/content/residence-covers";
import { projets } from "@/content/projets";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projets.find((x) => x.slug === slug);
  if (!p) return { title: "Projet" };
  return {
    title: p.title,
    description: p.shortDescription,
  };
}

export default async function ProjetDetailPage({ params }: Props) {
  const { slug } = await params;
  const p = projets.find((x) => x.slug === slug);
  if (!p) {
    notFound();
  }

  const cover = getResidenceCover(p.slug, p.title);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative aspect-21/9 overflow-hidden rounded-2xl border bg-muted">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[12rem] items-end bg-linear-to-br from-zinc-200 to-zinc-600 p-6 text-sm text-white dark:from-zinc-800 dark:to-zinc-950">
            Visuel projet à venir
          </div>
        )}
      </div>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">{p.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{p.shortDescription}</p>
      <section className="mt-10 space-y-4 text-muted-foreground">
        <p>
          Fiche projet (Copy 0) : contenu détaillé, galerie chantier et références seront enrichis depuis le back-office
          (photos WebP, textes, SEO).
        </p>
        <p>
          Mots-clés : entreprise de construction Tunisie, bâtiment, génie civil, entreprise BTP Ben Mokhtar, réalisation
          résidentielle.
        </p>
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact">Demander un devis</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projets">Retour aux projets</Link>
        </Button>
      </div>
    </div>
  );
}
