import { BrandedMascotState } from "@/components/brand/mascot-state";

export default function MarketingLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <BrandedMascotState
        kind="loading"
        eyebrow="Préparation du chantier"
        title="EBM assemble la page."
        description="Les contenus, images et accès sont en cours de chargement."
        variant="compact"
      />
    </section>
  );
}
