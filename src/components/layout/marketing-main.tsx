"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Fixed header does not occupy layout height; home needs no top padding so the hero
 * can sit under the transparent bar. Other routes need offset so content is not hidden.
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
        !isHome && "pt-20 md:pt-[4.75rem]",
      )}
    >
      {children}
    </main>
  );
}
