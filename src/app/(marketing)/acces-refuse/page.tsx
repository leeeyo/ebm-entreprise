import type { Metadata } from "next";
import { BrandedMascotState } from "@/components/brand/mascot-state";

export const metadata: Metadata = {
  title: "Accès refusé",
  description: "Zone réservée EBM Ben Mokhtar.",
};

export default function AccessRefusedPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <BrandedMascotState
        kind="forbidden"
        eyebrow="Accès refusé"
        title="Badge requis pour entrer."
        description="Cette partie du chantier digital est réservée à l'équipe EBM. Le site public reste ouvert pour découvrir les services, projets et le simulateur."
        primaryAction={{ label: "Découvrir les services", href: "/services" }}
        secondaryAction={{ label: "Connexion admin", href: "/admin/login" }}
        imagePriority
      />
    </section>
  );
}
