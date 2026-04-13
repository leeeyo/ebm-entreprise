import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

function metadataBaseUrl(): URL {
  const auth = process.env.AUTH_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();

  const candidate =
    auth ||
    (vercel ? `https://${vercel}` : null) ||
    "http://localhost:3090";

  const normalized =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3090");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "EBM Ben Mokhtar — Entreprise de construction Tunisie",
    template: "%s | EBM Ben Mokhtar",
  },
  description:
    "Construction bâtiment Tunisie, génie civil et projets clé en main. Entreprise BTP Ben Mokhtar — simulateur de budget et réalisations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
