"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Fixed header does not occupy layout height. Non-home routes use pt-* so content clears
 * the bar; the home hero adds its own top padding in HeroSection.
 */
export function MarketingMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      id="contenu-principal"
      tabIndex={-1}
      className={cn(
        "flex-1 scroll-mt-24 outline-none",
        !isHome && "pt-20 md:pt-19",
      )}
    >
      {children}
    </main>
  );
}
