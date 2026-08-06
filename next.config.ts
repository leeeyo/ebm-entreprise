import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/service/14/genie-civil-et-batiment", destination: "/construction", permanent: true },
      {
        source: "/genie-civil-et-batiment/construction-de-villas",
        destination: "/construction/villa",
        permanent: true,
      },
      {
        source: "/genie-civil-et-batiment/projets-pour-promoteurs-immobiliers",
        destination: "/construction/immeubles-residences",
        permanent: true,
      },
      {
        source: "/genie-civil-et-batiment/travaux-de-renovation",
        destination: "/renovation",
        permanent: true,
      },
      { source: "/fluide/chauffage", destination: "/services/fluide/chauffage", permanent: true },
      { source: "/fluide/sanitaire", destination: "/services/fluide/sanitaire", permanent: true },
      {
        source: "/fluide/climatisation",
        destination: "/services/fluide/climatisation",
        permanent: true,
      },
      {
        source: "/electricite/courant-faible",
        destination: "/services/electricite/courant-faible",
        permanent: true,
      },
      {
        source: "/service/16/menuiserie-aluminium",
        destination: "/services/menuiserie/aluminium",
        permanent: true,
      },
      {
        source: "/service/17/piscines",
        destination: "/services/amenagements-exterieurs/piscine",
        permanent: true,
      },
      {
        source: "/service/18/etancheite-et-isolation",
        destination: "/services/menuiserie/etancheite-isolation",
        permanent: true,
      },
      { source: "/service/20/electricite", destination: "/services", permanent: true },
      {
        source: "/politique-de-confidentialite",
        destination: "/confidentialite",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
