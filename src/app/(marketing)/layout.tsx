import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixelBootstrap } from "@/components/analytics/meta-pixel-bootstrap";
import { ThirdPartyAnalytics } from "@/components/analytics/third-party-analytics";
import { MarketingMain } from "@/components/layout/marketing-main";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { listProjects } from "@/lib/cms-content";
import { navSectionsWithProjects } from "@/lib/navigation";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const projects = await listProjects({ publishedOnly: true });
  const navSections = navSectionsWithProjects(projects);

  return (
    <>
      <GoogleAnalytics />
      <MetaPixelBootstrap />
      <Suspense fallback={null}>
        <ThirdPartyAnalytics />
      </Suspense>
      <a
        href="#contenu-principal"
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-100 translate-y-[-200%] rounded-md px-4 py-2 text-sm font-medium text-balance shadow-lg transition-[transform,opacity] focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background opacity-0"
      >
        Aller au contenu principal
      </a>
      <SiteHeader navSections={navSections} />
      <MarketingMain>{children}</MarketingMain>
      <SiteFooter />
    </>
  );
}
