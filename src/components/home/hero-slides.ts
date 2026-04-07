export const heroSlides = [
  { id: 1, label: "Plans et structure", src: "/hero/hero1.png" },
  { id: 2, label: "Gros œuvre", src: "/hero/hero2.png" },
  { id: 3, label: "Finitions", src: "/hero/hero3.png" },
  { id: 4, label: "Réalisations", src: "/hero/hero4.png" },
] as const;

export type HeroSlide = (typeof heroSlides)[number];
