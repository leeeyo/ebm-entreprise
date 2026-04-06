import type { Metadata } from "next";
import { GenericMarketingPage } from "@/components/templates/generic-marketing-page";

export const metadata: Metadata = {
  title: "Construction Immeubles & résidences",
  description:
    "Programmes résidentiels en Tunisie : gros œuvre, coordination technique et livraison maîtrisée.",
};

export default function ConstructionImmeublesPage() {
  return <GenericMarketingPage pageKey="construction/immeubles-residences" />;
}
