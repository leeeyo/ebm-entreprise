import type { SeedServicePage } from "./types";

/**
 * The 15 secondary service subpages (Fluide, Électricité, Menuiserie,
 * Aménagements extérieurs). Each gets a prepared hero + rich copy (bullets,
 * content sections, FAQ) but no gallery. Heroes are the flat files the client
 * prepared under `public/services/*.webp`.
 */

const S = "/services";

type RichInput = {
  slug: string;
  navLabel: string;
  category: string;
  heroFile: string;
  heroAlt: string;
  title: string;
  intro: string;
  bullets: string[];
  contentSections: SeedServicePage["contentSections"];
  faq: SeedServicePage["faq"];
  seoDescription: string;
};

function buildServicePage(input: RichInput, order: number): SeedServicePage {
  return {
    slug: input.slug,
    navLabel: input.navLabel,
    category: input.category,
    heroEyebrow: input.category,
    heroImage: { src: `${S}/${input.heroFile}`, alt: input.heroAlt },
    title: input.title,
    intro: input.intro,
    bullets: input.bullets,
    contentSections: input.contentSections,
    showImageGallery: false,
    galleryEyebrow: "Aperçu",
    galleryTitle: "En images",
    gallerySubtitle: undefined,
    galleryImages: [],
    faq: input.faq,
    seoTitle: `${input.title} | EBM Ben Mokhtar`,
    seoDescription: input.seoDescription,
    ctaPrimaryLabel: "Demander un devis",
    ctaSecondaryLabel: "Lancer le simulateur",
    order,
  };
}

const RICH: RichInput[] = [
  {
    slug: "fluide/chauffage",
    navLabel: "Chauffage",
    category: "Fluides",
    heroFile: "fluide-chauffage.webp",
    heroAlt: "Installation de chauffage par EBM : chaudière et réseau de distribution.",
    title: "Chauffage : installation et mise en service en Tunisie",
    intro:
      "Installations thermiques dimensionnées pour le confort et l'efficacité énergétique de votre bâtiment, du choix des équipements à la mise en service.",
    bullets: ["Étude des besoins thermiques", "Mise en œuvre réglementaire", "Mise en service et contrôle", "Conseils d'usage et d'entretien"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Un dimensionnement adapté à votre bâtiment",
        body:
          "Nous évaluons les déperditions et l'usage des locaux pour dimensionner correctement l'installation : confort homogène, factures maîtrisées et équipements durables.",
        items: ["Bilan des besoins", "Choix des équipements", "Implantation des réseaux"],
      },
      {
        eyebrow: "Exécution",
        title: "Pose, mise en service et réception",
        body:
          "Réseaux, raccordements et mise en service sont réalisés dans les règles de l'art, avec contrôle de bon fonctionnement avant réception.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Intervenez-vous en neuf et en rénovation ?",
        answer: "Oui, sur les projets neufs comme sur le remplacement ou l'extension d'installations existantes.",
      },
      {
        question: "Assurez-vous la mise en service ?",
        answer: "Oui. Nous réalisons la mise en service et un contrôle de bon fonctionnement avant la réception.",
      },
    ],
    seoDescription:
      "Installation de chauffage en Tunisie : étude, pose et mise en service par EBM Ben Mokhtar. Demandez votre devis.",
  },
  {
    slug: "fluide/sanitaire",
    navLabel: "Sanitaire",
    category: "Fluides",
    heroFile: "fluide-sanitaire.webp",
    heroAlt: "Installation sanitaire par EBM : réseaux de distribution et d'évacuation.",
    title: "Sanitaire : réseaux et appareillage en Tunisie",
    intro:
      "Réseaux et appareillage sanitaire : distribution, évacuation et mise aux normes pour une installation fiable et durable.",
    bullets: ["Distribution et évacuation", "Appareils et accessoires", "Contrôle d'étanchéité", "Mise aux normes"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Des réseaux fiables et conformes",
        body:
          "Nous concevons et posons les réseaux de distribution et d'évacuation avec un soin particulier porté à l'étanchéité et à la conformité.",
        items: ["Alimentation eau froide / chaude", "Évacuations et ventilation", "Pose des appareils"],
      },
      {
        eyebrow: "Qualité",
        title: "Contrôles avant fermeture des saignées",
        body:
          "Les contrôles d'étanchéité sont réalisés avant fermeture des supports, pour éviter tout désordre une fois les finitions posées.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Pouvez-vous reprendre une installation ancienne ?",
        answer: "Oui. Nous diagnostiquons l'existant et reprenons les réseaux nécessaires pour fiabiliser l'installation.",
      },
      {
        question: "Travaillez-vous avec les autres lots ?",
        answer: "Oui, en coordination avec le chauffage, l'électricité et les finitions, sur un planning partagé.",
      },
    ],
    seoDescription:
      "Plomberie et installation sanitaire en Tunisie : distribution, évacuation et mise aux normes par EBM Ben Mokhtar.",
  },
  {
    slug: "fluide/climatisation",
    navLabel: "Climatisation",
    category: "Fluides",
    heroFile: "fluide-climatisation.webp",
    heroAlt: "Installation de climatisation par EBM : unité intérieure et groupe extérieur.",
    title: "Climatisation : confort thermique en Tunisie",
    intro:
      "Solutions de climatisation adaptées au contexte tunisien : confort thermique, performance des équipements et installation soignée.",
    bullets: ["Dimensionnement adapté", "Pose et mise en service", "Entretien et bon usage", "Équipements performants"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Le bon équipement, bien posé",
        body:
          "Nous dimensionnons la solution selon les surfaces, l'exposition et l'usage, puis assurons une pose propre des unités et des liaisons.",
        items: ["Mono ou multisplit selon les besoins", "Liaisons frigorifiques", "Évacuation des condensats"],
      },
      {
        eyebrow: "Exploitation",
        title: "Mise en service et conseils",
        body:
          "Après mise en service, nous vous conseillons sur le bon usage et l'entretien pour préserver la performance des équipements.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Quelle solution pour une villa entière ?",
        answer: "Selon la configuration, une solution multi-split ou plusieurs systèmes peuvent être proposés après étude.",
      },
      {
        question: "Proposez-vous l'entretien ?",
        answer: "Nous vous conseillons sur l'entretien régulier nécessaire au maintien des performances.",
      },
    ],
    seoDescription:
      "Installation de climatisation en Tunisie : dimensionnement, pose et mise en service par EBM Ben Mokhtar.",
  },
  {
    slug: "electricite/courant-fort",
    navLabel: "Courant fort",
    category: "Électricité",
    heroFile: "electricite-courant-fort.webp",
    heroAlt: "Tableau électrique et câblage courant fort réalisés par EBM.",
    title: "Courant fort : tableaux et circuits en Tunisie",
    intro:
      "Alimentations, tableaux et circuits : une installation électrique sûre et conforme aux usages de votre projet.",
    bullets: ["Tableaux et protections", "Câblage et équipements", "Mise aux normes", "Repérage et documentation"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Une installation sûre et lisible",
        body:
          "Tableaux, protections et circuits sont conçus pour la sécurité et la lisibilité, avec un repérage clair facilitant la maintenance.",
        items: ["Tableau et protections différentielles", "Circuits prises et éclairage", "Repérage des départs"],
      },
      {
        eyebrow: "Conformité",
        title: "Mise aux normes et réception",
        body:
          "L'installation respecte les règles en vigueur ; nous documentons les départs pour une exploitation et une évolution sereines.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Gérez-vous l'installation complète d'une villa ?",
        answer: "Oui, du tableau aux circuits prises et éclairage, en coordination avec les autres lots.",
      },
      {
        question: "Fournissez-vous un repérage ?",
        answer: "Oui. Les départs sont repérés pour faciliter la maintenance et les évolutions futures.",
      },
    ],
    seoDescription:
      "Électricité courant fort en Tunisie : tableaux, circuits et mise aux normes par EBM Ben Mokhtar.",
  },
  {
    slug: "electricite/courant-faible",
    navLabel: "Courant faible",
    category: "Électricité",
    heroFile: "electricite-courant-faible.webp",
    heroAlt: "Réseau courant faible par EBM : baie de brassage et câblage réseau.",
    title: "Courant faible : réseaux et domotique en Tunisie",
    intro:
      "Réseaux basse tension pour la communication, la sécurité et la domotique, selon les besoins de votre projet.",
    bullets: ["Étude de besoins", "Câblage réseau et multimédia", "Sécurité et contrôle d'accès", "Tests et réception"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Une infrastructure prête pour vos usages",
        body:
          "Nous structurons le câblage réseau, multimédia et de sécurité pour anticiper vos usages numériques actuels et futurs.",
        items: ["Réseau informatique et multimédia", "Vidéosurveillance et alarme", "Contrôle d'accès"],
      },
      {
        eyebrow: "Qualité",
        title: "Tests et réception documentés",
        body:
          "Chaque liaison est testée avant réception, pour une infrastructure fiable dès la mise en service.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Intégrez-vous la vidéosurveillance ?",
        answer: "Oui, selon le cahier des charges : vidéosurveillance, alarme et contrôle d'accès peuvent être intégrés.",
      },
      {
        question: "Préparez-vous la maison à la domotique ?",
        answer: "Oui. Nous dimensionnons l'infrastructure pour accueillir les solutions domotiques souhaitées.",
      },
    ],
    seoDescription:
      "Courant faible en Tunisie : réseaux, sécurité et domotique par EBM Ben Mokhtar.",
  },
  {
    slug: "electricite/maintenance-normes",
    navLabel: "Maintenance et mise aux normes",
    category: "Électricité",
    heroFile: "electricite-maintenance-normes.webp",
    heroAlt: "Maintenance et mise aux normes électriques par un technicien EBM.",
    title: "Maintenance et mise aux normes électriques en Tunisie",
    intro:
      "Remise en conformité, optimisation et maintenance pour sécuriser une installation électrique existante.",
    bullets: ["Audit et diagnostic", "Travaux ciblés", "Documentation et réception", "Sécurisation de l'existant"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Diagnostiquer avant d'intervenir",
        body:
          "Un audit identifie les points à risque et les non-conformités, pour prioriser des travaux ciblés et efficaces.",
        items: ["Audit de l'installation", "Identification des risques", "Plan d'action priorisé"],
      },
      {
        eyebrow: "Sécurité",
        title: "Remise en conformité",
        body:
          "Nous réalisons les travaux nécessaires et documentons l'installation pour une exploitation sécurisée.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Intervenez-vous en urgence ?",
        answer: "Nous priorisons les points présentant un risque après diagnostic, selon la disponibilité de nos équipes.",
      },
      {
        question: "Fournissez-vous un rapport ?",
        answer: "Oui. Les interventions et l'état de l'installation sont documentés à la réception.",
      },
    ],
    seoDescription:
      "Maintenance et mise aux normes électriques en Tunisie : audit, travaux et sécurisation par EBM Ben Mokhtar.",
  },
  {
    slug: "menuiserie/aluminium",
    navLabel: "Aluminium",
    category: "Menuiserie",
    heroFile: "menuiserie-aluminium.webp",
    heroAlt: "Menuiseries aluminium posées par EBM : baies coulissantes contemporaines.",
    title: "Menuiserie aluminium en Tunisie",
    intro:
      "Menuiseries aluminium pour la performance, la durabilité et une esthétique contemporaine.",
    bullets: ["Prise de cotes précise", "Fourniture et pose", "Finitions et ajustements", "Performance et durabilité"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Des ouvertures performantes",
        body:
          "Baies, fenêtres et portes aluminium sont sélectionnées pour leur performance et leur tenue dans le temps, puis posées avec précision.",
        items: ["Fenêtres et baies coulissantes", "Portes et garde-corps", "Étanchéité des liaisons"],
      },
      {
        eyebrow: "Finitions",
        title: "Réglages et réception",
        body:
          "Après pose, nous procédons aux réglages et ajustements pour un fonctionnement parfait et des finitions soignées.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Proposez-vous différents coloris ?",
        answer: "Oui, selon les gammes disponibles : nous vous orientons vers les finitions adaptées au projet.",
      },
      {
        question: "Assurez-vous l'étanchéité des liaisons ?",
        answer: "Oui. L'étanchéité des liaisons fait partie intégrante d'une pose soignée.",
      },
    ],
    seoDescription:
      "Menuiserie aluminium en Tunisie : fenêtres, baies et portes posées par EBM Ben Mokhtar.",
  },
  {
    slug: "menuiserie/bois",
    navLabel: "Menuiserie bois",
    category: "Menuiserie",
    heroFile: "menuiserie-bois.webp",
    heroAlt: "Menuiserie bois sur mesure réalisée par EBM : portes et agencements.",
    title: "Menuiserie bois sur mesure en Tunisie",
    intro:
      "Bois massif et solutions techniques pour un rendu chaleureux et une bonne isolation, sur mesure.",
    bullets: ["Choix des essences et finitions", "Fabrication sur mesure", "Pose précise", "Conseils d'entretien"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Le sur-mesure, jusqu'au détail",
        body:
          "Portes, placards et agencements sont étudiés selon vos espaces et vos goûts, avec un choix d'essences et de finitions adapté.",
        items: ["Portes et habillages", "Placards et dressings", "Agencements sur mesure"],
      },
      {
        eyebrow: "Durabilité",
        title: "Pose et entretien",
        body:
          "Une pose soignée et des conseils d'entretien contribuent à la bonne tenue des ouvrages bois dans le temps.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Réalisez-vous du mobilier sur mesure ?",
        answer: "Oui : placards, dressings et agencements peuvent être conçus et fabriqués sur mesure.",
      },
      {
        question: "Quelles essences proposez-vous ?",
        answer: "Plusieurs essences et finitions sont possibles ; nous vous conseillons selon l'usage et le budget.",
      },
    ],
    seoDescription:
      "Menuiserie bois sur mesure en Tunisie : portes, placards et agencements par EBM Ben Mokhtar.",
  },
  {
    slug: "menuiserie/peinture-decoratifs",
    navLabel: "Peinture et décoratifs",
    category: "Menuiserie",
    heroFile: "menuiserie-peinture-decoratif.webp",
    heroAlt: "Travaux de peinture et finitions décoratives réalisés par EBM.",
    title: "Peinture et finitions décoratives en Tunisie",
    intro:
      "Finitions décoratives et préparation des supports pour un rendu durable et soigné.",
    bullets: ["Préparation des supports", "Cycles de peinture", "Enduits et décoratifs", "Détails et finitions"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Tout se joue dans la préparation",
        body:
          "Un support bien préparé conditionne la qualité et la tenue du rendu final. Nous soignons cette étape avant toute application.",
        items: ["Rebouchage et ponçage", "Sous-couche adaptée", "Cycles de peinture"],
      },
      {
        eyebrow: "Rendu",
        title: "Décoratifs et finitions",
        body:
          "Enduits décoratifs, teintes et détails sont réalisés avec soin pour un résultat élégant et durable.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Proposez-vous des enduits décoratifs ?",
        answer: "Oui, selon le rendu recherché : nous vous présentons les options adaptées à vos pièces.",
      },
      {
        question: "Travaillez-vous en rénovation ?",
        answer: "Oui, avec une préparation soignée des supports existants avant application.",
      },
    ],
    seoDescription:
      "Peinture et finitions décoratives en Tunisie : préparation des supports et rendu soigné par EBM Ben Mokhtar.",
  },
  {
    slug: "menuiserie/etancheite-isolation",
    navLabel: "Étanchéité et isolation",
    category: "Menuiserie",
    heroFile: "menuiserie-etancheite-isolation.webp",
    heroAlt: "Travaux d'étanchéité et d'isolation réalisés par EBM sur chantier.",
    title: "Étanchéité et isolation en Tunisie",
    intro:
      "Barrière à l'eau et enveloppe thermique : performance et durabilité dans le temps.",
    bullets: ["Solutions adaptées au contexte", "Contrôle des interfaces", "Qualité de mise en œuvre", "Performance durable"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Protéger l'ouvrage dans la durée",
        body:
          "Étanchéité des toitures et terrasses, traitement des points singuliers et isolation : nous protégeons votre bâtiment contre l'eau et les déperditions.",
        items: ["Étanchéité des toitures et des terrasses", "Traitement des points singuliers", "Isolation thermique"],
      },
      {
        eyebrow: "Qualité",
        title: "Le soin des interfaces",
        body:
          "La durabilité se joue aux interfaces : nous contrôlons les liaisons et la mise en œuvre pour éviter les désordres.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Traitez-vous les terrasses accessibles ?",
        answer: "Oui, avec des systèmes adaptés à l'usage et au support après diagnostic.",
      },
      {
        question: "Intervenez-vous en réfection ?",
        answer: "Oui. Nous diagnostiquons l'existant avant de proposer la solution de réfection adaptée.",
      },
    ],
    seoDescription:
      "Étanchéité et isolation en Tunisie : toitures, terrasses et enveloppe thermique par EBM Ben Mokhtar.",
  },
  {
    slug: "amenagements-exterieurs/terrasse",
    navLabel: "Aménagement de terrasse",
    category: "Aménagements extérieurs",
    heroFile: "amenagements-exterieurs-terrasse.webp",
    heroAlt: "Terrasse aménagée par EBM : revêtement soigné et espace de vie extérieur.",
    title: "Aménagement de terrasse en Tunisie",
    intro:
      "Structuration et finitions d'extérieur pour des espaces durables et confortables.",
    bullets: ["Étude et drainage", "Revêtements et finitions", "Intégration paysagère", "Durabilité"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Une terrasse pensée pour durer",
        body:
          "Préparation du support, gestion des pentes et du drainage, puis pose de revêtements adaptés à l'extérieur et au climat.",
        items: ["Préparation et drainage", "Revêtements extérieurs", "Intégration au jardin"],
      },
      {
        eyebrow: "Confort",
        title: "Un espace de vie supplémentaire",
        body:
          "Nous concevons la terrasse comme un véritable espace de vie, en cohérence avec l'architecture et le jardin.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Gérez-vous le drainage ?",
        answer: "Oui. Pentes et drainage sont étudiés pour éviter les stagnations et préserver le revêtement.",
      },
      {
        question: "Quels revêtements proposez-vous ?",
        answer: "Plusieurs revêtements extérieurs sont possibles ; nous vous conseillons selon l'usage et l'esthétique.",
      },
    ],
    seoDescription:
      "Aménagement de terrasse en Tunisie : préparation, revêtements et finitions par EBM Ben Mokhtar.",
  },
  {
    slug: "amenagements-exterieurs/jardin",
    navLabel: "Aménagement de jardin",
    category: "Aménagements extérieurs",
    heroFile: "amenagements-exterieurs-jardin.webp",
    heroAlt: "Jardin paysager aménagé par EBM : plantations et cheminements.",
    title: "Aménagement de jardin en Tunisie",
    intro:
      "Aménagements extérieurs végétalisés et structurants selon votre cahier des charges.",
    bullets: ["Préparation du terrain", "Structuration et plantations", "Cheminements et clôtures", "Entretien conseillé"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Structurer l'extérieur",
        body:
          "Cheminements, massifs, clôtures et plantations sont organisés pour un jardin cohérent, fonctionnel et agréable.",
        items: ["Préparation du sol", "Cheminements et bordures", "Plantations et massifs"],
      },
      {
        eyebrow: "Durabilité",
        title: "Un jardin qui se maintient",
        body:
          "Nous vous conseillons sur l'entretien pour que votre jardin garde son allure au fil des saisons.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Réalisez-vous les clôtures ?",
        answer: "Oui, les clôtures et bordures font partie des aménagements que nous prenons en charge.",
      },
      {
        question: "Posez-vous un arrosage ?",
        answer: "Selon le projet, un système d'arrosage peut être intégré à l'aménagement.",
      },
    ],
    seoDescription:
      "Aménagement de jardin en Tunisie : plantations, cheminements et clôtures par EBM Ben Mokhtar.",
  },
  {
    slug: "amenagements-exterieurs/piscine",
    navLabel: "Construction de piscine",
    category: "Aménagements extérieurs",
    heroFile: "amenagements-exterieurs-piscine.webp",
    heroAlt: "Piscine construite par EBM dans une villa, plage et eau turquoise.",
    title: "Construction de piscine en Tunisie",
    intro:
      "Génie civil et équipements techniques pour une piscine conforme et pérenne.",
    bullets: ["Étude technique", "Gros œuvre et étanchéité", "Raccordements et mise en service", "Plage et finitions"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Le génie civil au service du plaisir",
        body:
          "Terrassement, structure béton et étanchéité sont réalisés avec la rigueur d'un ouvrage de génie civil, pour une piscine durable.",
        items: ["Terrassement et structure", "Étanchéité du bassin", "Local technique"],
      },
      {
        eyebrow: "Exploitation",
        title: "Équipements et mise en service",
        body:
          "Filtration, raccordements et plage sont intégrés et mis en service, pour une piscine prête à l'usage.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Réalisez-vous la plage et les abords ?",
        answer: "Oui. La plage, les finitions et l'intégration paysagère font partie de la prestation.",
      },
      {
        question: "Gérez-vous le local technique ?",
        answer: "Oui, de la filtration aux raccordements jusqu'à la mise en service.",
      },
    ],
    seoDescription:
      "Construction de piscine en Tunisie : génie civil, étanchéité et équipements par EBM Ben Mokhtar.",
  },
  {
    slug: "amenagements-exterieurs/abri-voiture",
    navLabel: "Abri de voiture",
    category: "Aménagements extérieurs",
    heroFile: "amenagements-exterieurs-abri-voiture.webp",
    heroAlt: "Abri de voiture moderne réalisé par EBM à côté d'une villa.",
    title: "Abri de voiture (carport) en Tunisie",
    intro:
      "Ouvrages légers et structurants pour protéger vos véhicules et compléter votre extérieur.",
    bullets: ["Structure et ancrage", "Couverture adaptée", "Finitions", "Intégration architecturale"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "Un ouvrage solide et esthétique",
        body:
          "Structure dimensionnée, ancrage soigné et couverture adaptée : un abri qui protège durablement tout en s'intégrant à l'architecture.",
        items: ["Structure et fondations", "Couverture", "Finitions et éclairage"],
      },
      {
        eyebrow: "Sur mesure",
        title: "Adapté à votre extérieur",
        body:
          "Nous adaptons les dimensions et les matériaux à votre terrain et au style de votre maison.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Pour combien de véhicules ?",
        answer: "L'abri est dimensionné selon vos besoins, d'un à plusieurs véhicules.",
      },
      {
        question: "Quels matériaux utilisez-vous ?",
        answer: "Acier, bois ou solutions mixtes selon l'esthétique recherchée et le budget.",
      },
    ],
    seoDescription:
      "Abri de voiture (carport) en Tunisie : structure, couverture et finitions par EBM Ben Mokhtar.",
  },
  {
    slug: "amenagements-exterieurs/pergola",
    navLabel: "Pergola",
    category: "Aménagements extérieurs",
    heroFile: "amenagements-exterieurs-pergola.webp",
    heroAlt: "Pergola contemporaine réalisée par EBM au-dessus d'une terrasse.",
    title: "Pergola et ombrage en Tunisie",
    intro:
      "Pergolas et ombrage : confort d'usage et intégration architecturale pour vos espaces extérieurs.",
    bullets: ["Dimensionnement", "Pose soignée", "Options d'ombrage", "Intégration architecturale"],
    contentSections: [
      {
        eyebrow: "Approche EBM",
        title: "De l'ombre, avec style",
        body:
          "Pergola adossée ou autoportée, lames orientables ou toile : nous concevons l'ombrage adapté à votre terrasse et à votre architecture.",
        items: ["Pergola adossée ou autoportée", "Lames orientables ou toile", "Éclairage intégré"],
      },
      {
        eyebrow: "Confort",
        title: "Un usage prolongé de l'extérieur",
        body:
          "Bien pensée, la pergola prolonge l'usage de votre terrasse sur une grande partie de l'année.",
        items: [],
      },
    ],
    faq: [
      {
        question: "Proposez-vous des lames orientables ?",
        answer: "Oui, parmi les options d'ombrage : lames orientables, toile ou couverture selon vos préférences.",
      },
      {
        question: "Peut-on intégrer l'éclairage ?",
        answer: "Oui. L'éclairage et d'autres options peuvent être intégrés à la structure.",
      },
    ],
    seoDescription:
      "Pergola et ombrage en Tunisie : conception, pose et options par EBM Ben Mokhtar.",
  },
];

export const richServicePages: SeedServicePage[] = RICH.map((input, index) =>
  buildServicePage(input, index + 4),
);
