"use client"

import { cn } from "@/lib/utils"
import type { Division } from "@/lib/types"

interface DivisionChipsProps {
  divisions: Division[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function DivisionChips({
  divisions,
  selected,
  onSelect,
}: DivisionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          selected === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        All Divisions
      </button>
      {divisions.map((div) => (
        <button
          key={div.id}
          onClick={() => onSelect(selected === div.id ? null : div.id)}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            selected === div.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <span className="font-mono mr-1 opacity-60">{div.id}</span>
          {div.name}
        </button>
      ))}
    </div>
  )
}
