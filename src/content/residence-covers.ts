/**
 * Cover images in /public/residences/ — filenames match residence branding.
 * Paths are built with encodeURIComponent for safe URLs (spaces, accents).
 */
const FILENAME_BY_SLUG: Record<string, string> = {
  "residence-amira": "Résidence Amira.webp",
  "residence-la-tulipe": "Résidence la tulipe.webp",
  "residence-ennakhil": "Résidence Ennakhil.webp",
  "residence-el-menyar": "Résidence el menyar.webp",
  "residence-el-amen": "Résidence Al amen.webp",
  "residence-el-ons": "Résidence el ons.webp",
  "residence-el-khalil": "Résidence el Khalil.webp",
  "residence-les-orangers": "Complexe les orangers mrezga nabeul.webp",
};

export function getResidenceCover(slug: string, titleForAlt: string): { src: string; alt: string } | null {
  const file = FILENAME_BY_SLUG[slug];
  if (!file) return null;
  return {
    src: `/residences/${encodeURIComponent(file)}`,
    alt: `${titleForAlt} — réalisation EBM Ben Mokhtar`,
  };
}
