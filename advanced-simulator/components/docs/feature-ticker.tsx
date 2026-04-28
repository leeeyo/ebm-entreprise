"use client"

/**
 * FeatureTicker — full-width, auto-scrolling strip of 10 miniature UI cards.
 * Pure CSS animation via @keyframes, no JavaScript timing.
 * Each card is a visual miniature of a real feature in the LoadBear app.
 */
export function FeatureTicker() {
  return (
    <div className="ticker-root relative w-full overflow-hidden border-b border-t bg-card">
      {/* Left fade mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent sm:w-20" />
      {/* Right fade mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent sm:w-20" />

      {/* Scrolling track — duplicated for seamless loop */}
      <div className="ticker-track flex items-stretch gap-2.5 px-2.5 py-2.5 sm:gap-3 sm:px-3 sm:py-3">
        <TickerCards />
        <TickerCards aria-hidden />
      </div>

      <style>{`
        .ticker-root { height: 134px; }
        @media (min-width: 640px) { .ticker-root { height: 152px; } }
        .ticker-track {
          width: max-content;
          animation: ticker-scroll 52s linear infinite;
        }
        .ticker-root:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

function Card({ children, width = "w-[220px]", label }: { children: React.ReactNode; width?: string; label: string }) {
  return (
    <div className={`ticker-card shrink-0 ${width} rounded-xl border bg-background p-2.5 sm:p-3 flex flex-col gap-1.5`}>
      <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary leading-none">{label}</span>
      {children}
    </div>
  )
}

function TickerCards({ "aria-hidden": ariaHidden }: { "aria-hidden"?: true }) {
  return (
    <div className="contents" aria-hidden={ariaHidden}>
      {/* 1 — Line Items Table */}
      <Card label="Line Items Table" width="w-[230px] sm:w-[280px]">
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground border-b pb-0.5 sm:pb-1">
            <span className="flex-1 font-medium truncate">Description</span>
            <span className="w-8 sm:w-10 text-right shrink-0">Qty</span>
            <span className="w-12 sm:w-14 text-right shrink-0 font-medium">Total</span>
          </div>
          {[
            { desc: "Concrete slab", qty: "320 SF", total: "$3,840" },
            { desc: "Drywall 5/8\"", qty: "8,400 SF", total: "$35,700" },
            { desc: "LED fixtures", qty: "96 EA", total: "$27,360" },
          ].map((row) => (
            <div key={row.desc} className="flex items-center gap-1 text-[9px] sm:text-[10px]">
              <span className="flex-1 truncate text-foreground">{row.desc}</span>
              <span className="w-8 sm:w-10 text-right text-muted-foreground font-mono shrink-0">{row.qty}</span>
              <span className="w-12 sm:w-14 text-right text-foreground font-mono font-semibold shrink-0">{row.total}</span>
            </div>
          ))}
          <div className="flex justify-end pt-0.5 sm:pt-1 border-t">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary">$66,900</span>
          </div>
        </div>
      </Card>

      {/* 2 — Division Chips */}
      <Card label="Division Chips" width="w-[210px] sm:w-[260px]">
        <div className="flex flex-wrap gap-1 mt-0.5">
          {[
            { id: "02", name: "Site", active: false },
            { id: "03", name: "Concrete", active: true },
            { id: "05", name: "Structural", active: false },
            { id: "07", name: "Envelope", active: false },
            { id: "09", name: "Finishes", active: false },
            { id: "16", name: "Electrical", active: false },
          ].map((d) => (
            <span
              key={d.id}
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium border ${
                d.active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <span className="font-mono">{d.id}</span> {d.name}
            </span>
          ))}
        </div>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-auto">Filter by CSI division</p>
      </Card>

      {/* 3 — AI Chat */}
      <Card label="AI Estimating Agent" width="w-[220px] sm:w-[270px]">
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="self-start rounded-md bg-muted px-2 py-1 text-[9px] sm:text-[10px] text-foreground max-w-[90%] leading-tight">
            What&apos;s a fair unit cost for ACT ceiling tile?
          </div>
          <div className="self-end rounded-md bg-primary px-2 py-1 text-[9px] sm:text-[10px] text-primary-foreground max-w-[85%] leading-tight">
            $4.50–$6.00/SF installed. Your $4.75 is competitive.
          </div>
          <div className="flex items-center gap-1 mt-0.5 rounded border bg-muted/50 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-muted-foreground w-fit">
            <div className="size-1.5 rounded-full bg-primary" />
            updateMarkup tool
          </div>
        </div>
      </Card>

      {/* 4 — Bid Summary */}
      <Card label="Bid Summary" width="w-[200px] sm:w-[240px]">
        <div className="flex flex-col gap-1.5 mt-0.5">
          {[
            { label: "Materials", pct: 58, color: "bg-amber-500" },
            { label: "Labor", pct: 24, color: "bg-sky-500" },
            { label: "Subs", pct: 14, color: "bg-violet-500" },
            { label: "Equipment", pct: 4, color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-[9px] sm:text-[10px] mb-0.5">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono text-foreground">{item.pct}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-muted">
                <div className={`h-1 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-1 border-t mt-auto">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Total Bid</span>
            <span className="font-mono text-[10px] sm:text-xs font-bold text-primary">$487,240</span>
          </div>
        </div>
      </Card>

      {/* 5 — Markup Section */}
      <Card label="Markups" width="w-[215px] sm:w-[260px]">
        <div className="flex flex-col gap-1 mt-0.5">
          {[
            { label: "Overhead", pct: "10%", amt: "$38,420" },
            { label: "Profit", pct: "8%", amt: "$30,736" },
            { label: "Contingency", pct: "7%", amt: "$26,894" },
            { label: "Bond", pct: "1.5%", amt: "$5,763" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-1.5 text-[9px] sm:text-[10px]">
              <span className="flex-1 text-muted-foreground truncate">{row.label}</span>
              <span className="w-9 sm:w-10 rounded border bg-muted px-1 py-0.5 text-center font-mono text-foreground text-[9px] sm:text-[10px]">{row.pct}</span>
              <span className="w-14 sm:w-16 text-right font-mono font-semibold text-foreground">{row.amt}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 6 — Project Header */}
      <Card label="Project Header" width="w-[220px] sm:w-[280px]">
        <div className="border-l-2 border-l-primary pl-2 mt-0.5">
          <p className="text-[10px] sm:text-[11px] font-bold text-foreground leading-tight">Riverside Office Renovation</p>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Client: Meridian Properties LLC</span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Estimator: J. Carter</span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Portland, OR 97201</span>
          </div>
          <div className="mt-1">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Due: <strong className="text-foreground">Apr 1, 2026</strong></span>
          </div>
        </div>
        <div className="mt-auto pt-1">
          <span className="rounded border px-1.5 py-0.5 text-[9px] sm:text-[10px] text-muted-foreground">Edit</span>
        </div>
      </Card>

      {/* 7 — Cost Type Tags */}
      <Card label="Cost Type Tags" width="w-[200px] sm:w-[240px]">
        <div className="flex flex-col gap-1.5 mt-0.5">
          {[
            { type: "Material", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
            { type: "Labor", cls: "bg-sky-500/15 text-sky-600 border-sky-500/30" },
            { type: "Equipment", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
            { type: "Subcontractor", cls: "bg-violet-500/15 text-violet-600 border-violet-500/30" },
          ].map((t) => (
            <div key={t.type} className="flex items-center gap-2">
              <span className={`rounded-full border px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium ${t.cls}`}>{t.type}</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">roll-up</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 8 — Agent Settings */}
      <Card label="Agent Settings" width="w-[215px] sm:w-[260px]">
        <div className="flex flex-col gap-1.5 mt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Model</span>
            <span className="font-mono text-[9px] sm:text-[10px] rounded border bg-muted px-1.5 py-0.5 text-foreground">claude-opus-4-6</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">Temperature</span>
              <span className="font-mono text-[9px] sm:text-[10px] text-foreground">0.3</span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[30%] rounded-full bg-primary" />
            </div>
          </div>
          <div className="rounded bg-muted/50 border p-1.5">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
              You are a construction estimating expert for GCs and subs...
            </p>
          </div>
        </div>
      </Card>

      {/* 9 — CSI Divisions */}
      <Card label="CSI Division Groups" width="w-[215px] sm:w-[260px]">
        <div className="flex flex-col gap-1 mt-0.5">
          {[
            { id: "02", name: "Site Work & Demo", total: "$20,250" },
            { id: "09", name: "Finishes", total: "$110,490" },
            { id: "15", name: "Mech / Plumbing", total: "$57,200" },
            { id: "16", name: "Electrical", total: "$56,220" },
          ].map((d) => (
            <div key={d.id} className="flex items-center gap-1.5 text-[9px] sm:text-[10px]">
              <span className="font-mono text-muted-foreground w-4 shrink-0">{d.id}</span>
              <span className="flex-1 text-foreground truncate">{d.name}</span>
              <span className="font-mono font-semibold text-foreground shrink-0">{d.total}</span>
            </div>
          ))}
          <div className="flex justify-between pt-1 border-t mt-0.5">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">8 divisions</span>
            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary">$384,080</span>
          </div>
        </div>
      </Card>

      {/* 10 — Add Line Item Dialog */}
      <Card label="Add Line Item" width="w-[220px] sm:w-[270px]">
        <div className="mt-0.5 flex flex-col gap-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">Description</span>
            <div className="h-5 rounded border bg-muted/50 px-1.5 text-[9px] sm:text-[10px] text-muted-foreground flex items-center">
              Ceramic tile (restrooms)
            </div>
          </div>
          <div className="flex gap-1">
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">Qty</span>
              <div className="h-5 rounded border bg-muted/50 px-1 text-[9px] sm:text-[10px] font-mono text-foreground flex items-center">480</div>
            </div>
            <div className="w-10 sm:w-14 flex flex-col gap-0.5">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">Unit</span>
              <div className="h-5 rounded border bg-muted/50 px-1 text-[9px] sm:text-[10px] font-mono text-foreground flex items-center">SF</div>
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">Unit $</span>
              <div className="h-5 rounded border bg-muted/50 px-1 text-[9px] sm:text-[10px] font-mono text-foreground flex items-center">$14</div>
            </div>
          </div>
          <button className="mt-0.5 rounded bg-primary px-2 py-1 text-[9px] sm:text-[10px] font-semibold text-primary-foreground w-full">
            Add Line Item
          </button>
        </div>
      </Card>
    </div>
  )
}
