export type NavChild = {
  title: string;
  href: string;
  /** Used for mega-menu column grouping (e.g. Services) */
  category?: string;
};

export type NavSection = {
  title: string;
  href?: string;
  children?: NavChild[];
};

export const navSections: NavSection[] = [
  { title: "Accueil", href: "/" },
  {
    title: "Construction",
    children: [
      { title: "Construction villa", href: "/construction/villa" },
      {
        title: "Construction Immeubles & résidences",
        href: "/construction/immeubles-residences",
      },
    ],
  },
  {
    title: "Rénovation",
    children: [
      { title: "Rénovation maison et appartement", href: "/renovation/maison-appartement" },
      { title: "Rénovation salle de bain", href: "/renovation/salle-de-bain" },
    ],
  },
  {
    title: "Services",
    children: [
      { title: "Chauffage", href: "/services/fluide/chauffage", category: "Fluide" },
      { title: "Sanitaire", href: "/services/fluide/sanitaire", category: "Fluide" },
      { title: "Climatisation", href: "/services/fluide/climatisation", category: "Fluide" },
      { title: "Courant fort", href: "/services/electricite/courant-fort", category: "Électricité" },
      { title: "Courant faible", href: "/services/electricite/courant-faible", category: "Électricité" },
      {
        title: "Maintenance et mise aux normes",
        href: "/services/electricite/maintenance-normes",
        category: "Électricité",
      },
      { title: "Aluminium", href: "/services/menuiserie/aluminium", category: "Menuiserie" },
      { title: "Menuiserie bois", href: "/services/menuiserie/bois", category: "Menuiserie" },
      {
        title: "Peinture & Décoratifs",
        href: "/services/menuiserie/peinture-decoratifs",
        category: "Menuiserie",
      },
      {
        title: "Étanchéité et isolation",
        href: "/services/menuiserie/etancheite-isolation",
        category: "Menuiserie",
      },
      {
        title: "Aménagement de terrasse",
        href: "/services/amenagements-exterieurs/terrasse",
        category: "Aménagements extérieurs",
      },
      {
        title: "Aménagement de jardin",
        href: "/services/amenagements-exterieurs/jardin",
        category: "Aménagements extérieurs",
      },
      {
        title: "Construction de piscine",
        href: "/services/amenagements-exterieurs/piscine",
        category: "Aménagements extérieurs",
      },
      {
        title: "Abri de voiture",
        href: "/services/amenagements-exterieurs/abri-voiture",
        category: "Aménagements extérieurs",
      },
      {
        title: "Pergola",
        href: "/services/amenagements-exterieurs/pergola",
        category: "Aménagements extérieurs",
      },
    ],
  },
  {
    title: "Nos projets",
    children: [
      { title: "Résidence Amira", href: "/projets/residence-amira" },
      { title: "Résidence la Tulipe", href: "/projets/residence-la-tulipe" },
      { title: "Résidence Ennakhil", href: "/projets/residence-ennakhil" },
      { title: "Résidence El Menyar", href: "/projets/residence-el-menyar" },
      { title: "Résidence el Amen", href: "/projets/residence-el-amen" },
      { title: "Résidence el ons", href: "/projets/residence-el-ons" },
      { title: "Résidence el khalil", href: "/projets/residence-el-khalil" },
    ],
  },
  { title: "Simulateur", href: "/simulateur" },
  { title: "Actualités", href: "/actualites" },
  { title: "Contact", href: "/contact" },
];
