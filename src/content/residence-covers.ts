/**
 * Cover images in /public/residences/ — filenames match residence branding.
 * Paths are built with encodeURIComponent for safe URLs (spaces, accents).
 */
const FILENAME_BY_SLUG: Record<string, string> = {
  "residence-amira": "Résidence Amira.png",
  "residence-la-tulipe": "Résidence la tulipe.jpg",
  "residence-ennakhil": "Résidence Ennakhil.png",
  "residence-el-menyar": "Résidence el menyar.jpg",
  "residence-el-amen": "Résidence Al amen.jpg",
  "residence-el-ons": "Résidence el ons.jpg",
  "residence-el-khalil": "Résidence el Khalil.png",
  "residence-les-orangers": "Complexe les orangers mrezga nabeul.jpeg",
};

export function getResidenceCover(slug: string, titleForAlt: string): { src: string; alt: string } | null {
  const file = FILENAME_BY_SLUG[slug];
  if (!file) return null;
  return {
    src: `/residences/${encodeURIComponent(file)}`,
    alt: `${titleForAlt} — réalisation EBM Ben Mokhtar`,
  };
}
