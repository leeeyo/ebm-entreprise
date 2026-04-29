import { BrandedMascotState } from "@/components/brand/mascot-state";

export default function MarketingNotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <BrandedMascotState
        kind="lost"
        eyebrow="Repérage impossible"
        title="Cette référence n'est pas publiée."
        description="Le contenu demandé a peut-être changé de slug, été masqué ou n'existe pas encore dans le back-office."
        primaryAction={{ label: "Voir nos projets", href: "/projets" }}
        secondaryAction={{ label: "Retour à l'accueil", href: "/" }}
        imagePriority
      />
    </section>
  );
}
