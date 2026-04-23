import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export type TrustItem = {
  icon: LucideIcon;
  label: string;
  hint?: string;
};

export type TrustStripProps = {
  items: TrustItem[];
  className?: string;
  /** Visual variant. `soft` = muted card look; `inline` = transparent row. */
  variant?: "soft" | "inline";
};

/** A short row of reassurance items (3–4 icon + text lines). */
export function TrustStrip({ items, variant = "soft", className }: TrustStripProps) {
  return (
    <ul
      className={cn(
        "grid gap-3 sm:gap-4",
        items.length === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-3",
        variant === "soft"
          ? "rounded-2xl border border-border/65 bg-card/80 p-4 backdrop-blur-sm sm:p-5"
          : "",
        className,
      )}
    >
      {items.map((item, idx) => (
        <Reveal key={item.label} delayMs={idx * 60} variant="fade-up">
          <li className="flex items-center gap-3">
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
              aria-hidden
            >
              <item.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              {item.hint ? (
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              ) : null}
            </div>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}
