/** Desktop / large viewports — hero background video (H.264 MP4). */
export const HERO_VIDEO_SRC = "/hero/residence-amira-hero.mp4" as const;

/** Narrow viewports — lighter or portrait-cropped variant (see `<source media>` in hero). */
export const HERO_VIDEO_MOBILE_SRC = "/hero/residence-amira-hero-mobile.mp4" as const;

/** Breakpoint (px) matching `source media` / preload: below = mobile asset, from here up = desktop asset. */
export const HERO_VIDEO_LAYOUT_MIN_WIDTH_PX = 768 as const;

const RESIDENCE_AMIRA_COVER =
  `/residences/${encodeURIComponent("Résidence Amira.png")}` as const;

/** Poster until the hero video starts playing. */
export const HERO_FALLBACK_IMAGE_SRC = RESIDENCE_AMIRA_COVER;

/** Crossfade target when the hero video ends. */
export const HERO_VIDEO_END_STATIC_SRC = RESIDENCE_AMIRA_COVER;
