import { BrandedMascotState } from "@/components/brand/mascot-state";

export default function AdminLoading() {
  return (
    <BrandedMascotState
      kind="loading"
      eyebrow="Salle des opérations"
      title="Chargement du tableau de bord."
      description="EBM synchronise les leads, contenus et paramètres du site."
      variant="compact"
    />
  );
}
