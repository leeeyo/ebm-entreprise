import { BrandedMascotState } from "@/components/brand/mascot-state";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <BrandedMascotState
          kind="forbidden"
          eyebrow="Accès réservé"
          title="Cette zone est protégée."
          description="Certaines zones du site sont réservées à l'équipe EBM. Connectez-vous avec un compte autorisé ou revenez au site public."
          primaryAction={{ label: "Connexion admin", href: "/admin/login" }}
          secondaryAction={{ label: "Retour au site", href: "/" }}
          imagePriority
        />
      </div>
    </main>
  );
}
