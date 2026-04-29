export type NavChild = {
  title: string;
  href: string;
  /** Used for mega-menu column grouping (e.g. Services) */
  category?: string;
};

/** Group children by `category` for mega menus and hub pages (Services). */
export function groupNavChildren(children: NavChild[]): { label: string; items: NavChild[] }[] {
  const hasCategory = children.some((c) => c.category);
  if (!hasCategory) return [{ label: "", items: children }];
  const order: string[] = [];
  const map = new Map<string, NavChild[]>();
  for (const c of children) {
    const label = c.category ?? "Autres";
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(c);
  }
  return order.map((label) => ({ label, items: map.get(label)! }));
}

export type NavSection = {
  title: string;
  /** Top-level link when the section has no submenu */
  href?: string;
  /** Hub page for sections with a dropdown (click title + “Tout voir”) */
  hubHref?: string;
  children?: NavChild[];
};

type ProjectNavItem = {
  slug: string;
  title: string;
};

export const navSections: NavSection[] = [
  { title: "Accueil", href: "/" },
  {
    title: "Construction",
    hubHref: "/construction",
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
    hubHref: "/renovation",
    children: [
      { title: "Rénovation maison et appartement", href: "/renovation/maison-appartement" },
      { title: "Rénovation salle de bain", href: "/renovation/salle-de-bain" },
    ],
  },
  {
    title: "Services",
    hubHref: "/services",
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
    hubHref: "/projets",
    children: [
      { title: "Résidence Amira", href: "/projets/residence-amira" },
      { title: "Résidence la Tulipe", href: "/projets/residence-la-tulipe" },
      { title: "Résidence Ennakhil", href: "/projets/residence-ennakhil" },
      { title: "Résidence El Menyar", href: "/projets/residence-el-menyar" },
      { title: "Résidence el Amen", href: "/projets/residence-el-amen" },
      { title: "Résidence el ons", href: "/projets/residence-el-ons" },
      { title: "Résidence el khalil", href: "/projets/residence-el-khalil" },
      { title: "Résidence Les Orangers", href: "/projets/residence-les-orangers" },
    ],
  },
  { title: "Simulateur", href: "/simulateur" },
  { title: "Actualités", href: "/actualites" },
  { title: "Contact", href: "/contact" },
];

export function navSectionsWithProjects(projects: ProjectNavItem[]): NavSection[] {
  const projectChildren = projects.map((project) => ({
    title: project.title,
    href: `/projets/${project.slug}`,
  }));

  return navSections.map((section) =>
    section.title === "Nos projets"
      ? {
          ...section,
          children: projectChildren.length ? projectChildren : section.children,
        }
      : section,
  );
}
