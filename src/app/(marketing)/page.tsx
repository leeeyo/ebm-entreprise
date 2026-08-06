import { HeroKinetic } from "@/components/home/hero-kinetic";
import { BMGroupGateway } from "@/components/bm-group-gateway";
import {
  LandingDomaines,
  LandingPourquoi,
  LandingRealisations,
  LandingSimulateurTeaser,
  LandingStats,
  LandingTemoignages,
  MarqueeProjects,
  ProcessTimeline,
} from "@/components/landing";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildSeoMetadata({
  title: "EBM Ben Mokhtar — Construction et génie civil en Tunisie",
  description:
    "Entreprise de construction Tunisie : gros œuvre, projets clé en main, rénovation. Estimez votre budget avec notre simulateur — prix construction m² Tunisie (indicatif).",
  path: "/",
});

export default function HomePage() {
  return (
    <LazyMotionProvider>
      <HeroKinetic />
      <MarqueeProjects />
      <LandingDomaines />
      <LandingStats />
      <LandingPourquoi />
      <ProcessTimeline />
      <LandingRealisations />
      <LandingTemoignages />
      <BMGroupGateway />
      <LandingSimulateurTeaser />
    </LazyMotionProvider>
  );
}
