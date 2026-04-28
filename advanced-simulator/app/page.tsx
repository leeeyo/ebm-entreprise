import Link from "next/link"
import {
  HardHat,
  ArrowRight,
  ExternalLink,
  Table2,
  Tags,
  Bot,
  Calculator,
  BarChart3,
  SlidersHorizontal,
  FileText,
  Layers,
  PlusSquare,
  Settings,
} from "lucide-react"
import { FeatureTicker } from "@/components/docs/feature-ticker"
import { ThumbnailCarousel } from "@/components/docs/thumbnail-carousel"

const TECH = [
  "Next.js 16",
  "React 19",
  "shadcn/ui",
  "Tailwind v4",
  "AI SDK 6",
  "Vercel AI Gateway",
  "Inter",
  "JetBrains Mono",
  "Zod",
  "Lucide React",
  "Sonner",
]

const FEATURES = [
  {
    icon: Table2,
    title: "Line Items Table",
    description:
      "Editable table of 30+ line items grouped by CSI division. Inline editing for description, quantity, unit, unit cost, and cost type. Auto-calculates row totals and division subtotals.",
    href: "/estimate",
  },
  {
    icon: Tags,
    title: "Division Chip Filters",
    description:
      "Chip-style filter bar across all 8 CSI divisions. Single-click to scope the table to one division; click again to deselect and return to all items.",
    href: "/estimate",
  },
  {
    icon: Layers,
    title: "CSI Division Grouping",
    description:
      "Line items grouped under division header rows with running subtotals. Pre-loaded with Div 01–16: Site Work, Concrete, Structural, MEP, Finishes, and General Requirements.",
    href: "/estimate",
  },
  {
    icon: Tags,
    title: "Cost Type Tagging",
    description:
      "Every line item tagged as Material, Labor, Equipment, or Subcontractor. Powers the roll-up cost breakdown bars in the Bid Summary.",
    href: "/estimate",
  },
  {
    icon: Calculator,
    title: "Markup Section",
    description:
      "Configurable overhead %, profit margin, contingency, bond cost, and sales tax on materials. Each field shows the resulting dollar amount next to the percentage input.",
    href: "/estimate",
  },
  {
    icon: BarChart3,
    title: "Bid Summary Card",
    description:
      "Sticky card with cost breakdown progress bars by type, all markup line items, and the final total bid. Updates live on every keystroke.",
    href: "/estimate",
  },
  {
    icon: FileText,
    title: "Project Header",
    description:
      "Editable project info — name, client, estimator, address, estimate date, and bid due date. Launches an edit dialog on click; saves to the reactive store.",
    href: "/estimate",
  },
  {
    icon: PlusSquare,
    title: "Add Line Item Dialog",
    description:
      "Modal form for adding a new line item. Dropdown selectors for division and unit; radio buttons for cost type. Appended to the correct division group on save.",
    href: "/estimate",
  },
  {
    icon: Bot,
    title: "AI Estimating Agent",
    description:
      "Floating chat panel connected to the Vercel AI Gateway. Five callable tools: updateMarkup, updateLineItemCost, updateLineItemQuantity, addLineItem, deleteLineItem — all execute client-side against the live estimate store.",
    href: "/estimate",
  },
  {
    icon: Settings,
    title: "Agent Settings",
    description:
      "Settings modal with General and Agent tabs. Swap between Claude, GPT-5 Mini, and Gemini; tune temperature, max tokens, and system prompt. All settings passed to /api/chat on each request.",
    href: "/estimate",
  },
  {
    icon: SlidersHorizontal,
    title: "Reactive Store",
    description:
      "Zero-dependency state in lib/estimate-store.ts using useSyncExternalStore. Typed actions and derived selectors for direct costs, cost-type subtotals, and markup calculations.",
    href: "/estimate",
  },
]



export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Docs nav bar ── */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b bg-card px-3 sm:h-14 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
            <HardHat className="size-4 text-primary-foreground sm:size-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">LoadBear</span>
        </div>
        <Link
          href="/estimate"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm"
        >
          Open estimate
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      {/* ── Feature ticker — very first visual ── */}
      <FeatureTicker />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-3xl px-4 py-6 text-center sm:py-8 sm:px-6">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
          Construction estimate starter kit for GCs and subs
        </h1>
        <p className="mt-2.5 text-sm text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed sm:mt-3 sm:text-base">
          A full-stack Next.js app with CSI line items, division grouping, configurable markups, live bid totals, and an AI estimating agent wired to the Vercel AI Gateway. Fork it and build your estimating workflow on top.
        </p>
        <div className="mt-4 flex items-center justify-center sm:mt-5">
          <Link
            href="/estimate"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open live demo
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Thumbnail carousel ── */}
      <section className="mx-auto max-w-4xl px-3 pb-10 sm:px-6 sm:pb-12">
        <ThumbnailCarousel />
      </section>

      {/* ── Feature cards ── */}
      <section className="border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 sm:text-xs sm:mb-6">
            What&apos;s included
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group flex flex-col gap-2.5 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm sm:gap-3 sm:p-5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-1.5 sm:p-2">
                    <f.icon className="size-3.5 text-primary sm:size-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{f.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">{f.description}</p>
                <div className="mt-auto flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View live <ArrowRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer: tech stack + brand assets ── */}
      <footer className="border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            {/* Tech stack */}
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5 sm:text-xs sm:mb-3">
                Tech stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TECH.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border bg-background px-2 py-0.5 text-[10px] text-muted-foreground font-mono sm:px-2.5 sm:py-1 sm:text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Brand assets */}
            <div className="shrink-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5 sm:text-xs sm:mb-3">
                Brand assets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Thumbnail", href: "/thumbnail?v=1", external: true },
                  { label: "OG Image", href: "/og-preview", external: true },
                  { label: "Touch Icon", href: "/brand-assets#apple-touch", external: false },
                  { label: "Favicon", href: "/brand-assets#favicon", external: false },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    target={a.external ? "_blank" : undefined}
                    className="flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[10px] text-muted-foreground font-mono transition-colors hover:border-foreground/30 hover:text-foreground sm:px-2.5 sm:py-1 sm:text-xs"
                  >
                    {a.label}
                    <ExternalLink className="size-2.5" />
                  </Link>
                ))}
                <Link
                  href="/brand-assets"
                  className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary font-mono transition-colors hover:bg-primary/10 sm:px-2.5 sm:py-1 sm:text-xs"
                >
                  View all
                  <ArrowRight className="size-2.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}
