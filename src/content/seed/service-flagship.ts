import type { SeedServicePage } from "./types";

/**
 * Four flagship service pages with the full treatment: hero + 4-step sticky
 * showcase + 5-image bento gallery + FAQ. `contentSections[i]` is paired with
 * `galleryImages[i]` by index in the showcase, so keep their order aligned.
 * Images are the client-prepared assets under `public/services/...`.
 */

const VILLA = "/services/construction--villa";
const IMMEUBLE = "/services/construction-immeuble";
const RENOV_APPART = "/services/renovation-apartement";
const RENOV_SDB = "/services/renovation-salle-de-bain";

export const flagshipServicePages: SeedServicePage[] = [
  {
    slug: "construction/villa",
    navLabel: "Construction villa",
    category: "Construction",
    heroEyebrow: "Construction villa",
    heroImage: {
      src: `${VILLA}/hero.webp`,
      alt: "Villa moderne construite par EBM Ben Mokhtar en Tunisie, façade épurée et grandes ouvertures.",
    },
    title: "Construction de villa clé en main en Tunisie",
    intro:
      "Chaque villa que nous bâtissons est une pièce unique. EBM Ben Mokhtar allie la liberté architecturale à la rigueur du génie civil pour créer des demeures qui défient le temps — de l'étude technique aux finitions de prestige.",
    bullets: [
      "Étude technique et optimisation budgétaire",
      "Gros œuvre exécuté avec notre propre parc d'engins",
      "Second œuvre et lots techniques entièrement coordonnés",
      "Finitions de prestige et contrôle qualité strict",
      "Suivi de chantier transparent, du devis à la remise des clés",
    ],
    contentSections: [
      {
        eyebrow: "Votre chantier pas à pas",
        title: "Étude technique & optimisation budgétaire",
        body:
          "Nous ne nous contentons pas d'une simple consultation. Nos ingénieurs analysent vos plans d'architecte pour optimiser les structures et vous proposer un devis détaillé, transparent et adapté aux réalités du terrain.",
        items: [],
      },
      {
        eyebrow: "Votre chantier pas à pas",
        title: "Fondations & gros œuvre (l'expertise EBM)",
        body:
          "C'est ici que notre puissance logistique intervient. Grâce à notre propre parc d'engins, nous lançons le terrassement et la structure (béton armé, maçonnerie) sans dépendre de tiers. Nous bâtissons le squelette de votre villa avec une précision millimétrée.",
        items: [],
      },
      {
        eyebrow: "Votre chantier pas à pas",
        title: "Mise hors d'eau & second œuvre",
        body:
          "Une fois la structure solide, nous assurons l'étanchéité totale et lançons les corps d'état techniques (électricité, plomberie, climatisation). Chaque étape est soumise à un contrôle qualité strict pour garantir un confort thermique et acoustique optimal.",
        items: [],
      },
      {
        eyebrow: "Votre chantier pas à pas",
        title: "Finitions de prestige & livraison",
        body:
          "Nous supervisons les travaux de finition (revêtements, menuiseries, peinture) avec un souci du détail artisanal. Après une inspection finale rigoureuse, nous vous remettons les clés d'un ouvrage certifié, prêt à accueillir votre foyer.",
        items: [],
      },
    ],
    showImageGallery: true,
    galleryEyebrow: "En images",
    galleryTitle: "Des villas pensées pour durer.",
    gallerySubtitle:
      "Volumes, matériaux, finitions — un aperçu de la rigueur EBM, de l'étude jusqu'à la livraison.",
    galleryImages: [
      {
        src: `${VILLA}/gallery-1.webp`,
        alt: "Étude technique d'un projet de villa : plans d'architecte et optimisation budgétaire.",
        caption: "Étude technique & optimisation budgétaire",
      },
      {
        src: `${VILLA}/gallery-2.webp`,
        alt: "Fondations et gros œuvre d'une villa : béton armé et structure.",
        caption: "Fondations & gros œuvre",
      },
      {
        src: `${VILLA}/gallery-3.webp`,
        alt: "Mise hors d'eau et second œuvre d'une villa en construction.",
        caption: "Mise hors d'eau & second œuvre",
      },
      {
        src: `${VILLA}/gallery-4.webp`,
        alt: "Finitions de prestige d'une villa : revêtements et menuiseries soignés.",
        caption: "Finitions de prestige",
      },
      {
        src: `${VILLA}/gallery-5.webp`,
        alt: "Villa achevée et livrée par EBM, prête à accueillir ses occupants.",
        caption: "Livraison",
      },
    ],
    faq: [
      {
        question: "Combien de temps dure la construction d'une villa ?",
        answer:
          "En général entre 8 et 12 mois selon la surface, le niveau de finition et les conditions du terrain. Nous établissons un planning par phase dès le devis pour garder une lecture claire de l'avancement.",
      },
      {
        question: "Proposez-vous les plans d'architecte ?",
        answer:
          "Nous collaborons avec votre architecte ou vous orientons vers nos partenaires. Nos ingénieurs vérifient et optimisent ensuite la structure pour sécuriser le budget et les délais.",
      },
      {
        question: "Quelles garanties offrez-vous sur les matériaux ?",
        answer:
          "Nous utilisons des matériaux certifiés issus de fournisseurs reconnus, pour une résistance optimale face au temps et aux conditions climatiques. Chaque phase est soumise à un contrôle qualité.",
      },
      {
        question: "Puis-je suivre l'avancement de mon chantier ?",
        answer:
          "Oui. Vous bénéficiez d'un suivi transparent avec photos et points d'avancement réguliers — la transparence est le socle de notre relation client.",
      },
    ],
    seoTitle: "Construction de villa clé en main en Tunisie | EBM Ben Mokhtar",
    seoDescription:
      "Construction de villa en Tunisie : étude technique, gros œuvre, second œuvre et finitions de prestige par l'entreprise BTP EBM Ben Mokhtar. Demandez votre devis.",
    ctaPrimaryLabel: "Obtenez votre devis",
    ctaSecondaryLabel: "Lancer le simulateur",
    order: 0,
  },
  {
    slug: "construction/immeubles-residences",
    navLabel: "Construction Immeubles & résidences",
    category: "Construction",
    heroEyebrow: "Programmes collectifs",
    heroImage: {
      src: `${IMMEUBLE}/hero.webp`,
      alt: "Immeuble résidentiel contemporain réalisé par EBM, façade soignée et balcons.",
    },
    title: "Construction d'immeubles et de résidences en Tunisie",
    intro:
      "EBM pilote des programmes multi-logements avec une coordination technique serrée : structure, corps d'état, finitions et livraison — sous un même toit, du devis à la remise des clés.",
    bullets: [
      "Structuration et gros œuvre adaptés aux projets multi-niveaux",
      "Interfaces architectes et bureaux de contrôle",
      "Pilotage des corps d'état sur planning partagé",
      "Livraison conforme aux exigences de performance et de sécurité",
    ],
    contentSections: [
      {
        eyebrow: "Méthode EBM",
        title: "Étude & montage technique",
        body:
          "Analyse des plans d'architecte, contrôle structurel et coordination avec les bureaux d'études. Nous optimisons la structure pour sécuriser le budget et les délais.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Gros œuvre multi-niveaux",
        body:
          "Terrassement, fondations, ossature béton armé et maçonnerie. Notre parc d'engins nous rend autonomes, même sur des projets à forte densité.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Second œuvre & corps d'état",
        body:
          "Enveloppe, étanchéité, lots techniques (électricité / plomberie / CVC) et menuiseries. Chaque corps d'état est piloté sur un planning partagé.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Finitions & livraison",
        body:
          "Revêtements, peintures, espaces communs et contrôles de conformité. Livraison par tranches ou en une fois selon votre programme.",
        items: [],
      },
    ],
    showImageGallery: true,
    galleryEyebrow: "En images",
    galleryTitle: "Nos résidences livrées.",
    gallerySubtitle:
      "Structures, halls, volumes — un aperçu de nos ouvrages collectifs menés avec rigueur.",
    galleryImages: [
      {
        src: `${IMMEUBLE}/gallery-1.webp`,
        alt: "Préparation et montage technique d'un programme résidentiel.",
        caption: "Étude & montage technique",
      },
      {
        src: `${IMMEUBLE}/gallery-2.webp`,
        alt: "Structure béton armé multi-niveaux d'une résidence en construction.",
        caption: "Gros œuvre multi-niveaux",
      },
      {
        src: `${IMMEUBLE}/gallery-3.webp`,
        alt: "Travaux d'enveloppe et de façade d'un immeuble résidentiel.",
        caption: "Second œuvre & corps d'état",
      },
      {
        src: `${IMMEUBLE}/gallery-4.webp`,
        alt: "Espaces communs et hall d'une résidence livrée par EBM.",
        caption: "Espaces communs",
      },
      {
        src: `${IMMEUBLE}/gallery-5.webp`,
        alt: "Complexe résidentiel achevé avec aménagements extérieurs.",
        caption: "Livraison",
      },
    ],
    faq: [
      {
        question: "Gérez-vous l'ensemble des corps d'état d'un programme ?",
        answer:
          "Oui. Du gros œuvre aux lots techniques et aux finitions, nous coordonnons tous les corps d'état sur un planning partagé, avec un interlocuteur unique.",
      },
      {
        question: "Travaillez-vous avec les bureaux de contrôle ?",
        answer:
          "Nous assurons les interfaces avec les architectes et les bureaux de contrôle pour garantir la conformité aux normes de performance et de sécurité.",
      },
      {
        question: "La livraison peut-elle se faire par tranches ?",
        answer:
          "Selon votre programme, la livraison peut s'organiser par tranches ou en une seule fois, avec contrôles de conformité à chaque étape.",
      },
    ],
    seoTitle: "Construction d'immeubles et de résidences en Tunisie | EBM",
    seoDescription:
      "Construction d'immeubles et de résidences en Tunisie : coordination technique, gros œuvre multi-niveaux et finitions par EBM Ben Mokhtar. Demandez votre devis.",
    ctaPrimaryLabel: "Demander un devis",
    ctaSecondaryLabel: "Lancer le simulateur",
    order: 1,
  },
  {
    slug: "renovation/maison-appartement",
    navLabel: "Rénovation maison et appartement",
    category: "Rénovation",
    heroEyebrow: "Rénovation",
    heroImage: {
      src: `${RENOV_APPART}/hero.webp`,
      alt: "Intérieur d'appartement rénové par EBM : finitions modernes et lumineuses.",
    },
    title: "Rénovation de maison et d'appartement en Tunisie",
    intro:
      "Réhabilitation et restructuration avec une approche technique maîtrisée : nous valorisons votre bien tout en sécurisant l'existant, avec un phasage clair et des nuisances réduites.",
    bullets: [
      "Diagnostic et phasage des travaux",
      "Reprise des réseaux électricité et plomberie",
      "Second œuvre et finitions coordonnés",
      "Réduction des nuisances et respect des délais",
    ],
    contentSections: [
      {
        eyebrow: "Méthode EBM",
        title: "Diagnostic & dépose",
        body:
          "Nous évaluons l'existant, identifions les contraintes structurelles et organisons la dépose avec protection des zones conservées. Le phasage est défini avant toute intervention.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Réseaux & remise à neuf technique",
        body:
          "Reprise des réseaux électriques et de plomberie, mise aux normes et préparation des supports. Une base technique saine avant les finitions.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Finitions & livraison",
        body:
          "Revêtements, peinture, menuiseries et agencement. Réception soignée d'un intérieur transformé, prêt à vivre.",
        items: [],
      },
    ],
    showImageGallery: true,
    galleryEyebrow: "En images",
    galleryTitle: "Avant / après : la transformation.",
    gallerySubtitle:
      "Du diagnostic aux finitions — un aperçu de nos rénovations menées proprement.",
    galleryImages: [
      {
        src: `${RENOV_APPART}/gallery-1.webp`,
        alt: "Phase de dépose lors d'une rénovation d'appartement.",
        caption: "Diagnostic & dépose",
      },
      {
        src: `${RENOV_APPART}/gallery-2.webp`,
        alt: "Reprise des réseaux électriques et de plomberie en rénovation.",
        caption: "Réseaux & remise à neuf",
      },
      {
        src: `${RENOV_APPART}/gallery-3.webp`,
        alt: "Préparation des supports, enduits et nouveaux revêtements de sol.",
        caption: "Supports & revêtements",
      },
      {
        src: `${RENOV_APPART}/gallery-4.webp`,
        alt: "Cuisine équipée et intérieur en cours de finition.",
        caption: "Finitions",
      },
      {
        src: `${RENOV_APPART}/gallery-5.webp`,
        alt: "Appartement entièrement rénové, lumineux et moderne.",
        caption: "Livraison",
      },
    ],
    faq: [
      {
        question: "Peut-on rénover en site occupé ?",
        answer:
          "Selon l'ampleur des travaux, oui. Nous organisons le phasage et les protections pour limiter les nuisances et sécuriser les zones conservées.",
      },
      {
        question: "Prenez-vous en charge la mise aux normes électrique ?",
        answer:
          "Oui. La reprise des réseaux et la mise aux normes font partie de notre méthode, avant la phase de finitions.",
      },
      {
        question: "Comment est établi le budget d'une rénovation ?",
        answer:
          "Après diagnostic de l'existant, nous proposons un devis détaillé par lot. Le simulateur EBM donne une première fourchette pour cadrer votre projet.",
      },
    ],
    seoTitle: "Rénovation de maison et d'appartement en Tunisie | EBM",
    seoDescription:
      "Rénovation maison et appartement en Tunisie : diagnostic, reprise des réseaux, second œuvre et finitions par EBM Ben Mokhtar. Demandez votre devis.",
    ctaPrimaryLabel: "Demander un devis",
    ctaSecondaryLabel: "Lancer le simulateur",
    order: 2,
  },
  {
    slug: "renovation/salle-de-bain",
    navLabel: "Rénovation salle de bain",
    category: "Rénovation",
    heroEyebrow: "Rénovation",
    heroImage: {
      src: `${RENOV_SDB}/hero.webp`,
      alt: "Salle de bain rénovée par EBM : douche à l'italienne et grands carreaux.",
    },
    title: "Rénovation de salle de bain en Tunisie",
    intro:
      "Mise aux normes, étanchéité et agencement : nous concevons une salle de bain durable, fonctionnelle et soignée, adaptée à votre espace et à votre budget.",
    bullets: [
      "Étanchéité et reprise des réseaux",
      "Carrelage et faïence posés avec précision",
      "Pose d'appareils et menuiseries",
      "Finitions adaptées à votre budget",
    ],
    contentSections: [
      {
        eyebrow: "Méthode EBM",
        title: "Dépose & préparation",
        body:
          "Retrait des appareils et revêtements existants, mise à nu des réseaux et préparation des supports. Une base saine pour une salle de bain durable.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Étanchéité & réseaux",
        body:
          "Système d'étanchéité sous carrelage, reprise de la plomberie et des évacuations. L'étape clé pour éviter les désordres dans le temps.",
        items: [],
      },
      {
        eyebrow: "Méthode EBM",
        title: "Carrelage, appareils & finitions",
        body:
          "Pose du carrelage et de la faïence, installation des appareils sanitaires et des menuiseries, puis finitions et éclairage soignés.",
        items: [],
      },
    ],
    showImageGallery: true,
    galleryEyebrow: "En images",
    galleryTitle: "Une salle de bain qui dure.",
    gallerySubtitle:
      "Étanchéité, carrelage, appareils — la rigueur EBM jusque dans les pièces d'eau.",
    galleryImages: [
      {
        src: `${RENOV_SDB}/gallery-1.webp`,
        alt: "Dépose d'une ancienne salle de bain avant rénovation.",
        caption: "Dépose & préparation",
      },
      {
        src: `${RENOV_SDB}/gallery-2.webp`,
        alt: "Système d'étanchéité et reprise de la plomberie d'une salle de bain.",
        caption: "Étanchéité & réseaux",
      },
      {
        src: `${RENOV_SDB}/gallery-3.webp`,
        alt: "Pose précise du carrelage et de la faïence en salle de bain.",
        caption: "Carrelage & faïence",
      },
      {
        src: `${RENOV_SDB}/gallery-4.webp`,
        alt: "Installation des appareils sanitaires et de la robinetterie.",
        caption: "Appareils & menuiseries",
      },
      {
        src: `${RENOV_SDB}/gallery-5.webp`,
        alt: "Salle de bain rénovée, fonctionnelle et élégante.",
        caption: "Finitions",
      },
    ],
    faq: [
      {
        question: "L'étanchéité est-elle systématiquement reprise ?",
        answer:
          "Oui. Un système d'étanchéité sous carrelage est mis en œuvre pour éviter les infiltrations et garantir la durabilité de la pièce d'eau.",
      },
      {
        question: "Peut-on transformer une baignoire en douche à l'italienne ?",
        answer:
          "Tout à fait. Nous adaptons l'agencement et les réseaux pour créer une douche à l'italienne, dans la mesure des contraintes techniques.",
      },
      {
        question: "Quel délai pour rénover une salle de bain ?",
        answer:
          "Selon l'ampleur, généralement de une à trois semaines. Le planning est précisé au devis, étape par étape.",
      },
    ],
    seoTitle: "Rénovation de salle de bain en Tunisie | EBM Ben Mokhtar",
    seoDescription:
      "Rénovation de salle de bain en Tunisie : étanchéité, réseaux, carrelage et finitions par EBM Ben Mokhtar. Demandez votre devis.",
    ctaPrimaryLabel: "Demander un devis",
    ctaSecondaryLabel: "Lancer le simulateur",
    order: 3,
  },
];
