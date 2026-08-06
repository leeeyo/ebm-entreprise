export const homeHero = {
  h1: "EBM Ben Mokhtar : construire l'avenir avec rigueur",
  ctaPrimary: "Estimer votre projet",
  ctaSecondary: "Consulter nos réalisations",
};

export const domaines = [
  {
    title: "Gros œuvre et structure",
    description:
      "La maîtrise du béton et de la structure pour construire des ouvrages adaptés à leur usage.",
    image: {
      src: "/domaines/gros-oeuvre.webp",
      alt: "Coulage de béton et structure sur un chantier de gros œuvre EBM.",
    },
  },
  {
    title: "Projets clé en main",
    description:
      "Une prise en charge totale, assurant une cohérence parfaite entre les plans et la réalité.",
    image: {
      src: "/domaines/cle-en-main.webp",
      alt: "Résidence contemporaine livrée clé en main, volumes et façades finies.",
    },
  },
  {
    title: "Rénovation et extension",
    description:
      "Valoriser l'existant avec les techniques de construction les plus modernes.",
    image: {
      src: "/domaines/renovation.webp",
      alt: "Rénovation et extension : chantier propre et finitions soignées.",
    },
  },
  {
    title: "Ouvrages spécialisés",
    description:
      "Travaux de haute technicité nécessitant un parc matériel de pointe et un savoir-faire spécifique.",
    image: {
      src: "/domaines/specialises.webp",
      alt: "Ouvrage spécialisé et équipement de précision sur chantier EBM.",
    },
  },
] as const;

export const stats = [
  { value: 15, suffix: "", label: "Ans d'expertise et de savoir-faire dans le bâtiment." },
  { value: 150, suffix: "", label: "Projets réalisés avec succès à travers toute la Tunisie." },
  { value: 70, suffix: "", label: "Clients satisfaits qui nous renouvellent leur confiance." },
] as const;

export const pourquoiIntro =
  "Confier votre projet à EBM, c'est choisir un interlocuteur qui associe méthode technique, organisation et suivi des étapes de construction.";

export const pourquoiPillars = [
  {
    title: "Expertise et maîtrise technique",
    body: "Une expérience du bâtiment mobilisée à chaque étape, du gros œuvre aux finitions, avec une méthode adaptée au projet.",
  },
  {
    title: "Qualité et méthode",
    body: "Une attention constante portée à la sécurité, au choix des matériaux et au contrôle des travaux réalisés.",
  },
  {
    title: "Solutions clé en main",
    body: "Un interlocuteur unique de la conception à la livraison pour une gestion simplifiée et une vision maîtrisée.",
  },
  {
    title: "Organisation et suivi des délais",
    body: "Les moyens mobilisés et le suivi du planning permettent d'anticiper les contraintes et de communiquer clairement sur l'avancement.",
  },
] as const;

export const realisations = {
  title: "Nos réalisations",
  cta: "Voir nos projets",
};

export const temoignages = [
  {
    quote:
      "L'équipe a pris le temps de clarifier les étapes du chantier et de nous tenir informés lorsque des choix devaient être faits.",
    author: "Client particulier · projet résidentiel",
  },
  {
    quote:
      "Les échanges ont été directs et les ajustements ont été expliqués avec des solutions concrètes pour rester cohérents avec notre budget.",
    author: "Client professionnel · projet immobilier",
  },
  {
    quote:
      "La coordination sur le terrain a facilité le travail entre les différents intervenants et le suivi des points techniques.",
    author: "Partenaire de chantier · coordination technique",
  },
] as const;

export const simulateurTeaser = {
  title: "Planifiez votre projet en quelques clics.",
  text: "Parce qu'un projet réussi commence par une vision claire, utilisez notre simulateur pour obtenir une première estimation technique de vos travaux.",
  cta: "Accéder au simulateur",
};
