export function getSiteOrigin(): string {
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const authUrl = process.env.AUTH_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();

  const candidate =
    publicUrl ||
    authUrl ||
    (vercelUrl ? `https://${vercelUrl}` : null) ||
    "http://localhost:3000";

  const normalized =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  try {
    const url = new URL(normalized);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}
