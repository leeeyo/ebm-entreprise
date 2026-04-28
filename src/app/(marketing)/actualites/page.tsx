import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bell, CalendarDays, FileText } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CtaBand, PageHero, TrustStrip } from "@/components/marketing";
import { Badge } from "@/components/ui/badge";
import { listBlogPosts } from "@/lib/cms-content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Actualités EBM Ben Mokhtar — chantiers, réalisations et informations entreprise.",
};

const TRUST_ITEMS = [
  {
    icon: Bell,
    label: "Aucun spam",
    hint: "Uniquement les annonces marquantes",
  },
  {
    icon: FileText,
    label: "Contenus courts",
    hint: "3 minutes de lecture max",
  },
  {
    icon: CalendarDays,
    label: "Rythme mensuel",
    hint: "Quand l'actualité l'exige",
  },
];

function formatDate(value?: string) {
  if (!value) return "Publication EBM";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium" }).format(new Date(value));
}

export default async function ActualitesPage() {
  const posts = await listBlogPosts({ publishedOnly: true });

  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Actualités"
        title="Nos histoires de chantier et conseils techniques."
        accent="techniques"
        subtitle="Chantiers livrés, nouveautés d'équipe et retours d'expérience — les publications EBM sont maintenant pilotées depuis le back-office."
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1200px" }}
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/actualites/${post.slug}`}
              className="group flex min-h-72 flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {(post.tags.length ? post.tags : ["Actualités"]).slice(0, 2).map((tag) => (
                  <Badge key={tag} variant={index === 0 ? "default" : "outline"}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="font-heading mt-4 text-2xl font-semibold tracking-tight">{post.title}</h2>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-primary">
                Lire l'article
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
            <FileText className="mx-auto size-10 text-primary" />
            <h2 className="font-heading mt-4 text-2xl font-semibold">Aucune actualité publiée.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Les articles passés en statut publié depuis l'administration apparaîtront automatiquement ici.
            </p>
          </div>
        ) : null}

        <div className="mt-12">
          <TrustStrip items={TRUST_ITEMS} variant="inline" />
        </div>
      </section>

      <CtaBand
        eyebrow="En attendant"
        title="Découvrez nos chantiers déjà livrés."
        body="Notre portfolio illustre mieux qu'un article la méthode EBM — prenez une minute pour le parcourir."
        primary={{ label: "Voir nos projets", href: "/projets" }}
        secondary={{ label: "Lancer le simulateur", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
