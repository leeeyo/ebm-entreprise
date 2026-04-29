import { BrandedMascotState } from "@/components/brand/mascot-state";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <BrandedMascotState
          kind="404"
          eyebrow="Zone non trouvée"
          title="Cette page n'est plus sur le plan."
          description="Le lien demandé ne correspond à aucune page publiée. Revenez vers les accès principaux ou consultez les réalisations EBM."
          primaryAction={{ label: "Retour à l'accueil", href: "/" }}
          secondaryAction={{ label: "Voir nos projets", href: "/projets" }}
          imagePriority
        />
      </div>
    </main>
  );
}
