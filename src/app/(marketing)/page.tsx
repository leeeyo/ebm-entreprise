import { HeroSectionSplit } from "@/components/home/hero-section-split";
import {
  LandingDomaines,
  LandingPourquoi,
  LandingRealisations,
  LandingSimulateurTeaser,
  LandingStats,
  LandingTemoignages,
} from "@/components/landing";
import {
  HERO_VIDEO_LAYOUT_MIN_WIDTH_PX,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_SRC,
} from "@/content/hero-video";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EBM Ben Mokhtar — Construction & génie civil en Tunisie",
  description:
    "Entreprise de construction Tunisie : gros œuvre, projets clé en main, rénovation. Estimez votre budget avec notre simulateur — prix construction m² Tunisie (indicatif).",
};

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href={HERO_VIDEO_MOBILE_SRC}
        as="video"
        type="video/mp4"
        media={`(max-width: ${HERO_VIDEO_LAYOUT_MIN_WIDTH_PX - 1}px)`}
        fetchPriority="high"
      />
      <link
        rel="preload"
        href={HERO_VIDEO_SRC}
        as="video"
        type="video/mp4"
        media={`(min-width: ${HERO_VIDEO_LAYOUT_MIN_WIDTH_PX}px)`}
        fetchPriority="high"
      />
      <HeroSectionSplit />

      <LandingDomaines />
      <LandingStats />
      <LandingPourquoi />
      <LandingRealisations />
      <LandingTemoignages />
      <LandingSimulateurTeaser />
    </>
  );
}
