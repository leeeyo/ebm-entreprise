"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NavigationMenuContent } from "@/components/ui/navigation-menu";
import { groupNavChildren, type NavChild, type NavSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Editorial split-plane megamenu.
 *
 * Left  → "Chapter" slab (dark navy, hatch texture, display title +
 *         proposition + "Tout voir →" CTA).
 * Right → Meticulously-gridded link index with hairline hover rule,
 *         eyebrow labels and kinetic arrows.
 *
 * Three widths adapt to content density:
 *   - Services       → wide (4 category columns)
 *   - Nos projets    → medium (2 columns, 8 residences)
 *   - Everything else → compact (1 column)
 * ------------------------------------------------------------------ */

const PROPOSITIONS: Record<string, string> = {
  Construction: "Bâtir neuf, avec rigueur — villas et programmes collectifs.",
  Rénovation: "Valoriser l'existant, du diagnostic aux finitions.",
  Services: "Quatre pôles techniques coordonnés pour chaque chantier.",
  "Nos projets": "Des chantiers qui parlent pour nous.",
};

const EYEBROWS: Record<string, string> = {
  Construction: "Neuf résidentiel",
  Rénovation: "Rénovation globale",
  Services: "Expertise technique",
  "Nos projets": "Réalisations",
};

const WIDTHS = {
  services: "md:min-w-[min(100vw-2rem,72rem)] md:max-w-[min(100vw-2rem,72rem)]",
  projects: "md:min-w-[min(100vw-2rem,48rem)] md:max-w-[min(100vw-2rem,48rem)]",
  compact: "md:min-w-[min(100vw-2rem,42rem)] md:max-w-[min(100vw-2rem,42rem)]",
} as const;

/* --- Chapter slab -------------------------------------------------- */

function ChapterSlab({
  section,
  eyebrow,
  proposition,
}: {
  section: NavSection;
  eyebrow: string;
  proposition: string;
}) {
  return (
    <aside
      className={cn(
        "ebm-nav-chapter relative isolate flex shrink-0 flex-col justify-between overflow-hidden",
        "bg-ebm-navy text-zinc-100",
        "w-full md:w-64",
        "p-7",
      )}
    >
      {/* Diagonal hatch + soft top vignette */}
      <span className="ebm-hatch pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.22),transparent_70%)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute left-0 top-7 h-10 w-[2px] bg-(--ebm-orange)"
        aria-hidden
      />

      <div className="relative">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-(--ebm-orange)">
          {eyebrow}
        </p>
        <h3 className="font-heading mt-4 text-balance text-2xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-[1.7rem]">
          {section.title}
        </h3>
        <p className="mt-4 max-w-[22ch] text-[0.8125rem] leading-relaxed text-zinc-300">
          {proposition}
        </p>
      </div>

      {section.hubHref ? (
        <Link
          href={section.hubHref}
          className={cn(
            "group/cta relative mt-8 inline-flex items-center gap-2 self-start",
            "text-sm font-semibold text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ebm-orange) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ebm-navy)",
          )}
        >
          <span className="relative">
            Tout voir
            <span
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-100 bg-white/70 transition-transform duration-500 ease-out group-hover/cta:scale-x-0"
              aria-hidden
            />
            <span
              className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-(--ebm-orange) transition-transform duration-500 ease-out delay-75 group-hover/cta:scale-x-100"
              aria-hidden
            />
          </span>
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </aside>
  );
}

/* --- Link row (two-tier; hairline hover rule; kinetic arrow) ------- */

function IndexLink({
  href,
  children,
  index = 0,
}: {
  href: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <Link
      href={href}
      style={{ ["--ebm-nav-index" as string]: index }}
      className={cn(
        "ebm-nav-item group/link relative flex items-start gap-3 py-2 pl-4 pr-2",
        "text-[0.9375rem] font-medium leading-snug text-foreground/85",
        "transition-[color,transform] duration-300 ease-out",
        "hover:text-foreground focus-visible:text-foreground",
        "focus-visible:outline-none",
      )}
    >
      {/* Hairline — grows from 0 → full height on hover/focus */}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-(--ebm-orange)",
          "transition-[height] duration-300 ease-out",
          "group-hover/link:h-[70%] group-focus-visible/link:h-[70%]",
        )}
        aria-hidden
      />
      <span className="flex-1 text-pretty leading-snug">{children}</span>
      <ArrowRight
        className={cn(
          "mt-0.5 size-3.5 shrink-0 self-center -translate-x-1 opacity-0",
          "transition-[transform,opacity] duration-300 ease-out",
          "group-hover/link:translate-x-0 group-hover/link:opacity-100",
          "group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100",
          "text-(--ebm-orange)",
        )}
        aria-hidden
      />
    </Link>
  );
}

/* --- Variants ------------------------------------------------------ */

function ServicesMega({ section }: { section: NavSection }) {
  const groups = groupNavChildren(section.children ?? []);
  const eyebrow = EYEBROWS[section.title] ?? "Savoir-faire";
  const proposition = PROPOSITIONS[section.title] ?? "";

  return (
    <div className="relative flex overflow-hidden">
      <ChapterSlab section={section} eyebrow={eyebrow} proposition={proposition} />

      <div className="relative flex-1 bg-popover p-6 sm:p-7">
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, gi) => (
            <div key={g.label} className="min-w-0">
              <div className="mb-3 flex items-baseline gap-2 pl-4">
                <span className="text-[0.7rem] font-mono font-semibold tabular-nums text-(--ebm-orange)">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {g.label}
                </p>
              </div>
              <hr className="ml-4 mb-2 border-border/80" />
              <ul className="-mx-1 flex flex-col">
                {g.items.map((c, i) => (
                  <li key={c.href}>
                    <IndexLink href={c.href} index={gi * 4 + i}>
                      {c.title}
                    </IndexLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsMega({ section }: { section: NavSection }) {
  const children = section.children ?? [];
  const eyebrow = EYEBROWS[section.title] ?? "Réalisations";
  const proposition = PROPOSITIONS[section.title] ?? "";

  return (
    <div className="relative flex overflow-hidden">
      <ChapterSlab section={section} eyebrow={eyebrow} proposition={proposition} />

      <div className="relative flex-1 bg-popover p-6 sm:p-7">
        <div className="mb-3 flex items-baseline gap-2 pl-4">
          <span className="text-[0.7rem] font-mono font-semibold tabular-nums text-(--ebm-orange)">
            {String(children.length).padStart(2, "0")}
          </span>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Résidences livrées & en cours
          </p>
        </div>
        <hr className="ml-4 mb-2 border-border/80" />
        <ul className="-mx-1 grid gap-x-6 sm:grid-cols-2">
          {children.map((c, i) => (
            <li key={c.href}>
              <ProjectIndexLink child={c} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProjectIndexLink({ child, index }: { child: NavChild; index: number }) {
  return (
    <Link
      href={child.href}
      style={{ ["--ebm-nav-index" as string]: index }}
      className={cn(
        "ebm-nav-item group/link relative flex items-start gap-3 py-2 pl-4 pr-2",
        "leading-snug text-foreground/85 transition-colors duration-300 ease-out",
        "hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-(--ebm-orange)",
          "transition-[height] duration-300 ease-out",
          "group-hover/link:h-[70%] group-focus-visible/link:h-[70%]",
        )}
        aria-hidden
      />
      <span className="mt-0.5 w-6 shrink-0 text-[0.7rem] font-mono font-semibold tabular-nums text-muted-foreground group-hover/link:text-(--ebm-orange)">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-heading flex-1 text-pretty text-[0.9375rem] font-medium leading-snug">
        {child.title}
      </span>
      <ArrowRight
        className={cn(
          "mt-0.5 size-3.5 shrink-0 self-center -translate-x-1 opacity-0 transition-[transform,opacity] duration-300 ease-out",
          "group-hover/link:translate-x-0 group-hover/link:opacity-100",
          "text-(--ebm-orange)",
        )}
        aria-hidden
      />
    </Link>
  );
}

function CompactMega({ section }: { section: NavSection }) {
  const children = section.children ?? [];
  const eyebrow = EYEBROWS[section.title] ?? "Savoir-faire";
  const proposition = PROPOSITIONS[section.title] ?? "";

  return (
    <div className="relative flex overflow-hidden">
      <ChapterSlab section={section} eyebrow={eyebrow} proposition={proposition} />

      <div className="relative flex-1 bg-popover p-6 sm:p-7">
        <div className="mb-3 flex items-baseline gap-2 pl-4">
          <span className="text-[0.7rem] font-mono font-semibold tabular-nums text-(--ebm-orange)">
            {String(children.length).padStart(2, "0")}
          </span>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Prestations
          </p>
        </div>
        <hr className="ml-4 mb-2 border-border/80" />
        <ul className="-mx-1 flex flex-col">
          {children.map((c, i) => (
            <li key={c.href}>
              <IndexLink href={c.href} index={i}>
                {c.title}
              </IndexLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --- Public export ------------------------------------------------- */

export function MegaMenuContent({ section }: { section: NavSection }) {
  const isServices = section.title === "Services";
  const isProjects = section.title === "Nos projets";

  const widthClass = isServices
    ? WIDTHS.services
    : isProjects
      ? WIDTHS.projects
      : WIDTHS.compact;

  return (
    <NavigationMenuContent
      className={cn(
        "overflow-hidden rounded-lg p-0 text-popover-foreground",
        widthClass,
      )}
    >
      {isServices ? (
        <ServicesMega section={section} />
      ) : isProjects ? (
        <ProjectsMega section={section} />
      ) : (
        <CompactMega section={section} />
      )}
    </NavigationMenuContent>
  );
}
