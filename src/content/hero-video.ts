/** Public path to the homepage hero background video (H.264 MP4). */
export const HERO_VIDEO_SRC = "/hero/ebm-hero-video.mp4" as const;

/** Shown until the hero video is playing; Résidence el Menyar (cover photo). */
export const HERO_FALLBACK_IMAGE_SRC =
  `/residences/${encodeURIComponent("Résidence el menyar.jpg")}` as const;
