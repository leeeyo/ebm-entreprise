"use client";

import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

export type FaqAccordionProps = {
  items: FaqItem[];
  /** Allow multiple open items. Defaults to false (one open at a time). */
  allowMultiple?: boolean;
  className?: string;
};

/**
 * Animated max-height accordion. Reduced-motion users get an instant reveal
 * via the global CSS media query on `.ebm-faq-panel`.
 */
export function FaqAccordion({
  items,
  allowMultiple = false,
  className,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, idx) => (
        <Reveal key={item.q} delayMs={idx * 40} variant="fade-up">
          <li>
            <FaqRow
              item={item}
              isOpen={open.has(idx)}
              onToggle={() => toggle(idx)}
              idx={idx}
            />
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

function FaqRow({
  item,
  isOpen,
  onToggle,
  idx,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  idx: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `faq-panel-${idx}`;
  const headerId = `faq-header-${idx}`;

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-border/65 bg-card/80 backdrop-blur-sm transition-[border-color,box-shadow] duration-300",
        isOpen && "border-primary/30 shadow-md shadow-primary/5",
      )}
    >
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors sm:text-base"
      >
        <span className="pr-4">{item.q}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-foreground/60 transition-transform duration-300 ease-out",
            isOpen && "rotate-180 text-primary",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        ref={panelRef}
        className={cn(
          "ebm-faq-panel grid text-sm text-muted-foreground",
          isOpen ? "ebm-faq-panel-open" : "",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-5 leading-relaxed">{item.a}</div>
        </div>
      </div>
    </div>
  );
}
