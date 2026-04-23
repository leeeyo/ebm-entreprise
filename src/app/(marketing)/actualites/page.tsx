import type { Metadata } from "next";
import { Bell, CalendarDays, FileText, Mail, Sparkles } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CtaBand, PageHero, TrustStrip } from "@/components/marketing";
import { Button } from "@/components/ui/button";

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

function DriftingCards() {
  return (
    <div
      className="relative mx-auto grid h-56 w-full max-w-xl place-items-center sm:h-64"
      aria-hidden
    >
      <div className="absolute left-[18%] top-6 w-40 sm:w-52">
        <div className="ebm-drift-a rounded-2xl border border-border/60 bg-card/80 p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <CalendarDays className="size-3.5" />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Mar 2026
            </span>
          </div>
          <p className="mt-3 h-2.5 w-3/4 rounded bg-foreground/15" />
          <p className="mt-2 h-2 w-11/12 rounded bg-foreground/10" />
          <p className="mt-1.5 h-2 w-2/3 rounded bg-foreground/10" />
        </div>
      </div>
      <div className="absolute right-[16%] top-10 w-40 sm:w-52">
        <div className="ebm-drift-b rounded-2xl border border-border/60 bg-card/80 p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Nouveau
            </span>
          </div>
          <p className="mt-3 h-2.5 w-5/6 rounded bg-foreground/15" />
          <p className="mt-2 h-2 w-10/12 rounded bg-foreground/10" />
          <p className="mt-1.5 h-2 w-1/2 rounded bg-foreground/10" />
        </div>
      </div>
      <div className="absolute left-1/2 top-24 w-48 -translate-x-1/2 sm:w-56">
        <div className="ebm-drift-c rounded-2xl border border-primary/30 bg-card p-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="size-3.5" />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
              À paraître
            </span>
          </div>
          <p className="mt-3 h-2.5 w-11/12 rounded bg-foreground/20" />
          <p className="mt-2 h-2 w-full rounded bg-foreground/10" />
          <p className="mt-1.5 h-2 w-5/6 rounded bg-foreground/10" />
          <p className="mt-1.5 h-2 w-3/4 rounded bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

export default function ActualitesPage() {
  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Actualités"
        title="Bientôt, nos histoires de chantier."
        accent="histoires"
        subtitle="Chantiers livrés, nouveautés d'équipe et retours d'expérience — les premières actualités EBM arrivent très prochainement."
      />

      <section
        className="cv-auto mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24"
        style={{ containIntrinsicSize: "auto 900px" }}
      >
        <DriftingCards />

        <div className="mt-12 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">
            Soyez les premiers informés
          </p>
          <h2 className="font-heading mt-3 text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Recevez nos prochaines publications.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Aucune actualité publiée pour le moment. Laissez-nous votre email pour
            être informé(e) dès la première sortie — rythme mensuel maximum.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            aria-label="Abonnement (bientôt disponible)"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="newsletter-email"
                type="email"
                placeholder="votre.email@exemple.tn"
                disabled
                className="w-full rounded-lg border border-border/70 bg-card/80 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-sm backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
            <Button size="lg" disabled className="shrink-0">
              Bientôt disponible
            </Button>
          </form>

          <div className="mt-10">
            <TrustStrip items={TRUST_ITEMS} variant="inline" />
          </div>
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
