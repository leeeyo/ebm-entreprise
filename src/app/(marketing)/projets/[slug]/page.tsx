import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Hammer, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  ImageBentoGrid,
  ProjectCard,
  ProjetCover,
  SectionHeading,
} from "@/components/marketing";
import { bento } from "@/content/media";
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
  const idx = projets.findIndex((x) => x.slug === slug);
  const p = projets[idx];
  if (!p) {
    notFound();
  }

  const cover = getResidenceCover(p.slug, p.title);
  const next = projets[(idx + 1) % projets.length];
  const nextCover = getResidenceCover(next.slug, next.title);

  return (
    <LazyMotionProvider>
      {cover ? (
        <ProjetCover
          src={cover.src}
          alt={cover.alt}
          title={p.title}
          breadcrumb={{ href: "/projets", label: "Nos projets" }}
        />
      ) : (
        <section className="flex min-h-[22rem] items-end bg-linear-to-br from-zinc-300 to-zinc-700 px-4 pb-10 sm:px-6 dark:from-zinc-800 dark:to-zinc-950">
          <div className="mx-auto w-full max-w-6xl">
            <Link
              href="/projets"
              className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm"
            >
              ← Nos projets
            </Link>
            <h1 className="font-heading text-balance text-3xl font-semibold text-white sm:text-4xl">
              {p.title}
            </h1>
          </div>
        </section>
      )}

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 800px" }}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-14">
          <div className="min-w-0 space-y-6 text-pretty leading-relaxed text-foreground/90">
            <p className="text-lg text-muted-foreground">{p.shortDescription}</p>
            <p>
              Chantier résidentiel accompagné par EBM Ben Mokhtar, avec un pilotage
              complet du gros œuvre au second œuvre. Notre équipe coordonne les
              corps d&apos;état sur un planning partagé pour sécuriser la qualité
              et les délais.
            </p>
            <p className="text-sm text-muted-foreground">
              Contenu enrichi prochainement : galerie chantier, vidéo de livraison
              et fiche technique complète.
            </p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Fiche projet
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
                    aria-hidden
                  >
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Localisation
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">Tunisie</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
                    aria-hidden
                  >
                    <Hammer className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Typologie
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">Résidentiel</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
                    aria-hidden
                  >
                    <CalendarDays className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Statut
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">Livré</dd>
                  </div>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                Discuter d&apos;un projet similaire
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="cv-auto border-t bg-muted/10 py-16 sm:py-20"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Galerie"
            title="Quelques regards sur l'ouvrage."
            subtitle="Structures, volumes, finitions — la réalité du chantier en images."
          />
          <div className="mt-10">
            <ImageBentoGrid images={bento.projetGallery} />
          </div>
        </div>
      </section>

      {next ? (
        <section
          className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
          style={{ containIntrinsicSize: "auto 700px" }}
        >
          <SectionHeading
            eyebrow="Continuer la visite"
            title="Projet suivant"
            link={{ href: "/projets", label: "Tous les projets" }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <ProjectCard
              item={{
                slug: next.slug,
                title: next.title,
                description: next.shortDescription,
                image: nextCover
                  ? { src: nextCover.src, alt: nextCover.alt }
                  : undefined,
                tag: "Projet suivant",
              }}
              aspect="16/10"
            />
            <Link
              href="/projets"
              className="group relative flex min-h-[18rem] items-end overflow-hidden rounded-3xl border border-border/55 bg-muted/40 p-8 transition-colors duration-300 hover:border-primary/30 sm:min-h-0"
            >
              <div className="relative z-10">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">
                  Voir plus
                </p>
                <h3 className="font-heading mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  Explorer toutes nos réalisations
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Parcourir le portfolio
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow="Un projet similaire ?"
        title="Parlons de votre prochain chantier."
        body="Villa, immeuble, rénovation — chaque projet commence par une première conversation claire."
        primary={{ label: "Demander un devis", href: "/contact" }}
        secondary={{ label: "Estimer mon budget", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
