"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactContent } from "@/content/contact";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navSections, type NavChild, type NavSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MegaMenuContent } from "./mega-menu";
import { MobileNav } from "./mobile-nav";

function subscribeHoverFinePointer(cb: () => void) {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function hoverFinePointerSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function hoverFinePointerServerSnapshot() {
  return false;
}

/** On desktop with real hover: mega menu opens on hover; block trigger click so the hub link is the only click target. */
function NavTriggerHoverOnly({ active, children }: { active: boolean; children: React.ReactNode }) {
  if (!active) return <>{children}</>;
  return (
    <span
      className="inline-flex h-full items-stretch"
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </span>
  );
}

/**
 * Unified navy palette. The navbar uses a single solid color on every state
 * and every route — no color transitions, no translucency-over-hero mode.
 * Only the inner row padding / logo size shrink on scroll.
 */
const focusRingNav =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)";

/** Prevents layout-shift ↔ scrollY feedback loops at a single threshold. */
const SCROLL_ENTER = 28;
const SCROLL_EXIT = 2;

function DesktopHubMegaTrigger({
  section,
  triggerClass,
  menuOpensOnHover,
}: {
  section: NavSection & { hubHref: string; children: NavChild[] };
  triggerClass: string;
  menuOpensOnHover: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(section.hubHref);
  const linkClass = cn(
    navigationMenuTriggerStyle(),
    triggerClass,
    "relative inline-flex h-full w-max max-w-[min(100vw,14rem)] items-center gap-1 truncate rounded-none px-3 py-0 text-sm font-medium leading-none sm:max-w-none",
    active ? "text-white" : "text-zinc-300 hover:text-white",
    focusRingNav,
  );

  return (
    <NavTriggerHoverOnly active={menuOpensOnHover}>
      <NavigationMenuTrigger
        nativeButton={false}
        aria-label={`${section.title}, menu au survol`}
        render={
          <Link href={section.hubHref} className={linkClass} aria-current={active ? "page" : undefined}>
            <span className="truncate">{section.title}</span>
            <ChevronDown
              className={cn(
                "relative top-px size-3 shrink-0 transition duration-300",
                "group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180",
                active ? "text-(--ebm-orange)" : "text-zinc-400",
              )}
              aria-hidden
            />
            {/* Active orange tab-indicator — matches NavLink indicator */}
            <span
              className={cn(
                "pointer-events-none absolute inset-x-3 top-0 h-[2px] origin-center scale-x-0 rounded-b-full bg-(--ebm-orange) transition-transform duration-300",
                active && "scale-x-100",
              )}
              aria-hidden
            />
          </Link>
        }
      />
    </NavTriggerHoverOnly>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-full items-center text-sm font-medium leading-none transition-colors",
        active ? "text-white" : "text-zinc-300 hover:text-white",
        focusRingNav,
        className,
      )}
    >
      <span>{children}</span>
      {/* Active orange tab-indicator — pinned to the top of the nav row */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-3 top-0 h-[2px] origin-center scale-x-0 rounded-b-full bg-(--ebm-orange) transition-transform duration-300",
          active && "scale-x-100",
        )}
        aria-hidden
      />
    </Link>
  );
}

function DesktopNavMenu({
  id,
  triggerClass,
  className,
}: {
  id?: string;
  triggerClass: string;
  className?: string;
}) {
  const menuOpensOnHover = useSyncExternalStore(
    subscribeHoverFinePointer,
    hoverFinePointerSnapshot,
    hoverFinePointerServerSnapshot,
  );

  return (
    <nav id={id} aria-label="Navigation principale" className={cn("min-w-0", className)}>
      <NavigationMenu delay={80} closeDelay={120} className="flex h-full w-full max-w-none justify-center">
        <NavigationMenuList className="flex h-full flex-nowrap items-stretch justify-center gap-x-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:gap-x-2 md:gap-x-3 lg:gap-x-4 xl:gap-x-6 [&::-webkit-scrollbar]:hidden">
          {navSections.map((section) =>
            section.href ? (
              <NavigationMenuItem key={section.title} className="h-full">
                <NavLink href={section.href} className="shrink-0 rounded-none px-3">
                  {section.title}
                </NavLink>
              </NavigationMenuItem>
            ) : section.hubHref && section.children ? (
              <NavigationMenuItem key={section.title} value={section.title} className="h-full">
                <DesktopHubMegaTrigger
                  section={section as NavSection & { hubHref: string; children: NavChild[] }}
                  triggerClass={triggerClass}
                  menuOpensOnHover={menuOpensOnHover}
                />
                <MegaMenuContent section={section} />
              </NavigationMenuItem>
            ) : section.children ? (
              <NavigationMenuItem key={section.title} className="h-full">
                <NavTriggerHoverOnly active={menuOpensOnHover}>
                  <NavigationMenuTrigger className={triggerClass}>{section.title}</NavigationMenuTrigger>
                </NavTriggerHoverOnly>
                <MegaMenuContent section={section} />
              </NavigationMenuItem>
            ) : null,
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

/**
 * Compact contact strip between the logo and the CTAs.
 * Progressive disclosure: phone only @ md, phone + email @ lg, phone + email + address @ xl.
 */
function HeaderMeta() {
  const itemBase =
    "group/meta inline-flex items-center gap-2 text-[0.75rem] font-medium leading-none text-zinc-300 transition-colors hover:text-white";
  const iconWrap =
    "inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--ebm-orange) transition-colors group-hover/meta:border-(--ebm-orange)/45 group-hover/meta:bg-(--ebm-orange)/10";
  const divider = "hidden h-6 w-px bg-white/10 xl:inline-block";

  return (
    <div
      className={cn(
        "hidden min-w-0 flex-1 items-center justify-center",
        "md:flex md:gap-3 lg:gap-5 xl:gap-6",
      )}
      aria-label="Coordonnées de l'entreprise"
    >
      <a
        href={`tel:${contactContent.phoneHref}`}
        className={itemBase}
        aria-label={`Appeler ${contactContent.phoneDisplay}`}
      >
        <span className={iconWrap}>
          <Phone className="size-3.5" aria-hidden />
        </span>
        <span className="whitespace-nowrap tabular-nums tracking-wide">
          {contactContent.phoneDisplay}
        </span>
      </a>

      <span className={divider} aria-hidden />

      <a
        href={`mailto:${contactContent.email}`}
        className={cn(itemBase, "hidden lg:inline-flex")}
        aria-label={`Écrire à ${contactContent.email}`}
      >
        <span className={iconWrap}>
          <Mail className="size-3.5" aria-hidden />
        </span>
        <span className="whitespace-nowrap">{contactContent.email}</span>
      </a>

      <span className={divider} aria-hidden />

      <span
        className={cn(itemBase, "pointer-events-none hidden cursor-default xl:inline-flex")}
      >
        <span className={iconWrap}>
          <MapPin className="size-3.5" aria-hidden />
        </span>
        <span className="whitespace-nowrap">{contactContent.addressShort}</span>
      </span>
    </div>
  );
}

function HeaderCtas({ ctaBase }: { ctaBase: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className={cn(
          ctaBase,
          "border border-white/30 bg-transparent text-white shadow-none",
          "hover:border-white/60 hover:bg-white/10 hover:text-white",
          focusRingNav,
        )}
      >
        <Link href="/contact">Demander un devis</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className={cn(
          ctaBase,
          "border border-transparent bg-(--ebm-orange) text-zinc-950 shadow-md",
          "hover:bg-(--ebm-orange)/92 hover:text-zinc-950",
          focusRingNav,
        )}
      >
        <Link href="/simulateur">Lancer le simulateur</Link>
      </Button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
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

  const triggerClass = cn(
    navigationMenuTriggerStyle(),
    "!bg-transparent text-sm font-medium text-zinc-200 shadow-none",
    "hover:bg-white/10 hover:text-white",
    "data-open:bg-white/10 data-popup-open:bg-white/10",
    "[&_svg]:text-zinc-400",
    focusRingNav,
  );

  const ctaBase = "h-11 px-4 text-sm font-semibold sm:h-11 sm:px-5";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full",
        // Single unified palette, every page, every scroll state
        "border-b border-white/10 bg-(--ebm-navy) text-zinc-100",
        "shadow-[0_6px_24px_rgba(2,6,23,0.4)]",
      )}
    >
      {/* Signature orange hairline at the very bottom — subtle, brand-true */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-linear-to-r from-transparent via-(--ebm-orange)/70 to-transparent"
        aria-hidden
      />

      {/* Row 1 — brand + actions */}
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-[1920px] items-center justify-between gap-x-3 px-4 sm:gap-x-4 sm:px-6 lg:px-8 xl:px-10",
          "transition-[height] duration-300 ease-out",
          scrolled ? "h-14" : "h-16 md:h-20",
        )}
      >
        <Link
          href="/"
          className={cn(
            "relative z-30 flex shrink-0 items-center gap-2.5 rounded-md sm:gap-3",
            focusRingNav,
          )}
        >
          <Image
            src="/logo-ebm.png"
            alt="EBM Ben Mokhtar — accueil"
            width={200}
            height={64}
            priority
            className={cn(
              "w-auto object-contain object-left transition-[max-height] duration-300",
              scrolled ? "max-h-8" : "max-h-9 md:max-h-11",
            )}
          />
          <span className="hidden min-w-0 flex-col leading-tight text-zinc-50 sm:flex">
            <span className="font-heading text-sm font-semibold tracking-tight md:text-[0.95rem]">
              EBM Ben Mokhtar
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-(--ebm-orange)/90">
              Entreprise de construction
            </span>
          </span>
        </Link>

        <HeaderMeta />

        <div className="hidden shrink-0 items-center md:flex">
          <HeaderCtas ctaBase={ctaBase} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            size="sm"
            className={cn(
              "hidden h-10 px-4 font-semibold sm:inline-flex sm:h-11",
              "border border-transparent bg-(--ebm-orange) text-zinc-950 shadow-md hover:bg-(--ebm-orange)/92 hover:text-zinc-950",
              focusRingNav,
            )}
            asChild
          >
            <Link href="/simulateur">Simulateur</Link>
          </Button>
          <MobileNav
            homeBlend
            focusRingHero={focusRingNav}
            focusRingSolid={focusRingNav}
          />
        </div>
      </div>

      {/* Row 2 — full-width navigation (desktop only) */}
      <div
        className={cn(
          "relative hidden border-t border-white/8 lg:block",
          "transition-[height] duration-300 ease-out",
          scrolled ? "h-11" : "h-12",
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-stretch px-4 sm:px-6 lg:px-8 xl:px-10">
          <DesktopNavMenu
            id="navigation-principale"
            triggerClass={triggerClass}
            className="flex h-full min-w-0 flex-1 items-stretch justify-center"
          />
        </div>
      </div>
    </header>
  );
}
