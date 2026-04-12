"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { groupNavChildren, navSections, type NavSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Focus rings for the dark “top of home” bar */
const focusRingHero =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
const focusRingSolid =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function MegaMenuFooter({ hubHref }: { hubHref: string }) {
  return (
    <div className="mt-4 border-t border-border/70 pt-4">
      <Link
        href={hubHref}
        className="inline-flex min-h-9 w-full items-center justify-center rounded-lg border-2 border-primary/35 bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted sm:w-auto"
      >
        Tout voir
      </Link>
    </div>
  );
}

function MegaMenuContent({ section }: { section: NavSection }) {
  const children = section.children ?? [];
  const linkClass =
    "block rounded-md px-2 py-2 text-sm leading-snug transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover";

  if (section.title === "Services") {
    const groups = groupNavChildren(children);
    return (
      <NavigationMenuContent className="rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl md:min-w-[min(100vw-2rem,56rem)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {g.label}
              </p>
              <ul className="space-y-0.5">
                {g.items.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className={linkClass}>
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {section.hubHref ? <MegaMenuFooter hubHref={section.hubHref} /> : null}
      </NavigationMenuContent>
    );
  }

  if (section.title === "Nos projets") {
    return (
      <NavigationMenuContent className="rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl md:min-w-[min(100vw-2rem,40rem)]">
        <ul className="grid gap-1 sm:grid-cols-2">
          {children.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className={linkClass}>
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
        {section.hubHref ? <MegaMenuFooter hubHref={section.hubHref} /> : null}
      </NavigationMenuContent>
    );
  }

  return (
    <NavigationMenuContent className="rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl md:min-w-[min(100vw-2rem,24rem)]">
      <ul className="grid gap-1 sm:grid-cols-2">
        {children.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className={linkClass}>
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
      {section.hubHref ? <MegaMenuFooter hubHref={section.hubHref} /> : null}
    </NavigationMenuContent>
  );
}

/** Prevents layout-shift ↔ scrollY feedback loops at a single threshold. */
const SCROLL_ENTER = 28;
const SCROLL_EXIT = 2;

function NavLink({
  href,
  children,
  className,
  homeBlend,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  homeBlend?: boolean;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors",
        homeBlend
          ? active
            ? "text-zinc-50"
            : "text-zinc-300 hover:text-zinc-50"
          : active
            ? "font-semibold text-foreground"
            : "text-foreground/80 hover:text-foreground",
        homeBlend ? focusRingHero : focusRingSolid,
        className,
      )}
    >
      {children}
    </Link>
  );
}

function DesktopNavMenu({
  id,
  homeBlend,
  triggerClass,
  className,
}: {
  id?: string;
  homeBlend: boolean;
  triggerClass: string;
  className?: string;
}) {
  return (
    <nav id={id} aria-label="Navigation principale" className={cn("min-h-10 min-w-0", className)}>
      <NavigationMenu className="flex w-full max-w-none justify-center">
        <NavigationMenuList className="flex flex-nowrap items-center justify-center gap-x-0.5 overflow-x-auto overscroll-x-contain py-0.5 [scrollbar-width:none] sm:gap-x-1 md:gap-x-1.5 [&::-webkit-scrollbar]:hidden">
          {navSections.map((section) =>
            section.href ? (
              <NavigationMenuItem key={section.title}>
                <NavLink href={section.href} homeBlend={homeBlend} className="shrink-0 rounded-lg px-2 py-2 sm:px-2.5">
                  {section.title}
                </NavLink>
              </NavigationMenuItem>
            ) : section.hubHref && section.children ? (
              <NavigationMenuItem key={section.title} className="flex items-center gap-0">
                <NavLink href={section.hubHref} homeBlend={homeBlend} className="shrink-0 rounded-md px-2 py-2 sm:px-2.5">
                  {section.title}
                </NavLink>
                <NavigationMenuTrigger
                  aria-label={`Sous-menu ${section.title}`}
                  className={cn(triggerClass, "shrink-0 px-1.5!")}
                >
                  <span className="sr-only">Ouvrir le sous-menu {section.title}</span>
                </NavigationMenuTrigger>
                <MegaMenuContent section={section} />
              </NavigationMenuItem>
            ) : section.children ? (
              <NavigationMenuItem key={section.title}>
                <NavigationMenuTrigger className={triggerClass}>{section.title}</NavigationMenuTrigger>
                <MegaMenuContent section={section} />
              </NavigationMenuItem>
            ) : null,
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

function HeaderCtas({
  homeBlend,
  ctaBase,
}: {
  homeBlend: boolean;
  ctaBase: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className={cn(
          ctaBase,
          homeBlend
            ? cn(
                "border border-zinc-500/90 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-white hover:text-zinc-950",
                focusRingHero,
              )
            : cn(
                "border-2 border-foreground/35 bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground",
                focusRingSolid,
              ),
        )}
      >
        <Link href="/contact">Demander un devis</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className={cn(
          ctaBase,
          homeBlend
            ? cn(
                "bg-primary text-primary-foreground shadow-lg ring-2 ring-black/20 hover:bg-primary/90",
                focusRingHero,
              )
            : cn(
                "bg-primary text-primary-foreground shadow-md ring-1 ring-foreground/20 hover:bg-primary/90",
                focusRingSolid,
              ),
        )}
      >
        <Link href="/simulateur">Lancer le simulateur</Link>
      </Button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      setScrolled(window.scrollY > SCROLL_ENTER);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (prev) {
          return y > SCROLL_EXIT;
        }
        return y > SCROLL_ENTER;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homeBlend = isHome && !scrolled;

  const triggerClass = cn(
    navigationMenuTriggerStyle(),
    homeBlend &&
      "!bg-transparent text-sm font-medium text-zinc-200 shadow-none hover:bg-white/10 hover:text-zinc-50 data-open:bg-white/12 data-popup-open:bg-white/12 [&_svg]:text-zinc-400",
    homeBlend ? focusRingHero : focusRingSolid,
  );

  const ctaBase = "min-h-11 px-3.5 text-sm font-semibold sm:min-h-12 sm:px-5";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-[min-height,background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
        homeBlend
          ? "border-b border-white/10 bg-zinc-950/92 shadow-[0_8px_32px_rgba(0,0,0,0.42)] backdrop-blur-md supports-backdrop-filter:bg-zinc-950/88"
          : "border-b-2 border-foreground/15 bg-background/98 shadow-md backdrop-blur-md supports-backdrop-filter:bg-background/95",
        scrolled
          ? "min-h-14 md:min-h-16"
          : isHome
            ? "min-h-20 md:min-h-22 lg:min-h-23"
            : "min-h-16 md:min-h-19",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex min-h-[inherit] w-full max-w-[1920px] items-center justify-between gap-x-2 gap-y-2 px-4 sm:gap-x-4 sm:px-6 lg:gap-x-6 lg:px-8 xl:px-10",
          scrolled ? "py-2.5" : "py-3.5 md:py-4",
        )}
      >
        <Link
          href="/"
          className={cn(
            "relative z-30 flex shrink-0 items-center gap-2.5 rounded-md sm:gap-3",
            homeBlend ? focusRingHero : focusRingSolid,
          )}
        >
          <Image
            src="/logo.png"
            alt="EBM Ben Mokhtar — accueil"
            width={200}
            height={64}
            priority
            className={cn(
              "w-auto object-contain object-left transition-[max-height] duration-300",
              scrolled ? "max-h-8" : isHome ? "max-h-11 md:max-h-12" : "max-h-9 md:max-h-10",
            )}
          />
          <span
            className={cn(
              "hidden min-w-0 flex-col leading-tight transition-opacity duration-300 sm:flex",
              homeBlend && "text-zinc-50",
            )}
          >
            <span className="text-sm font-semibold tracking-tight">EBM Ben Mokhtar</span>
            <span
              className={cn(
                "text-xs",
                homeBlend ? "text-zinc-400" : "text-muted-foreground",
              )}
            >
              Entreprise de construction
            </span>
          </span>
        </Link>

        <DesktopNavMenu
          id="navigation-principale"
          homeBlend={homeBlend}
          triggerClass={triggerClass}
          className="hidden min-h-10 min-w-0 flex-1 items-center justify-center self-center px-1 lg:flex"
        />
        <div className="hidden shrink-0 items-center md:flex md:self-center">
          <HeaderCtas homeBlend={homeBlend} ctaBase={ctaBase} />
        </div>

        <div className="flex items-center gap-2 self-center lg:hidden">
          <Button
            size="sm"
            className={cn(
              "hidden min-h-10 px-4 font-semibold sm:inline-flex sm:min-h-11",
              homeBlend
                ? cn(
                    "bg-primary text-primary-foreground shadow-lg ring-2 ring-black/25 hover:bg-primary/90",
                    focusRingHero,
                  )
                : cn("shadow-md", focusRingSolid),
            )}
            asChild
          >
            <Link href="/simulateur">Simulateur</Link>
          </Button>
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-10 shrink-0 sm:size-11",
                homeBlend
                  ? cn(
                      "border border-zinc-600/80 bg-zinc-800/70 text-zinc-100 backdrop-blur-sm hover:bg-zinc-700/85 hover:text-zinc-50",
                      focusRingHero,
                    )
                  : cn(
                      "border-2 border-foreground/35 bg-background text-foreground hover:bg-muted",
                      focusRingSolid,
                    ),
              )}
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,380px)] p-0">
              <SheetHeader className="border-b px-4 py-4 text-left">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="EBM Ben Mokhtar"
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                  <SheetTitle className="text-base">Menu</SheetTitle>
                </div>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-4 p-4">
                  {navSections.map((section) => (
                    <div key={section.title}>
                      {section.href ? (
                        <NavLink href={section.href} className="block py-1 text-base">
                          {section.title}
                        </NavLink>
                      ) : (
                        <>
                          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                            {section.title}
                          </p>
                          {section.hubHref ? (
                            <Link
                              href={section.hubHref}
                              className="mb-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                            >
                              Tout voir
                            </Link>
                          ) : null}
                          <ul className="space-y-1">
                            {section.children?.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className={cn(
                                    "block rounded-md py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  )}
                                >
                                  {c.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="space-y-2 border-t p-4">
                <Button className="min-h-11 w-full font-semibold" asChild>
                  <Link href="/simulateur">Lancer le simulateur</Link>
                </Button>
                <Button variant="outline" className="min-h-11 w-full border-2 font-semibold" asChild>
                  <Link href="/contact">Demander un devis</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
