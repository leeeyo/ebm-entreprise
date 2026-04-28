/**
 * Shared brand asset components.
 * Thumbnail (1200×630), OGImage (1200×630), AppleTouchIcon (180×180),
 * Favicon32 (32×32), Favicon16 (16×16).
 * All are pure React/Tailwind — no generated images.
 */

import { HardHat } from "lucide-react"

/* ── Thumbnail ─────────────────────────────────────────────────────────────── */
interface ThumbnailProps {
  variant?: 1 | 2 | 3 | 4 | 5
}

export function Thumbnail({ variant = 1 }: ThumbnailProps) {
  if (variant === 2) return <ThumbnailV2 />
  if (variant === 3) return <ThumbnailV3 />
  if (variant === 4) return <ThumbnailV4 />
  if (variant === 5) return <ThumbnailV5 />
  return <ThumbnailV1 />
}

function ThumbnailV1() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.18_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* Floating line items table */}
      <div className="absolute left-[5%] top-[10%] rounded-lg border border-white/10 bg-white/5 p-4 w-[26%] opacity-40 -rotate-2 scale-90">
        <div className="h-2 w-24 rounded bg-white/20 mb-2.5" />
        {[0,1,2,3,4].map(i => (
          <div key={i} className="flex gap-1.5 mb-2">
            <div className="h-1.5 flex-1 rounded bg-white/15" />
            <div className="h-1.5 w-8 rounded bg-white/10" />
            <div className="h-1.5 w-12 rounded bg-white/20" />
          </div>
        ))}
        <div className="flex justify-end mt-2 pt-1.5 border-t border-white/10">
          <div className="h-2 w-16 rounded bg-[oklch(0.55_0.14_55)]/60" />
        </div>
      </div>

      {/* Floating bid summary */}
      <div className="absolute right-[4%] bottom-[12%] rounded-lg border border-white/10 bg-white/5 p-4 w-[22%] opacity-40 rotate-2">
        <div className="h-2 w-16 rounded bg-white/20 mb-3" />
        {[58,24,14,4].map((pct,i) => (
          <div key={i} className="mb-2.5">
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-[oklch(0.55_0.14_55)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
        <div className="h-3.5 w-20 rounded bg-[oklch(0.55_0.14_55)]/60 mt-3" />
      </div>

      {/* Center identity */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center rounded-xl bg-[oklch(0.55_0.14_55)] p-2.5">
            <HardHat className="text-white" style={{ width: "2rem", height: "2rem" }} />
          </div>
        </div>
        <span className="font-mono font-bold tracking-tight text-white leading-none" style={{ fontSize: "clamp(2rem,6vw,4.5rem)" }}>
          ESTIMATE<br />
          <span style={{ color: "oklch(0.65 0.14 55)" }}>BUILDER</span>
        </span>
        <p className="mt-4 font-mono tracking-widest uppercase text-white/40" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          LoadBear · Next.js 16 · AI SDK 6 · shadcn/ui
        </p>
      </div>

      {/* Division chips */}
      <div className="absolute left-[5%] bottom-[10%] flex flex-wrap gap-1.5 w-[40%] opacity-85 rotate-1">
        {["02 Site Work","03 Concrete","09 Finishes","16 Electrical"].map(d => (
          <span key={d} className="rounded-full border border-white/20 bg-white/10 text-white/60 font-mono" style={{ fontSize: "0.6rem", padding: "0.2rem 0.6rem" }}>{d}</span>
        ))}
      </div>
    </div>
  )
}

function ThumbnailV2() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.16_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* Chat messages behind left */}
      <div className="absolute left-[4%] top-[14%] w-[28%] opacity-40 -rotate-1.5 flex flex-col gap-2">
        <div className="rounded-lg bg-white/8 border border-white/10 p-2.5 self-start w-[85%]">
          <div className="h-1.5 w-[85%] rounded bg-white/20 mb-1" />
          <div className="h-1.5 w-[65%] rounded bg-white/15" />
        </div>
        <div className="rounded-lg bg-[oklch(0.55_0.14_55)]/30 border border-[oklch(0.55_0.14_55)]/20 p-2.5 self-end w-[80%]">
          <div className="h-1.5 w-full rounded bg-white/20 mb-1" />
          <div className="h-1.5 w-[70%] rounded bg-white/15" />
        </div>
      </div>

      {/* Tool call chip right */}
      <div className="absolute right-[4%] top-[18%] opacity-50 rotate-2">
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-[oklch(0.55_0.14_55)]" />
          <div className="h-1.5 w-36 rounded bg-white/30" />
        </div>
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-mono font-bold tracking-tight text-white leading-none" style={{ fontSize: "clamp(2.5rem,7vw,5rem)" }}>
          AI<br />
          <span style={{ color: "oklch(0.65 0.14 55)" }}>AGENT</span>
        </span>
        <p className="mt-4 font-mono tracking-widest uppercase text-white/40" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          Claude · GPT-5 Mini · Gemini 3 Flash
        </p>
      </div>

      {/* Model card front right */}
      <div className="absolute right-[4%] bottom-[12%] opacity-85 rotate-[-1deg]">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3 w-[18vw] min-w-[140px] max-w-[200px]">
          <p className="font-mono uppercase text-white/40 mb-1.5" style={{ fontSize: "0.6rem" }}>Model</p>
          <div className="flex items-center justify-between rounded border border-white/15 bg-white/5 px-2 py-1">
            <span className="font-mono text-white/70" style={{ fontSize: "0.65rem" }}>claude-opus-4-6</span>
          </div>
        </div>
      </div>

      {/* Temp slider front left */}
      <div className="absolute left-[4%] bottom-[12%] opacity-80 rotate-1.5">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3 w-[15vw] min-w-[120px] max-w-[180px]">
          <div className="flex justify-between mb-1.5">
            <span className="font-mono text-white/40" style={{ fontSize: "0.6rem" }}>Temperature</span>
            <span className="font-mono text-white/60" style={{ fontSize: "0.6rem" }}>0.3</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div className="h-1 w-[30%] rounded-full bg-[oklch(0.55_0.14_55)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ThumbnailV3() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.17_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* Markup table behind */}
      <div className="absolute left-[4%] top-[10%] w-[28%] opacity-35 -rotate-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-2">
          {["Overhead 10%","Profit 8%","Contingency 7%","Bond 1.5%"].map(r => (
            <div key={r} className="flex gap-2 items-center">
              <div className="flex-1 h-1.5 rounded bg-white/15" />
              <div className="w-8 h-4 rounded border border-white/15 bg-white/5" />
              <div className="w-14 h-1.5 rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Big total behind right */}
      <div className="absolute right-[4%] top-[14%] opacity-25 rotate-1.5">
        <span className="font-mono font-bold text-[oklch(0.55_0.14_55)]" style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}>$487,240</span>
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-mono font-bold tracking-tight text-white leading-none" style={{ fontSize: "clamp(2.5rem,7vw,5rem)" }}>
          MARKUP<br />
          <span style={{ color: "oklch(0.65 0.14 55)" }}>& BID</span>
        </span>
        <p className="mt-4 font-mono tracking-widest uppercase text-white/40" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          Overhead · Profit · Contingency · Bond · Tax
        </p>
      </div>

      {/* Cost bar card front right */}
      <div className="absolute right-[4%] bottom-[10%] opacity-90 -rotate-1">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3 w-[20vw] min-w-[150px] max-w-[220px]">
          <p className="font-mono text-white/40 mb-2 uppercase" style={{ fontSize: "0.6rem" }}>Cost Breakdown</p>
          {[
            { label: "Materials", w: "58%", color: "oklch(0.55 0.14 55)" },
            { label: "Labor", w: "24%", color: "oklch(0.60 0.10 200)" },
            { label: "Subs", w: "14%", color: "oklch(0.50 0.08 260)" },
          ].map(b => (
            <div key={b.label} className="mb-1.5">
              <div className="h-1 w-full rounded-full bg-white/10">
                <div className="h-1 rounded-full" style={{ width: b.w, backgroundColor: b.color }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-1.5 border-t border-white/10 mt-1">
            <span className="font-mono text-white/40" style={{ fontSize: "0.6rem" }}>Total Bid</span>
            <span className="font-mono font-bold" style={{ fontSize: "0.7rem", color: "oklch(0.65 0.14 55)" }}>$487,240</span>
          </div>
        </div>
      </div>

      {/* Type tags front left */}
      <div className="absolute left-[4%] bottom-[12%] flex flex-col gap-1.5 opacity-85 rotate-1">
        {["Material","Labor","Equipment","Subcontractor"].map(t => (
          <span key={t} className="rounded-full border border-white/15 bg-white/8 text-white/50 font-mono" style={{ fontSize: "0.6rem", padding: "0.2rem 0.7rem" }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function ThumbnailV4() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.19_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* Division list behind */}
      <div className="absolute left-[3%] top-[8%] w-[28%] opacity-35 -rotate-1.5">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-2">
          {[["02","Site Work & Demo","$20k"],["03","Concrete","$4.6k"],["05","Structural Steel","$22k"],["07","Exterior Envelope","$42k"],["09","Finishes","$110k"]].map(([id,name,total]) => (
            <div key={id} className="flex items-center gap-2">
              <span className="font-mono text-[oklch(0.55_0.14_55)]" style={{ fontSize: "0.65rem", width: "1.2rem" }}>{id}</span>
              <div className="flex-1 h-1.5 rounded bg-white/15" />
              <span className="font-mono text-white/40" style={{ fontSize: "0.6rem" }}>{total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-mono font-bold tracking-tight text-white leading-none" style={{ fontSize: "clamp(2.5rem,7vw,5rem)" }}>
          CSI<br />
          <span style={{ color: "oklch(0.65 0.14 55)" }}>DIVISIONS</span>
        </span>
        <p className="mt-4 font-mono tracking-widest uppercase text-white/40" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          8 divisions · 30 line items · live subtotals
        </p>
      </div>

      {/* Project card front right */}
      <div className="absolute right-[4%] top-[14%] opacity-85 rotate-2">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3 w-[18vw] min-w-[140px] max-w-[200px]">
          <div className="border-l-2 pl-2" style={{ borderColor: "oklch(0.55 0.14 55)" }}>
            <p className="font-semibold text-white/80" style={{ fontSize: "0.7rem" }}>Riverside Office</p>
            <p className="text-white/40 mt-0.5" style={{ fontSize: "0.6rem" }}>Meridian Properties</p>
            <p className="text-white/30 mt-0.5" style={{ fontSize: "0.6rem" }}>Due: Apr 1, 2026</p>
          </div>
        </div>
      </div>

      {/* Chip filters front bottom */}
      <div className="absolute left-[4%] bottom-[10%] flex flex-wrap gap-1.5 w-[42%] opacity-85 -rotate-1">
        {["02 Site","03 Concrete","05 Structural","07 Envelope","09 Finishes"].map((d,i) => (
          <span key={d} className="rounded-full border font-mono" style={{
            fontSize: "0.6rem",
            padding: "0.2rem 0.6rem",
            borderColor: i === 4 ? "oklch(0.55 0.14 55)" : "rgba(255,255,255,0.15)",
            backgroundColor: i === 4 ? "oklch(0.55 0.14 55 / 0.2)" : "rgba(255,255,255,0.05)",
            color: i === 4 ? "oklch(0.75 0.14 55)" : "rgba(255,255,255,0.5)",
          }}>{d}</span>
        ))}
      </div>
    </div>
  )
}

function ThumbnailV5() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.14_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* ── Construction Icons — scattered behind ── */}
      
      {/* Hard Hat - top left */}
      <div className="absolute left-[6%] top-[8%] opacity-40" style={{ transform: "rotate(-8deg)" }}>
        <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
          <path d="M8 42h48c2 0 3 1 3 2v2c0 1-1 2-3 2H8c-2 0-3-1-3-2v-2c0-1 1-2 3-2z" fill="#FF6B00" />
          <path d="M14 42c0-12 8-20 18-20s18 8 18 20" fill="#FF6B00" />
          <path d="M32 22v20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      {/* Crane - top right */}
      <div className="absolute right-[8%] top-[5%] opacity-35" style={{ transform: "rotate(5deg)" }}>
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
          <rect x="28" y="20" width="8" height="38" fill="#FFB800" />
          <path d="M32 20L56 12v4L32 24" fill="#FFB800" />
          <path d="M32 20L14 16v4l18 4" fill="#FFB800" />
          <path d="M50 16v20" stroke="#FFB800" strokeWidth="2" />
          <path d="M46 36h8c2 0 3 1 3 2l-4 6-4-6c0-1 1-2 3-2" fill="#FFB800" />
          <rect x="26" y="14" width="12" height="8" rx="1" fill="#FFB800" />
        </svg>
      </div>

      {/* Warning Triangle - left middle */}
      <div className="absolute left-[3%] top-[40%] opacity-30" style={{ transform: "rotate(-5deg)" }}>
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <path d="M32 8L58 54H6L32 8z" fill="#FFB800" strokeLinejoin="round" />
          <path d="M32 24v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="46" r="3" fill="white" />
        </svg>
      </div>

      {/* Tools - bottom left, front */}
      <div className="absolute left-[5%] bottom-[8%] opacity-75" style={{ transform: "rotate(10deg)" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="38" width="24" height="6" rx="1" fill="#8B5A2B" transform="rotate(-45 10 38)" />
          <rect x="6" y="20" width="16" height="10" rx="2" fill="#FF6B00" transform="rotate(-45 6 20)" />
          <path d="M48 12c-4 0-8 2-10 6l-14 24c2 4 6 6 10 6s8-2 10-6l14-24c-2-4-6-6-10-6z" fill="#FF6B00" opacity="0.8" />
        </svg>
      </div>

      {/* Cement Mixer - bottom right */}
      <div className="absolute right-[4%] bottom-[15%] opacity-45" style={{ transform: "rotate(-3deg)" }}>
        <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="30" rx="18" ry="14" fill="#FFB800" transform="rotate(-15 32 30)" />
          <path d="M20 24c4 8 16 12 24 8" stroke="white" strokeWidth="3" opacity="0.3" />
          <path d="M20 42l-6 14M44 42l6 14" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" />
          <circle cx="14" cy="56" r="4" fill="#FFB800" />
          <circle cx="50" cy="56" r="4" fill="#FFB800" />
        </svg>
      </div>

      {/* Safety Vest - right middle */}
      <div className="absolute right-[3%] top-[38%] opacity-30" style={{ transform: "rotate(8deg)" }}>
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
          <path d="M18 16l-6 4v32l6 4h4V16h-4z" fill="#FFB800" />
          <path d="M46 16l6 4v32l-6 4h-4V16h4z" fill="#FFB800" />
          <path d="M22 16l5-6h10l5 6" stroke="#FFB800" strokeWidth="4" fill="none" />
          <path d="M14 30h8M14 40h8M42 30h8M42 40h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Barrier - top center */}
      <div className="absolute left-[25%] top-[4%] opacity-25" style={{ transform: "rotate(2deg)" }}>
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="20" rx="2" fill="#FF6B00" />
          <path d="M16 16l12 20M28 16l12 20M40 16l12 20" stroke="white" strokeWidth="4" />
          <rect x="6" y="12" width="52" height="6" rx="2" fill="#FF6B00" />
        </svg>
      </div>

      {/* ── Floating UI Elements ── */}

      {/* Line items snippet - behind left */}
      <div className="absolute left-[15%] top-[22%] rounded-lg border border-white/10 bg-white/5 p-2 opacity-30" style={{ width: "11rem", transform: "rotate(-3deg)" }}>
        {[0,1,2].map(i => (
          <div key={i} className="flex gap-1.5 mb-1">
            <div className="h-1.5 flex-1 rounded bg-white/15" />
            <div className="h-1.5 w-8 rounded bg-white/10" />
            <div className="h-1.5 w-10 rounded" style={{ backgroundColor: "rgba(255,107,0,0.4)" }} />
          </div>
        ))}
      </div>

      {/* Cost bar summary - front right */}
      <div className="absolute right-[12%] top-[28%] opacity-70" style={{ width: "10rem", transform: "rotate(2deg)" }}>
        <div className="rounded-lg border border-white/15 bg-white/8 p-2">
          {[
            { w: "62%", color: "#FF6B00" },
            { w: "28%", color: "#FFB800" },
            { w: "10%", color: "rgba(255,255,255,0.4)" },
          ].map((b, i) => (
            <div key={i} className="mb-1">
              <div className="h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 rounded-full" style={{ width: b.w, backgroundColor: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Big identity words ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-mono font-bold tracking-tight text-white leading-none" style={{ fontSize: "clamp(1.5rem,5vw,3.5rem)" }}>
          CONSTRUCTION
        </span>
        <span className="font-mono font-bold tracking-tight leading-none" style={{ fontSize: "clamp(2rem,6.5vw,4.5rem)", color: "#FF6B00" }}>
          ESTIMATING
        </span>
        <p className="mt-4 font-mono tracking-widest uppercase text-white/40" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          Fork · Build · Ship
        </p>
      </div>

      {/* Division chips - front bottom center */}
      <div className="absolute left-1/2 bottom-[8%] flex gap-1.5 opacity-80" style={{ transform: "translateX(-50%)" }}>
        {["Materials","Labor","Subs"].map((t, i) => (
          <span key={t} className="rounded-full border font-mono" style={{
            fontSize: "0.6rem",
            padding: "0.2rem 0.6rem",
            borderColor: i === 0 ? "#FF6B00" : "rgba(255,255,255,0.15)",
            backgroundColor: i === 0 ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.05)",
            color: i === 0 ? "#FF6B00" : "rgba(255,255,255,0.5)",
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── OG Image (1200×630) ────────────────────────────────────────────────── */
export function OGImage() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.18_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Left accent bar */}
      <div className="absolute left-0 inset-y-0 w-1 bg-[oklch(0.55_0.14_55)]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-[oklch(0.55_0.14_55)] p-2">
            <HardHat className="text-white" style={{ width: "1.75rem", height: "1.75rem" }} />
          </div>
          <span className="font-mono font-bold text-white" style={{ fontSize: "clamp(1rem,2.5vw,1.5rem)" }}>LoadBear</span>
        </div>
        <p className="font-mono font-bold text-white text-balance leading-tight" style={{ fontSize: "clamp(1.25rem,3.5vw,2.5rem)" }}>
          Construction Estimate<br />Starter Kit
        </p>
        <p className="text-white/50 text-balance" style={{ fontSize: "clamp(0.6rem,1.4vw,0.875rem)" }}>
          CSI line items · markups · AI agent · Next.js 16 · AI SDK 6
        </p>
      </div>

      {/* Corner tags */}
      <div className="absolute bottom-4 right-5 flex gap-2">
        {["Next.js 16","shadcn/ui","AI SDK 6"].map(t => (
          <span key={t} className="rounded-full border border-white/15 bg-white/5 text-white/40 font-mono" style={{ fontSize: "0.55rem", padding: "0.2rem 0.6rem" }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── OG Image Alt (1200×630) — with construction icons ──────────────────── */
export function OGImageAlt() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.12_0.02_260)]" style={{ aspectRatio: "1200/630" }}>
      {/* ── Scattered construction icons ── */}
      
      {/* Bear mascot - fierce prowling silhouette, prominent left */}
      <div className="absolute left-[4%] top-[18%] opacity-90" style={{ transform: "rotate(-3deg)" }}>
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          {/* Back hump and spine */}
          <path d="M8 28 C6 24, 8 18, 14 16 C18 14, 24 12, 32 14 C38 15, 44 18, 48 22 L52 20 C54 19, 56 20, 56 22 L54 26" fill="#FF6B00" />
          {/* Body mass */}
          <path d="M8 28 C6 32, 6 38, 8 44 L12 48 L12 54 L16 54 L18 48 L26 48 L28 54 L32 54 L32 48 L40 48 L42 54 L46 54 L46 48 L50 44 C54 40, 54 34, 52 28 L54 26 C52 28, 48 30, 44 30 C40 30, 34 28, 28 28 C22 28, 14 30, 8 28" fill="#FF6B00" />
          {/* Head */}
          <path d="M48 22 C50 20, 54 18, 58 20 C62 22, 64 26, 62 30 C60 34, 56 36, 52 34 L48 30 C46 28, 46 24, 48 22" fill="#FF6B00" />
          {/* Snout */}
          <path d="M58 24 C60 24, 62 26, 62 28 L60 30 C58 30, 56 28, 58 24" fill="#FF6B00" />
          {/* Ear */}
          <path d="M50 18 C52 14, 56 14, 56 18 C56 20, 54 20, 52 20 L50 18" fill="#FF6B00" />
          {/* Muscle definition */}
          <path d="M12 32 C16 30, 20 32, 18 36" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
          <path d="M24 24 C28 22, 32 24, 30 28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
          {/* Safety Vest */}
          <path d="M16 26 C22 24, 32 24, 42 26 L44 34 C38 36, 26 36, 18 34 L16 26" fill="#FFB800" />
          <path d="M20 28 L38 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 32 L36 32" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="56" cy="24" r="1.5" fill="#222" />
        </svg>
      </div>

      {/* Hard Hat - top right */}
      <div className="absolute right-[8%] top-[8%] opacity-50" style={{ transform: "rotate(8deg)" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M8 42h48c2 0 3 1 3 2v2c0 1-1 2-3 2H8c-2 0-3-1-3-2v-2c0-1 1-2 3-2z" fill="#FF6B00" />
          <path d="M14 42c0-12 8-20 18-20s18 8 18 20" fill="#FF6B00" />
          <path d="M32 22v20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      {/* Crane - top center-right, behind */}
      <div className="absolute right-[25%] top-[5%] opacity-25" style={{ transform: "rotate(3deg)" }}>
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
          <rect x="28" y="20" width="8" height="38" fill="#FFB800" />
          <path d="M32 20L56 12v4L32 24" fill="#FFB800" />
          <path d="M32 20L14 16v4l18 4" fill="#FFB800" />
          <path d="M50 16v20" stroke="#FFB800" strokeWidth="2" />
          <path d="M46 36h8c2 0 3 1 3 2l-4 6-4-6c0-1 1-2 3-2" fill="#FFB800" />
          <rect x="26" y="14" width="12" height="8" rx="1" fill="#FFB800" />
        </svg>
      </div>

      {/* Warning Triangle - bottom left */}
      <div className="absolute left-[3%] bottom-[15%] opacity-35" style={{ transform: "rotate(-8deg)" }}>
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <path d="M32 8L58 54H6L32 8z" fill="#FFB800" />
          <path d="M32 24v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="46" r="3" fill="white" />
        </svg>
      </div>

      {/* Barrier - bottom right */}
      <div className="absolute right-[5%] bottom-[10%] opacity-40" style={{ transform: "rotate(5deg)" }}>
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="20" rx="2" fill="#FF6B00" />
          <path d="M16 16l12 20M28 16l12 20M40 16l12 20" stroke="white" strokeWidth="4" />
          <rect x="6" y="12" width="52" height="6" rx="2" fill="#FF6B00" />
        </svg>
      </div>

      {/* Tools - right middle */}
      <div className="absolute right-[3%] top-[40%] opacity-30" style={{ transform: "rotate(15deg)" }}>
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="38" width="24" height="6" rx="1" fill="#8B5A2B" transform="rotate(-45 10 38)" />
          <rect x="6" y="20" width="16" height="10" rx="2" fill="#FF6B00" transform="rotate(-45 6 20)" />
          <path d="M48 12c-4 0-8 2-10 6l-14 24c2 4 6 6 10 6s8-2 10-6l14-24c-2-4-6-6-10-6z" fill="#FF6B00" opacity="0.8" />
        </svg>
      </div>

      {/* Left accent bar */}
      <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-b from-[#FF6B00] to-[#FFB800]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="font-mono font-bold text-white" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)" }}>LoadBear</span>
        <p className="font-mono font-bold leading-tight" style={{ fontSize: "clamp(1rem,2.8vw,2rem)" }}>
          <span className="text-white">Construction </span>
          <span style={{ color: "#FF6B00" }}>Estimate</span>
          <span className="text-white"> Builder</span>
        </p>
        <p className="text-white/40 text-balance font-mono" style={{ fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          CSI divisions · markup calculator · AI agent · React components
        </p>
      </div>

      {/* Bottom tech tags */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {["Next.js 16","AI SDK 6","shadcn/ui"].map(t => (
          <span key={t} className="rounded-full border font-mono" style={{ 
            fontSize: "0.55rem", 
            padding: "0.2rem 0.6rem",
            borderColor: "rgba(255,107,0,0.4)",
            backgroundColor: "rgba(255,107,0,0.1)",
            color: "rgba(255,255,255,0.6)"
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Apple Touch Icon (180×180) ─────────────────────────────────────────── */
export function AppleTouchIcon({ size = 180 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-[22%] bg-[oklch(0.55_0.14_55)]"
      style={{ width: size, height: size }}
    >
      {/* Subtle background ring */}
      <div
        className="absolute rounded-full border-4 border-white/10"
        style={{ width: size * 0.85, height: size * 0.85 }}
      />
      <HardHat className="text-white" style={{ width: size * 0.48, height: size * 0.48 }} />
    </div>
  )
}

/* ── Favicon (32×32 or 16×16) ───────────────────────────────────────────── */
export function Favicon({ size = 32 }: { size?: 16 | 32 }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-sm bg-[oklch(0.55_0.14_55)]"
      style={{ width: size, height: size }}
    >
      <HardHat className="text-white" style={{ width: size * 0.7, height: size * 0.7 }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTRUCTION ICON SET
   Hand-drawn SVG icons in bright construction orange/yellow
   ══════════════════════════════════════════════════════════════════════════ */

const CONSTRUCTION_ORANGE = "#FF6B00"
const CONSTRUCTION_YELLOW = "#FFB800"

interface IconProps {
  size?: number
  color?: "orange" | "yellow"
}

function getColor(color: "orange" | "yellow") {
  return color === "orange" ? CONSTRUCTION_ORANGE : CONSTRUCTION_YELLOW
}

/** Fierce prowling bear in side profile with safety vest - the LoadBear mascot */
export function BearIcon({ size = 64, color = "orange" }: IconProps) {
  const vestColor = color === "orange" ? CONSTRUCTION_YELLOW : CONSTRUCTION_ORANGE
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Main body silhouette - prowling bear facing right */}
      {/* Back hump and spine */}
      <path 
        d="M8 28 C6 24, 8 18, 14 16 C18 14, 24 12, 32 14 C38 15, 44 18, 48 22 L52 20 C54 19, 56 20, 56 22 L54 26"
        fill={c}
      />
      {/* Body mass */}
      <path 
        d="M8 28 C6 32, 6 38, 8 44 L12 48 L12 54 L16 54 L18 48 L26 48 L28 54 L32 54 L32 48 L40 48 L42 54 L46 54 L46 48 L50 44 C54 40, 54 34, 52 28 L54 26 C52 28, 48 30, 44 30 C40 30, 34 28, 28 28 C22 28, 14 30, 8 28"
        fill={c}
      />
      {/* Head - lowered, aggressive */}
      <path 
        d="M48 22 C50 20, 54 18, 58 20 C62 22, 64 26, 62 30 C60 34, 56 36, 52 34 L48 30 C46 28, 46 24, 48 22"
        fill={c}
      />
      {/* Snout */}
      <path 
        d="M58 24 C60 24, 62 26, 62 28 L60 30 C58 30, 56 28, 58 24"
        fill={c}
      />
      {/* Ear */}
      <path d="M50 18 C52 14, 56 14, 56 18 C56 20, 54 20, 52 20 L50 18" fill={c} />
      
      {/* Negative space cuts for muscle definition */}
      <path d="M12 32 C16 30, 20 32, 18 36" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M24 24 C28 22, 32 24, 30 28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M38 22 C42 20, 46 22, 44 26" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M14 40 L20 38" stroke="white" strokeWidth="1" fill="none" opacity="0.1" />
      <path d="M36 36 L42 34" stroke="white" strokeWidth="1" fill="none" opacity="0.1" />
      
      {/* Safety Vest - draped over the back */}
      <path 
        d="M16 26 C22 24, 32 24, 42 26 L44 34 C38 36, 26 36, 18 34 L16 26"
        fill={vestColor}
      />
      {/* Reflective stripes on vest */}
      <path d="M20 28 L38 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 32 L36 32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      {/* Eye - small, fierce */}
      <circle cx="56" cy="24" r="1.5" fill="#222" />
    </svg>
  )
}

/** Hard hat / safety helmet icon */
export function HardHatIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Brim */}
      <path d="M8 42h48c2 0 3 1 3 2v2c0 1-1 2-3 2H8c-2 0-3-1-3-2v-2c0-1 1-2 3-2z" fill={c} />
      {/* Dome */}
      <path d="M14 42c0-12 8-20 18-20s18 8 18 20" fill={c} />
      {/* Center ridge */}
      <path d="M32 22v20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      {/* Side ridges */}
      <path d="M22 26c0 6 2 12 4 16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <path d="M42 26c0 6-2 12-4 16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
    </svg>
  )
}

/** Safety vest icon */
export function SafetyVestIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Vest body */}
      <path d="M18 16l-6 4v32l6 4h4V16h-4z" fill={c} />
      <path d="M46 16l6 4v32l-6 4h-4V16h4z" fill={c} />
      {/* Neck opening */}
      <path d="M22 16l5-6h10l5 6" stroke={c} strokeWidth="4" fill="none" />
      {/* Reflective stripes */}
      <path d="M14 30h8M14 40h8M42 30h8M42 40h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Center zip line */}
      <path d="M32 10v46" stroke={c} strokeWidth="2" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  )
}

/** Safety goggles icon */
export function GogglesIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Strap */}
      <path d="M6 28c0-2 2-4 4-4h44c2 0 4 2 4 4v8c0 2-2 4-4 4H10c-2 0-4-2-4-4v-8z" fill={c} opacity="0.3" />
      {/* Left lens */}
      <rect x="10" y="24" width="18" height="16" rx="4" fill={c} />
      {/* Right lens */}
      <rect x="36" y="24" width="18" height="16" rx="4" fill={c} />
      {/* Bridge */}
      <path d="M28 32h8" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* Lens reflection */}
      <path d="M14 28l6 4M40 28l6 4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/** Work gloves icon */
export function GlovesIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Left glove */}
      <path d="M12 56V32l-4-8v-8l4-4h6l2 4v8l8 8v24H12z" fill={c} />
      {/* Right glove */}
      <path d="M36 56V32l4-8v-8l-4-4h-6l-2 4v8l-8 8v24H36z" fill={c} transform="translate(16 0)" />
      {/* Cuff stripes */}
      <path d="M12 50h16M36 50h16" stroke="white" strokeWidth="2" opacity="0.3" />
      {/* Finger lines */}
      <path d="M16 36v-8M22 36v-8M40 36v-8M46 36v-8" stroke="white" strokeWidth="1.5" opacity="0.2" />
    </svg>
  )
}

/** Warning triangle icon */
export function WarningTriangleIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Triangle */}
      <path d="M32 8L58 54H6L32 8z" fill={c} stroke={c} strokeWidth="2" strokeLinejoin="round" />
      {/* Exclamation mark */}
      <path d="M32 24v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="46" r="3" fill="white" />
    </svg>
  )
}

/** First aid kit icon */
export function FirstAidIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Case */}
      <rect x="8" y="18" width="48" height="36" rx="4" fill={c} />
      {/* Handle */}
      <path d="M24 18v-4c0-2 2-4 4-4h8c2 0 4 2 4 4v4" stroke={c} strokeWidth="4" fill="none" />
      {/* Cross */}
      <path d="M32 26v20M22 36h20" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

/** Traffic barrier / barricade icon */
export function BarrierIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Legs */}
      <path d="M12 56l4-20M52 56l-4-20" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* Top bar */}
      <rect x="8" y="16" width="48" height="20" rx="2" fill={c} />
      {/* Stripes */}
      <path d="M16 16l12 20M28 16l12 20M40 16l12 20" stroke="white" strokeWidth="4" />
      {/* Cap */}
      <rect x="6" y="12" width="52" height="6" rx="2" fill={c} />
    </svg>
  )
}

/** Hammer and wrench (tools) icon */
export function ToolsIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Hammer handle */}
      <rect x="10" y="38" width="24" height="6" rx="1" fill="#8B5A2B" transform="rotate(-45 10 38)" />
      {/* Hammer head */}
      <rect x="6" y="20" width="16" height="10" rx="2" fill={c} transform="rotate(-45 6 20)" />
      {/* Wrench */}
      <path d="M48 12c-4 0-8 2-10 6l-14 24c2 4 6 6 10 6s8-2 10-6l14-24c-2-4-6-6-10-6z" fill={c} opacity="0.8" />
      {/* Wrench jaw */}
      <path d="M40 14l-4 8 8-4-4-4zM52 46l4-8-8 4 4 4z" fill={c} />
    </svg>
  )
}

/** Cement mixer icon */
export function CementMixerIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Drum */}
      <ellipse cx="32" cy="30" rx="18" ry="14" fill={c} transform="rotate(-15 32 30)" />
      {/* Stripes on drum */}
      <path d="M20 24c4 8 16 12 24 8" stroke="white" strokeWidth="3" opacity="0.3" />
      <path d="M18 32c4 8 18 10 26 4" stroke="white" strokeWidth="3" opacity="0.3" />
      {/* Opening */}
      <ellipse cx="46" cy="22" rx="6" ry="4" fill="white" opacity="0.3" transform="rotate(-15 46 22)" />
      {/* Stand */}
      <path d="M20 42l-6 14M44 42l6 14" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* Wheels */}
      <circle cx="14" cy="56" r="4" fill={c} />
      <circle cx="50" cy="56" r="4" fill={c} />
      {/* Base frame */}
      <path d="M14 56h36" stroke={c} strokeWidth="3" />
    </svg>
  )
}

/** Crane icon */
export function CraneIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Tower */}
      <rect x="28" y="20" width="8" height="38" fill={c} />
      {/* Arm */}
      <path d="M32 20L56 12v4L32 24" fill={c} />
      {/* Counter-weight arm */}
      <path d="M32 20L14 16v4l18 4" fill={c} />
      {/* Hook cable */}
      <path d="M50 16v20" stroke={c} strokeWidth="2" />
      {/* Hook */}
      <path d="M46 36h8c2 0 3 1 3 2l-4 6-4-6c0-1 1-2 3-2" fill={c} />
      {/* Top housing */}
      <rect x="26" y="14" width="12" height="8" rx="1" fill={c} />
      {/* Base */}
      <rect x="22" y="56" width="20" height="4" rx="1" fill={c} />
      {/* Cross bracing */}
      <path d="M30 26l4 10-4 10M34 26l-4 10 4 10" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

/** Ladder icon */
export function LadderIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Rails */}
      <path d="M20 8v48M44 8v48" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* Rungs */}
      <path d="M20 16h24M20 26h24M20 36h24M20 46h24" stroke={c} strokeWidth="3" strokeLinecap="round" />
      {/* Highlight */}
      <path d="M22 8v48" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

/** Scaffolding icon */
export function ScaffoldingIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Vertical poles */}
      <path d="M14 8v48M32 8v48M50 8v48" stroke={c} strokeWidth="3" strokeLinecap="round" />
      {/* Horizontal platforms */}
      <path d="M12 20h40M12 36h40M12 52h40" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* Cross bracing */}
      <path d="M14 20l18 16M32 20l-18 16M32 36l18 16M50 36l-18 16" stroke={c} strokeWidth="2" opacity="0.5" />
    </svg>
  )
}

/** Bulldozer / excavator icon */
export function BulldozerIcon({ size = 64, color = "yellow" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Track */}
      <rect x="6" y="42" width="40" height="12" rx="6" fill="#444" />
      {/* Track wheels */}
      <circle cx="14" cy="48" r="4" fill="#666" />
      <circle cx="26" cy="48" r="4" fill="#666" />
      <circle cx="38" cy="48" r="4" fill="#666" />
      {/* Body */}
      <rect x="10" y="26" width="32" height="16" rx="2" fill={c} />
      {/* Cab */}
      <rect x="30" y="16" width="14" height="14" rx="2" fill={c} />
      {/* Window */}
      <rect x="33" y="18" width="8" height="6" rx="1" fill="white" opacity="0.4" />
      {/* Blade arm */}
      <path d="M46 36h10l4 8H50l-4-8z" fill={c} />
      {/* Blade */}
      <rect x="54" y="34" width="4" height="16" rx="1" fill={c} />
      {/* Exhaust */}
      <rect x="14" y="20" width="4" height="8" rx="1" fill="#444" />
    </svg>
  )
}

/** Ear protection / headphones icon */
export function EarProtectionIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Headband */}
      <path d="M14 32c0-12 8-18 18-18s18 6 18 18" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Left ear cup */}
      <rect x="8" y="28" width="12" height="20" rx="3" fill={c} />
      {/* Right ear cup */}
      <rect x="44" y="28" width="12" height="20" rx="3" fill={c} />
      {/* Cushion detail */}
      <rect x="10" y="32" width="8" height="12" rx="2" fill="white" opacity="0.2" />
      <rect x="46" y="32" width="8" height="12" rx="2" fill="white" opacity="0.2" />
    </svg>
  )
}

/** Fire extinguisher icon */
export function FireExtinguisherIcon({ size = 64, color = "orange" }: IconProps) {
  const c = getColor(color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Tank */}
      <rect x="20" y="18" width="24" height="40" rx="4" fill={c} />
      {/* Handle base */}
      <rect x="24" y="10" width="16" height="10" rx="2" fill="#444" />
      {/* Handle lever */}
      <path d="M34 8h10c2 0 3 1 3 2v4H34V8z" fill="#666" />
      {/* Nozzle */}
      <path d="M24 8l-6-4h-4v4l6 4" fill="#444" />
      {/* Hose */}
      <path d="M20 44c-6 0-8 4-8 8" stroke="#444" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Label */}
      <rect x="24" y="28" width="16" height="12" rx="1" fill="white" opacity="0.3" />
      {/* Pressure gauge */}
      <circle cx="32" cy="22" r="3" fill="white" opacity="0.4" />
    </svg>
  )
}

/* ── Construction Icon Grid Component ──────────────────────────────────── */
export function ConstructionIconGrid() {
  const icons = [
    { Icon: BearIcon, name: "LoadBear", color: "orange" as const },
    { Icon: HardHatIcon, name: "Hard Hat", color: "orange" as const },
    { Icon: SafetyVestIcon, name: "Safety Vest", color: "yellow" as const },
    { Icon: GogglesIcon, name: "Safety Goggles", color: "orange" as const },
    { Icon: GlovesIcon, name: "Work Gloves", color: "yellow" as const },
    { Icon: WarningTriangleIcon, name: "Warning Sign", color: "yellow" as const },
    { Icon: FirstAidIcon, name: "First Aid", color: "orange" as const },
    { Icon: BarrierIcon, name: "Barrier", color: "orange" as const },
    { Icon: ToolsIcon, name: "Tools", color: "orange" as const },
    { Icon: CementMixerIcon, name: "Cement Mixer", color: "yellow" as const },
    { Icon: CraneIcon, name: "Crane", color: "yellow" as const },
    { Icon: LadderIcon, name: "Ladder", color: "orange" as const },
    { Icon: ScaffoldingIcon, name: "Scaffolding", color: "yellow" as const },
    { Icon: BulldozerIcon, name: "Bulldozer", color: "yellow" as const },
    { Icon: EarProtectionIcon, name: "Ear Protection", color: "orange" as const },
    { Icon: FireExtinguisherIcon, name: "Extinguisher", color: "orange" as const },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {icons.map(({ Icon, name, color }) => (
        <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
          <Icon size={48} color={color} />
          <span className="text-[10px] sm:text-xs text-muted-foreground font-mono text-center">{name}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Single Icon Display with Both Colors ─────────────────────────────── */
export function ConstructionIconShowcase() {
  return (
    <div className="flex flex-wrap gap-6 items-end">
      {/* Orange variants */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-xl bg-slate-900">
          <HardHatIcon size={80} color="orange" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">Orange (#FF6B00)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-xl bg-slate-900">
          <SafetyVestIcon size={80} color="yellow" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">Yellow (#FFB800)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-xl bg-white border">
          <WarningTriangleIcon size={80} color="yellow" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">On Light BG</span>
      </div>
    </div>
  )
}
