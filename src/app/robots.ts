import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/uploads/"],
        disallow: [
          "/admin/",
          "/api/admin/",
          "/api/auth/",
          "/api/contact",
          "/api/leads",
          "/api/meta/",
          "/api/upload",
          "/api/simulator/",
          "/acces-refuse",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
