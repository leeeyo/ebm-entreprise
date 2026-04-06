import { MarketingMain } from "@/components/layout/marketing-main";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu-principal"
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-100 -translate-y-[200%] rounded-md px-4 py-2 text-sm font-medium text-balance shadow-lg transition-[transform,opacity] focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background opacity-0"
      >
        Aller au contenu principal
      </a>
      <SiteHeader />
      <MarketingMain>{children}</MarketingMain>
      <SiteFooter />
    </>
  );
}
