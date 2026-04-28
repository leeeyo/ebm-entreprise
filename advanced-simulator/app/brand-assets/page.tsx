import Link from "next/link"
import { HardHat, ExternalLink, ArrowLeft } from "lucide-react"
import {
  Thumbnail,
  OGImage,
  OGImageAlt,
  AppleTouchIcon,
  Favicon,
  ConstructionIconGrid,
  ConstructionIconShowcase,
  BearIcon,
} from "@/components/docs/brand-assets"

export const metadata = {
  title: "Brand Assets — LoadBear",
  description: "Thumbnail variants, OG image, Apple Touch Icon, and favicon components for LoadBear.",
}

export default function BrandAssetsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center rounded-lg bg-primary p-1.5 transition-opacity hover:opacity-80">
            <HardHat className="size-5 text-primary-foreground" />
          </Link>
          <div className="flex items-center gap-1.5 text-sm">
            <Link href="/" className="font-bold text-foreground hover:text-primary transition-colors">LoadBear</Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-muted-foreground">Brand Assets</span>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" />
          Back to docs
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Brand Assets</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All assets are React components generated from LoadBear&apos;s design tokens. Use them as-is or replace with exported images.
          </p>
        </div>

        {/* ── Thumbnails ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Thumbnails</h2>
              <p className="text-xs text-muted-foreground mt-0.5">1200 × 630 · v0 marketplace preview cards</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {([1, 2, 3, 4, 5] as const).map((v) => (
              <div key={v} className="flex flex-col gap-2">
                <Thumbnail variant={v} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">Variant {v}</span>
                  <Link
                    href={`/thumbnail?v=${v}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Full size
                    <ExternalLink className="size-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OG Images ── */}
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">OpenGraph (OG) Images</h2>
            <p className="text-xs text-muted-foreground mt-0.5">1200 × 630 · preview images for social media and Slack shares</p>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <OGImage />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground font-mono">Standard</span>
                <Link
                  href="/og-preview"
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Full size
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>
            </div>
            <div>
              <OGImageAlt />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground font-mono">With Icons</span>
                <Link
                  href="/og-preview?alt=1"
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Full size
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── App Icons ── */}
        <section id="apple-touch" className="mb-12">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">App Icons</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Apple Touch Icon and favicon sizes</p>
          </div>
          <div className="flex flex-wrap items-end gap-8">
            {/* Apple touch */}
            <div className="flex flex-col items-center gap-2">
              <AppleTouchIcon size={180} />
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">Apple Touch Icon</p>
                <p className="text-[11px] text-muted-foreground font-mono">180 × 180</p>
              </div>
            </div>

            {/* Favicon 32 */}
            <div id="favicon" className="flex flex-col items-center gap-2">
              <Favicon size={32} />
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">Favicon</p>
                <p className="text-[11px] text-muted-foreground font-mono">32 × 32</p>
              </div>
            </div>

            {/* Favicon 16 */}
            <div className="flex flex-col items-center gap-2">
              <Favicon size={16} />
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">Favicon</p>
                <p className="text-[11px] text-muted-foreground font-mono">16 × 16</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bear Mascot ── */}
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">LoadBear Mascot</h2>
            <p className="text-xs text-muted-foreground mt-0.5">The LoadBear — a bear wearing a safety vest</p>
          </div>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="p-6 rounded-xl bg-slate-900">
                <BearIcon size={96} color="orange" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">On Dark</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-6 rounded-xl bg-white border">
                <BearIcon size={96} color="orange" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">On Light</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 rounded-xl bg-slate-900">
                <BearIcon size={48} color="orange" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">48px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-lg bg-slate-900">
                <BearIcon size={32} color="orange" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">32px</span>
            </div>
          </div>
        </section>

        {/* ── Construction Icons ── */}
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Construction Icon Set</h2>
            <p className="text-xs text-muted-foreground mt-0.5">16 hand-drawn SVG icons in construction orange (#FF6B00) and safety yellow (#FFB800)</p>
          </div>
          
          {/* Color showcase */}
          <div className="mb-6">
            <ConstructionIconShowcase />
          </div>
          
          {/* Full grid */}
          <ConstructionIconGrid />
          
          <p className="mt-4 text-xs text-muted-foreground">
            All icons are React components exported from <code className="font-mono bg-muted px-1 py-0.5 rounded">components/docs/brand-assets.tsx</code>. 
            Import individually (e.g., <code className="font-mono bg-muted px-1 py-0.5 rounded">HardHatIcon</code>, <code className="font-mono bg-muted px-1 py-0.5 rounded">CraneIcon</code>) 
            or use <code className="font-mono bg-muted px-1 py-0.5 rounded">ConstructionIconGrid</code> for the full set.
          </p>
        </section>

        {/* ── Usage note ── */}
        <section className="rounded-xl border bg-muted/30 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-2">Using these assets</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground list-disc list-inside">
            <li>All assets live in <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">components/docs/brand-assets.tsx</code></li>
            <li>Thumbnails are rendered at <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/thumbnail?v=1</code> through <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/thumbnail?v=4</code></li>
            <li>OG image renders at <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/og-preview</code></li>
            <li>To export as static images, screenshot the full-size routes or use a headless browser / <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">@vercel/og</code></li>
          </ul>
        </section>
      </main>
    </div>
  )
}
