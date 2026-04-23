/**
 * Centralized placeholder imagery (Unsplash — free license).
 *
 * Every entry is marked with TODO so the team can replace with real
 * chantier photos (WebP in /public) once they are available. When a real
 * file exists, swap `src` to `/<folder>/<file>.webp` and remove the TODO.
 *
 * Keep URLs small (w=1200/1400) — they are already sized for the layouts.
 */

export type MediaItem = { src: string; alt: string };

/** Page-hero full-bleed backdrops. */
export const heroes = {
  // TODO: replace with a real chantier photo
  construction: {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=75",
    alt: "Chantier de construction moderne — grues et béton structurel.",
  },
  // TODO: replace with a real villa EBM
  villa: {
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1800&q=75",
    alt: "Villa contemporaine livrée — volumes nets et piscine.",
  },
  // TODO: replace with a real résidence EBM
  immeubles: {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=75",
    alt: "Immeubles résidentiels en cours de livraison.",
  },
  // TODO: replace with a real renovation EBM
  renovation: {
    src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=75",
    alt: "Intérieur rénové lumineux — cuisine ouverte et finitions soignées.",
  },
  // TODO: replace with a real salle de bain
  salleDeBain: {
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1800&q=75",
    alt: "Salle de bain moderne — carrelage contemporain et robinetterie chromée.",
  },
  // TODO: replace with a real services EBM
  services: {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=75",
    alt: "Équipe technique sur chantier — coordination corps d'état.",
  },
  // TODO: replace with a real projets EBM
  projets: {
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=75",
    alt: "Vue aérienne d'un programme résidentiel en Tunisie.",
  },
  // TODO: replace with a real contact visual
  contact: {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=75",
    alt: "Plans d'architecte et maquette posés sur une table de bureau.",
  },
  // TODO: replace with real interior / wizard visual
  simulateur: {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=75",
    alt: "Projet de villa sur plan — échelle, compas et choix de finitions.",
  },
  // TODO: replace with a real actualites visual
  actualites: {
    src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&w=1800&q=75",
    alt: "Casques de chantier posés sur un plan — préparation des annonces.",
  },
} satisfies Record<string, MediaItem>;

/** Bento / gallery imagery — ordered for the 5-cell layout (lg/md/md/sm/sm). */
export const bento = {
  // TODO: replace with EBM villa shots
  villa: [
    {
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=75",
      alt: "Façade de villa moderne au crépuscule.",
    },
    {
      src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75",
      alt: "Salon ouvert d'une villa avec baies vitrées.",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=75",
      alt: "Vue côté jardin d'une villa contemporaine.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=75",
      alt: "Escalier intérieur en pierre et rampe métallique.",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1000&q=75",
      alt: "Cuisine équipée en îlot central.",
    },
  ],
  // TODO: replace with real salle de bain shots
  salleDeBain: [
    {
      src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=75",
      alt: "Salle de bain — douche italienne et vasque suspendue.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=75",
      alt: "Robinetterie chromée et miroir rétroéclairé.",
    },
    {
      src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=75",
      alt: "Salle de bain avec baignoire autoportante.",
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=75",
      alt: "Détail de carrelage et joints — finitions.",
    },
    {
      src: "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1000&q=75",
      alt: "Meuble vasque en bois et décoration naturelle.",
    },
  ],
  // TODO: replace with real interior renovation shots
  maisonAppartement: [
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba84?auto=format&fit=crop&w=1400&q=75",
      alt: "Salon rénové — parquet et murs clairs.",
    },
    {
      src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=75",
      alt: "Cuisine repensée, plan de travail et crédence.",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=75",
      alt: "Chambre rénovée avec tête de lit sur mesure.",
    },
    {
      src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=75",
      alt: "Détail de moulures et peinture fraîche.",
    },
    {
      src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=75",
      alt: "Appartement repeint et décoré.",
    },
  ],
  // TODO: replace with real immeubles shots
  immeubles: [
    {
      src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=75",
      alt: "Façade d'immeuble résidentiel neuf.",
    },
    {
      src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=75",
      alt: "Tour résidentielle en construction — structure.",
    },
    {
      src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=75",
      alt: "Hall d'entrée lumineux d'une résidence.",
    },
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=75",
      alt: "Chantier d'immeuble en cours — coffrage.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=75",
      alt: "Plans d'architecte et coordination.",
    },
  ],
  // TODO: replace with real services gallery
  services: [
    {
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=75",
      alt: "Installation électrique — tableau et câblage.",
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=75",
      alt: "Plomberie — réseaux et raccords.",
    },
    {
      src: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1200&q=75",
      alt: "Pose de menuiseries aluminium.",
    },
    {
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=75",
      alt: "Aménagement extérieur — terrasse bois.",
    },
    {
      src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=75",
      alt: "Jardin paysager et piscine.",
    },
  ],
  // TODO: replace with real projet gallery
  projetGallery: [
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=75",
      alt: "Vue d'ensemble d'une résidence livrée.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753051-6057a8373b4d?auto=format&fit=crop&w=1200&q=75",
      alt: "Entrée principale et façade.",
    },
    {
      src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=75",
      alt: "Séjour — volumes et lumière naturelle.",
    },
    {
      src: "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&fit=crop&w=1000&q=75",
      alt: "Détail extérieur et aménagements.",
    },
    {
      src: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=75",
      alt: "Finitions — sol et matériaux.",
    },
  ],
} satisfies Record<string, MediaItem[]>;

/** Per-slug bento for the generic inner pages. */
export const genericPageBento: Record<string, MediaItem[]> = {
  "construction/immeubles-residences": bento.immeubles,
  "renovation/maison-appartement": bento.maisonAppartement,
  "renovation/salle-de-bain": bento.salleDeBain,
  "fluide/chauffage": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=75",
      alt: "Installation de chauffage — radiateurs muraux.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75",
      alt: "Réseau de tuyauterie thermique.",
    },
    {
      src: "https://images.unsplash.com/photo-1530555206237-e9f1b7fcb12a?auto=format&fit=crop&w=1200&q=75",
      alt: "Système de chauffage au sol en cours de pose.",
    },
    {
      src: "https://images.unsplash.com/photo-1582582450057-a5ba15cffdb7?auto=format&fit=crop&w=1000&q=75",
      alt: "Chaudière et équipement technique.",
    },
    {
      src: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=75",
      alt: "Contrôle et mise en service.",
    },
  ],
  "fluide/sanitaire": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=75",
      alt: "Travaux de plomberie sanitaire.",
    },
    {
      src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=75",
      alt: "Salle de bain finalisée.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=75",
      alt: "Robinetterie et vasque.",
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=75",
      alt: "Raccords et étanchéité.",
    },
    {
      src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1000&q=75",
      alt: "Installation — détail technique.",
    },
  ],
  "fluide/climatisation": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1582582450057-a5ba15cffdb7?auto=format&fit=crop&w=1400&q=75",
      alt: "Climatisation murale — unité intérieure.",
    },
    {
      src: "https://images.unsplash.com/photo-1636401859495-24e5dfc9b2a6?auto=format&fit=crop&w=1200&q=75",
      alt: "Unité extérieure de climatisation.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75",
      alt: "Gainage et dimensionnement.",
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=75",
      alt: "Réseau frigorifique — détails.",
    },
    {
      src: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=75",
      alt: "Maintenance et contrôle.",
    },
  ],
  "electricite/courant-fort": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=75",
      alt: "Tableau électrique — circuits de puissance.",
    },
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=75",
      alt: "Câblage et protections.",
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=75",
      alt: "Passage de gaines.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=75",
      alt: "Lecture de plans électriques.",
    },
    {
      src: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=75",
      alt: "Mise en service et contrôle.",
    },
  ],
  "electricite/courant-faible": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=75",
      alt: "Baie de brassage — courant faible.",
    },
    {
      src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=75",
      alt: "Raccordements réseau et téléphonie.",
    },
    {
      src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=75",
      alt: "Domotique — écran de supervision.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=75",
      alt: "Câbles réseau et étiquetage.",
    },
    {
      src: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=75",
      alt: "Tests et réception.",
    },
  ],
  "electricite/maintenance-normes": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=75",
      alt: "Audit et diagnostic électrique.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75",
      alt: "Mise aux normes d'un tableau.",
    },
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=75",
      alt: "Protections différentielles.",
    },
    {
      src: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=75",
      alt: "Contrôle de sécurité.",
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=75",
      alt: "Documentation technique.",
    },
  ],
  "menuiserie/aluminium": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1400&q=75",
      alt: "Menuiserie aluminium — baie vitrée.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba84?auto=format&fit=crop&w=1200&q=75",
      alt: "Fenêtre alu et vitrage isolant.",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=75",
      alt: "Porte d'entrée aluminium.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=75",
      alt: "Profilés aluminium — détail.",
    },
    {
      src: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=75",
      alt: "Véranda en aluminium.",
    },
  ],
  "menuiserie/bois": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba84?auto=format&fit=crop&w=1400&q=75",
      alt: "Menuiserie bois — détails d'assemblage.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=75",
      alt: "Escalier bois sur mesure.",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=75",
      alt: "Placard bois intégré.",
    },
    {
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=75",
      alt: "Parquet massif posé.",
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=75",
      alt: "Finitions bois — huilage.",
    },
  ],
  "menuiserie/peinture-decoratifs": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1400&q=75",
      alt: "Peinture intérieure — finitions soignées.",
    },
    {
      src: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=1200&q=75",
      alt: "Application au rouleau — couche de finition.",
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=75",
      alt: "Enduit décoratif et détails.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba84?auto=format&fit=crop&w=1000&q=75",
      alt: "Préparation des supports.",
    },
    {
      src: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=75",
      alt: "Moulures et boiseries peintes.",
    },
  ],
  "menuiserie/etancheite-isolation": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=75",
      alt: "Étanchéité toiture — pose de membrane.",
    },
    {
      src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=75",
      alt: "Isolation thermique — panneaux posés.",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75",
      alt: "Détail d'une interface mur / toiture.",
    },
    {
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=75",
      alt: "Contrôle de qualité d'étanchéité.",
    },
    {
      src: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=75",
      alt: "Finitions et joints.",
    },
  ],
  "amenagements-exterieurs/terrasse": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=75",
      alt: "Terrasse en bois avec mobilier d'extérieur.",
    },
    {
      src: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1200&q=75",
      alt: "Revêtement de terrasse — pierre reconstituée.",
    },
    {
      src: "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&fit=crop&w=1200&q=75",
      alt: "Terrasse et garde-corps.",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba84?auto=format&fit=crop&w=1000&q=75",
      alt: "Détails techniques — drainage.",
    },
    {
      src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=75",
      alt: "Terrasse intégrée au jardin.",
    },
  ],
  "amenagements-exterieurs/jardin": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=75",
      alt: "Jardin paysager avec chemin et plantations.",
    },
    {
      src: "https://images.unsplash.com/photo-1520637836862-4d197d17c838?auto=format&fit=crop&w=1200&q=75",
      alt: "Aménagement de massifs et bordures.",
    },
    {
      src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=75",
      alt: "Pelouse entretenue et arbres d'ombrage.",
    },
    {
      src: "https://images.unsplash.com/photo-1572287529837-31afb2cd2e26?auto=format&fit=crop&w=1000&q=75",
      alt: "Éclairage paysager du jardin.",
    },
    {
      src: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1000&q=75",
      alt: "Détail de végétation — plantes méditerranéennes.",
    },
  ],
  "amenagements-exterieurs/piscine": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=75",
      alt: "Piscine à débordement et margelles.",
    },
    {
      src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=75",
      alt: "Coque de piscine en construction.",
    },
    {
      src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=75",
      alt: "Plage de piscine en pierre naturelle.",
    },
    {
      src: "https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&w=1000&q=75",
      alt: "Éclairage immergé — ambiance nocturne.",
    },
    {
      src: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=75",
      alt: "Local technique et filtration.",
    },
  ],
  "amenagements-exterieurs/abri-voiture": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1583266617775-a2fd81fbdd7a?auto=format&fit=crop&w=1400&q=75",
      alt: "Abri de voiture en bois sur mesure.",
    },
    {
      src: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1200&q=75",
      alt: "Structure métallique d'un carport.",
    },
    {
      src: "https://images.unsplash.com/photo-1570129476815-ba368ac77013?auto=format&fit=crop&w=1200&q=75",
      alt: "Abri ouvert intégré à la façade.",
    },
    {
      src: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=75",
      alt: "Couverture bac acier — détail.",
    },
    {
      src: "https://images.unsplash.com/photo-1577496549804-8b05c0d99f5a?auto=format&fit=crop&w=1000&q=75",
      alt: "Ancrages et fondations.",
    },
  ],
  "amenagements-exterieurs/pergola": [
    // TODO: replace with real EBM installations
    {
      src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1400&q=75",
      alt: "Pergola bioclimatique — salon extérieur.",
    },
    {
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=75",
      alt: "Pergola en aluminium avec lames orientables.",
    },
    {
      src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=75",
      alt: "Pergola en bois et végétation.",
    },
    {
      src: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1000&q=75",
      alt: "Pergola et éclairage intégré.",
    },
    {
      src: "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&fit=crop&w=1000&q=75",
      alt: "Détails d'ancrage et structure.",
    },
  ],
};

/** Static map backdrop for /contact. */
// TODO: replace with a custom map image (Mapbox static, Google static, or real screenshot)
export const contactMap: MediaItem = {
  src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=75",
  alt: "Carte stylisée de la région d'Ariana, Tunisie.",
};
