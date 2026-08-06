type ProjectPublishingInput = {
  title?: string;
  shortDescription?: string;
  body?: string;
  city?: string;
  type?: string;
  year?: string;
  surface?: string;
  lots?: string;
  coverImageSrc?: string;
};

const GENERIC_LOCATIONS = new Set(["tunisie", "grand tunis"]);

export function getMissingProjectPublicationFields(project: ProjectPublishingInput) {
  const missing: string[] = [];
  const city = project.city?.trim() ?? "";
  const surface = project.surface?.trim() ?? "";

  if (!project.title?.trim()) missing.push("nom du projet");
  if (!project.shortDescription?.trim()) missing.push("résumé");
  if (!project.body?.trim()) missing.push("description détaillée");
  if (!city || GENERIC_LOCATIONS.has(city.toLocaleLowerCase("fr"))) {
    missing.push("localisation précise");
  }
  if (!project.type?.trim()) missing.push("typologie");
  if (!project.year?.trim()) missing.push("année ou statut temporel");
  if (!surface || !/\d/.test(surface) || !/m(?:²|2)/i.test(surface)) {
    missing.push("surface réelle en m²");
  }
  if (!project.lots?.trim()) missing.push("lots réalisés");
  if (!project.coverImageSrc?.trim()) missing.push("photo de couverture");

  return missing;
}
