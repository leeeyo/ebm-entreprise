import type { Metadata } from "next";
import { Building2, DraftingCompass, Handshake, ListChecks } from "lucide-react";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CtaBand, PageHero, SectionHeading } from "@/components/marketing";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "À propos",
  description:
    "Découvrez l'approche EBM Ben Mokhtar pour accompagner les projets de construction, de rénovation et d'aménagement en Tunisie.",
  path: "/a-propos",
});

const PRINCIPLES = [
  {
    icon: DraftingCompass,
    title: "Un cadrage clair",
    text: "Comprendre le besoin, les contraintes du terrain et le périmètre attendu avant d'engager les travaux.",
  },
  {
    icon: ListChecks,
    title: "Une méthode lisible",
    text: "Organiser les étapes, les interfaces techniques et les décisions qui structurent l'avancement du projet.",
  },
  {
    icon: Handshake,
    title: "Un échange direct",
    text: "Partager les informations utiles et signaler les ajustements nécessaires au fil du chantier.",
  },
] as const;

export default function AProposPage() {
  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="EBM Ben Mokhtar"
        title="Construire avec une méthode claire."
        accent="méthode claire."
        subtitle="EBM accompagne des projets de construction, de rénovation et d'aménagement en Tunisie, depuis la première lecture du besoin jusqu'au suivi des travaux convenus."
        ctas={[
          { label: "Parler de mon projet", href: "/contact" },
          { label: "Voir nos réalisations", href: "/projets", variant: "outline" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-ebm-navy text-white">
              <Building2 className="size-5" aria-hidden />
            </span>
            <SectionHeading
              eyebrow="Notre approche"
              title="De la rigueur à chaque étape."
              subtitle="Les moyens, intervenants et prestations sont définis selon la nature et le périmètre de chaque projet."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Votre projet"
        title="Commençons par les bonnes questions."
        body="Décrivez le type de travaux, la localisation et vos principales contraintes pour préparer un premier échange utile."
        primary={{ label: "Contacter EBM", href: "/contact" }}
        secondary={{ label: "Lancer le simulateur", href: "/simulateur" }}
      />
    </LazyMotionProvider>
  );
}
