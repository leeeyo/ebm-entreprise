"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Menu,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { contactContent } from "@/content/contact";
import { navSections as defaultNavSections, type NavSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Mobile drawer — dark navy "editorial" panel.
 *
 * Sections are numbered (01, 02…) with hairline dividers. Expandable
 * items use a CSS grid-row height trick for silky disclosure without
 * layout thrash. Orange vertical rule marks the active section.
 * ------------------------------------------------------------------ */

type Props = {
  /** Whether the parent header is in "home hero blend" mode — affects trigger styling. */
  homeBlend: boolean;
  focusRingHero: string;
  focusRingSolid: string;
  /** Pass a phone number to surface in the bottom rail. Optional. */
  phone?: string;
  navSections?: NavSection[];
};

export function MobileNav({
  homeBlend,
  focusRingHero,
  focusRingSolid,
  phone = contactContent.phoneDisplay,
  navSections = defaultNavSections,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((s) => ({ ...s, [key]: !s[key] }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-10 shrink-0 sm:size-11",
          "border border-white/20 bg-white/5 text-zinc-100 backdrop-blur-sm",
          "hover:border-(--ebm-orange)/60 hover:bg-(--ebm-orange)/10 hover:text-white",
          homeBlend ? focusRingHero : focusRingSolid,
        )}
        aria-label="Ouvrir le menu de navigation"
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "flex h-full max-h-dvh w-[min(100vw,420px)] min-h-0 flex-col overflow-hidden border-l-0 p-0",
          "bg-(--ebm-navy) text-zinc-100",
          // Soften the default popover text colors
          "data-[side=right]:sm:max-w-[420px]",
        )}
      >
        {/* Atmospheric layers --------------------------------------- */}
        <span className="ebm-hatch pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <span
          className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-(--ebm-orange)/35 blur-[80px]"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-16 bottom-24 h-56 w-56 rounded-full bg-blue-400/14 blur-[80px]"
          aria-hidden
        />

        {/* Header --------------------------------------------------- */}
        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 pt-5 pb-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex min-w-0 flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)"
          >
            <Image
              src="/logo-ebm.png"
              alt="EBM Ben Mokhtar"
              width={160}
              height={56}
              className="h-10 w-auto object-contain"
              priority={false}
            />
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-(--ebm-orange)">
              EBM · Tunisie
            </span>
            <span className="font-heading text-sm font-medium tracking-tight text-zinc-300">
              Entreprise de construction
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className={cn(
              "group relative -mr-1 -mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full",
              "border border-white/15 bg-white/4 text-zinc-200 backdrop-blur-sm",
              "transition-[border-color,background-color,color] duration-300 ease-out",
              "hover:border-(--ebm-orange)/60 hover:bg-(--ebm-orange)/10 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)",
            )}
          >
            <X
              className="size-4 transition-transform duration-300 ease-out group-hover:rotate-90"
              aria-hidden
            />
          </button>
        </div>

        {/* Scrollable list ----------------------------------------- */}
        <nav
          aria-label="Navigation mobile"
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <ol className="px-1 py-2">
            {navSections.map((section, i) => (
              <MobileSection
                key={section.title}
                section={section}
                index={i}
                pathname={pathname}
                expanded={!!expanded[section.title]}
                onToggle={() => toggle(section.title)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ol>
        </nav>

        {/* Sticky footer rail -------------------------------------- */}
        <div className="relative z-10 border-t border-white/10 bg-(--ebm-navy)/90 px-5 pb-6 pt-5 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              size="lg"
              className={cn(
                "h-11 bg-(--ebm-orange) font-semibold text-zinc-950 shadow-lg",
                "ring-1 ring-(--ebm-orange)/50 hover:bg-(--ebm-orange)/92 hover:text-zinc-950",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)",
              )}
            >
              <Link href="/simulateur" onClick={() => setOpen(false)}>
                Simulateur
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "h-11 border-white/25 bg-white/4 font-semibold text-white",
                "hover:border-white/60 hover:bg-white/10 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)",
              )}
            >
              <Link href="/contact" onClick={() => setOpen(false)}>
                Devis
              </Link>
            </Button>
          </div>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={cn(
              "group/phone mt-4 flex items-center gap-3 text-sm text-zinc-300 transition-colors",
              "hover:text-white focus-visible:text-white focus-visible:outline-none",
            )}
          >
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-(--ebm-orange) transition-colors group-hover/phone:border-(--ebm-orange)/50 group-hover/phone:bg-(--ebm-orange)/10">
              <Phone className="size-3.5" aria-hidden />
            </span>
            <span className="font-mono tabular-nums tracking-wide">{phone}</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------- Row ---------------------------------------------------- */

function MobileSection({
  section,
  index,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  index: number;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasChildren = !!section.children?.length;
  const targetHref = section.href ?? section.hubHref ?? null;
  const active =
    targetHref === "/"
      ? pathname === "/"
      : targetHref
        ? pathname.startsWith(targetHref)
        : false;

  return (
    <li className="relative border-b border-white/7 last:border-b-0">
      {/* Orange rule — marks the active section */}
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-3 h-8 w-[2px] rounded-full transition-all duration-500 ease-out",
          active
            ? "bg-(--ebm-orange) opacity-100"
            : "bg-white/0 opacity-0",
        )}
        aria-hidden
      />

      <div className="flex items-stretch">
        {/* Primary row: either a direct link or a hub link */}
        {targetHref ? (
          <Link
            href={targetHref}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group/row relative flex min-w-0 flex-1 items-center gap-4 py-4 pl-5 pr-2",
              "text-left transition-colors duration-300",
              active
                ? "text-white"
                : "text-zinc-200 hover:text-white focus-visible:text-white",
              "focus-visible:outline-none",
            )}
          >
            <span
              className={cn(
                "shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums tracking-wider",
                active ? "text-(--ebm-orange)" : "text-zinc-500 group-hover/row:text-(--ebm-orange)",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate font-heading text-[1.15rem] font-medium leading-tight tracking-tight">
              {section.title}
            </span>
            {!hasChildren ? (
              <ArrowUpRight
                className={cn(
                  "size-4 shrink-0 -translate-x-1 opacity-0 transition-[transform,opacity] duration-300 ease-out",
                  "group-hover/row:translate-x-0 group-hover/row:opacity-100",
                  "text-(--ebm-orange)",
                )}
                aria-hidden
              />
            ) : null}
          </Link>
        ) : (
          <span className="relative flex min-w-0 flex-1 items-center gap-4 py-4 pl-5 pr-2">
            <span className="shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums tracking-wider text-zinc-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate font-heading text-[1.15rem] font-medium leading-tight tracking-tight text-zinc-200">
              {section.title}
            </span>
          </span>
        )}

        {hasChildren ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Masquer" : "Afficher"} les liens — ${section.title}`}
            className={cn(
              "relative mr-2 my-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full",
              "border border-white/10 bg-white/3 text-zinc-300",
              "transition-[border-color,background-color,color,transform] duration-300 ease-out",
              "hover:border-(--ebm-orange)/60 hover:bg-(--ebm-orange)/10 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)",
              expanded && "bg-(--ebm-orange)/10 border-(--ebm-orange)/60 text-white",
            )}
          >
            <Plus
              className={cn(
                "size-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                expanded && "rotate-45",
              )}
              aria-hidden
            />
          </button>
        ) : null}
      </div>

      {/* Disclosure panel */}
      {hasChildren ? (
        <div className="ebm-disclosure" data-open={expanded}>
          <div>
            <ul className="mb-3 ml-12 mr-2 flex flex-col gap-0.5 border-l border-white/10 pl-4 pt-1">
              {section.children!.map((c, ci) => (
                <li
                  key={c.href}
                  style={{ ["--ebm-sublink-index" as string]: ci }}
                  className="ebm-drawer-sublink"
                >
                  <Link
                    href={c.href}
                    onClick={onNavigate}
                    className={cn(
                      "group/sub relative flex items-center gap-3 rounded-md py-2 pr-2 text-[0.875rem] leading-snug text-zinc-300",
                      "transition-colors duration-200 hover:text-white focus-visible:text-white",
                      "focus-visible:outline-none",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-[-17px] top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-(--ebm-orange)",
                        "transition-[height] duration-300 ease-out",
                        "group-hover/sub:h-[60%] group-focus-visible/sub:h-[60%]",
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{c.title}</span>
                    <ArrowUpRight
                      className={cn(
                        "size-3.5 shrink-0 -translate-x-1 opacity-0 transition-[transform,opacity] duration-300",
                        "group-hover/sub:translate-x-0 group-hover/sub:opacity-100",
                        "text-(--ebm-orange)",
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}
