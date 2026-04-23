import { projets } from "@/content/projets";

/**
 * Infinite CSS-only marquee of residence names — zero JS.
 * Server-rendered; pure transform animation defined in globals.css.
 */
export function MarqueeProjects() {
  const items = projets.map((p) => p.title);
  const doubled = [...items, ...items];

  return (
    <section
      aria-label="Résidences EBM"
      className="cv-auto relative border-y border-border/40 bg-muted/30 py-5"
      style={{ containIntrinsicSize: "auto 72px" }}
    >
      <div className="ebm-marquee overflow-hidden">
        <ul className="ebm-marquee-track gap-10 pr-10 text-sm font-medium tracking-wide text-foreground/70 sm:gap-14 sm:pr-14">
          {doubled.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-10 sm:gap-14"
              aria-hidden={i >= items.length ? "true" : undefined}
            >
              <span className="whitespace-nowrap">{name}</span>
              <span
                className="inline-block size-1 rounded-full bg-primary/50"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
