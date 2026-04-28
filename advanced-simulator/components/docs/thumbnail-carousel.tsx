"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const SLIDES = [
  { v: 1, label: "Estimate Builder" },
  { v: 2, label: "AI Agent" },
  { v: 3, label: "Markup & Bid" },
  { v: 4, label: "CSI Divisions" },
  { v: 5, label: "Construction" },
]

const DURATION = 5000

export function ThumbnailCarousel() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  const startCycle = useCallback(() => {
    clearTimers()
    setProgress(0)
    const startTime = Date.now()

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
    }, 50)

    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
      setProgress(0)
    }, DURATION)
  }, [clearTimers])

  useEffect(() => {
    if (!paused) startCycle()
    else clearTimers()
    return clearTimers
  }, [paused, active, startCycle, clearTimers])

  function handleChipClick(i: number) {
    setActive(i)
    setProgress(0)
    if (!paused) startCycle()
  }

  const slide = SLIDES[active]

  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail frame */}
      <div
        className="relative w-full overflow-hidden rounded-xl border bg-background shadow-sm"
        style={{ aspectRatio: "1200/630" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <ThumbnailSlide v={slide.v} />

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-primary transition-none"
            style={{ width: `${paused ? progress : progress}%` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {SLIDES.map((s, i) => (
            <button
              key={s.v}
              onClick={() => handleChipClick(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                i === active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:bg-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Link
          href={`/thumbnail?v=${slide.v}`}
          target="_blank"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Full size
          <ExternalLink className="size-3" />
        </Link>
      </div>
    </div>
  )
}

function ThumbnailSlide({ v }: { v: number }) {
  if (v === 1) return <Thumbnail1 />
  if (v === 2) return <Thumbnail2 />
  if (v === 3) return <Thumbnail3 />
  if (v === 4) return <Thumbnail4 />
  return <Thumbnail5 />
}

/* ─── Thumbnail 1 — Estimate Builder ─────────────────────────────────────── */
function Thumbnail1() {
  return (
    <div className="absolute inset-0 bg-[oklch(0.18_0.02_260)] flex items-center justify-center overflow-hidden">
      {/* Floating line items table — behind */}
      <div className="absolute left-[5%] top-[8%] rounded-lg border border-white/10 bg-white/5 p-3 w-64 opacity-40 rotate-[-2deg] scale-90">
        <div className="h-2 w-32 rounded bg-white/20 mb-2" />
        {[0,1,2,3].map(i => (
          <div key={i} className="flex gap-2 mb-1.5">
            <div className="h-1.5 flex-1 rounded bg-white/15" />
            <div className="h-1.5 w-10 rounded bg-white/10" />
            <div className="h-1.5 w-14 rounded bg-white/20" />
          </div>
        ))}
      </div>

      {/* Floating bid summary card — behind right */}
      <div className="absolute right-[4%] bottom-[10%] rounded-lg border border-white/10 bg-white/5 p-3 w-44 opacity-35 rotate-[2deg]">
        <div className="h-2 w-20 rounded bg-white/20 mb-3" />
        {[58,24,14,4].map((pct,i) => (
          <div key={i} className="mb-2">
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-[oklch(0.55_0.14_55)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
        <div className="h-3 w-24 rounded bg-[oklch(0.55_0.14_55)]/60 mt-3" />
      </div>

      {/* Big identity word */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <span className="font-mono text-[7vw] sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none text-balance">
          ESTIMATE<br />
          <span className="text-[oklch(0.65_0.14_55)]">BUILDER</span>
        </span>
        <p className="text-[2vw] sm:text-xs text-white/50 font-mono tracking-widest uppercase">LoadBear · Next.js · AI SDK 6</p>
      </div>

      {/* Floating division chips — front */}
      <div className="absolute left-[6%] bottom-[12%] flex gap-1.5 flex-wrap w-52 opacity-90 rotate-[1deg]">
        {["02 Site","03 Concrete","09 Finishes","16 Electrical"].map(d => (
          <span key={d} className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">{d}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Thumbnail 2 — AI Agent ──────────────────────────────────────────────── */
function Thumbnail2() {
  return (
    <div className="absolute inset-0 bg-[oklch(0.16_0.02_260)] flex items-center justify-center overflow-hidden">
      {/* Floating chat bubble behind left */}
      <div className="absolute left-[4%] top-[15%] w-56 opacity-40 rotate-[-1.5deg]">
        <div className="rounded-lg bg-white/8 border border-white/10 p-2.5">
          <div className="h-1.5 w-40 rounded bg-white/20 mb-1" />
          <div className="h-1.5 w-32 rounded bg-white/15" />
        </div>
        <div className="mt-1.5 ml-auto w-44 rounded-lg bg-[oklch(0.55_0.14_55)]/30 border border-[oklch(0.55_0.14_55)]/20 p-2">
          <div className="h-1.5 w-36 rounded bg-white/20 mb-1" />
          <div className="h-1.5 w-24 rounded bg-white/15" />
        </div>
      </div>

      {/* Tool call chip behind right */}
      <div className="absolute right-[5%] top-[20%] opacity-45 rotate-[2deg]">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-2">
          <div className="size-2 rounded-full bg-[oklch(0.55_0.14_55)] animate-pulse" />
          <span className="font-mono text-[11px] text-white/60">updateMarkup → overhead: 12%</span>
        </div>
      </div>

      {/* Big word */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <span className="font-mono text-[7vw] sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
          AI<br />
          <span className="text-[oklch(0.65_0.14_55)]">AGENT</span>
        </span>
        <p className="text-[2vw] sm:text-xs text-white/50 font-mono tracking-widest uppercase">Claude Opus 4.6 · GPT 5.4</p>
      </div>

      {/* Floating model selector — front */}
      <div className="absolute right-[5%] bottom-[14%] opacity-85 rotate-[-1deg]">
        <div className="rounded-lg border border-white/15 bg-white/8 p-2.5 w-52">
          <p className="text-[10px] text-white/50 mb-1.5 font-mono uppercase">Model</p>
          <div className="flex items-center justify-between rounded border border-white/15 bg-white/5 px-2 py-1">
            <span className="font-mono text-[11px] text-white/80">claude-opus-4-6</span>
            <div className="border-l border-white/10 pl-1.5">
              <div className="h-3 w-3 flex flex-col justify-center gap-0.5">
                <div className="h-px w-full bg-white/40" />
                <div className="h-px w-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating temp slider — front left */}
      <div className="absolute left-[5%] bottom-[14%] opacity-80 rotate-[1.5deg] w-48">
        <div className="rounded-lg border border-white/15 bg-white/8 p-2.5">
          <div className="flex justify-between mb-1.5">
            <span className="font-mono text-[10px] text-white/50">Temperature</span>
            <span className="font-mono text-[10px] text-white/70">0.3</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div className="h-1 w-[30%] rounded-full bg-[oklch(0.55_0.14_55)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Thumbnail 3 — Markup & Bid ──────────────────────────────────────────── */
function Thumbnail3() {
  return (
    <div className="absolute inset-0 bg-[oklch(0.17_0.02_260)] flex items-center justify-center overflow-hidden">
      {/* Floating markup table behind */}
      <div className="absolute left-[4%] top-[10%] w-64 opacity-40 rotate-[-2deg]">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          {[
            { label: "Overhead", pct: "10%" },
            { label: "Profit", pct: "8%" },
            { label: "Contingency", pct: "7%" },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 rounded bg-white/15" />
              <div className="w-10 h-5 rounded border border-white/15 bg-white/5" />
              <div className="w-16 h-1.5 rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Big total — behind right */}
      <div className="absolute right-[4%] top-[15%] opacity-30 rotate-[1.5deg]">
        <div className="font-mono text-4xl font-bold text-[oklch(0.55_0.14_55)]">$487,240</div>
      </div>

      {/* Big word */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <span className="font-mono text-[7vw] sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
          MARKUP<br />
          <span className="text-[oklch(0.65_0.14_55)]">& BID</span>
        </span>
        <p className="text-[2vw] sm:text-xs text-white/50 font-mono tracking-widest uppercase">Overhead · Profit · Contingency · Bond</p>
      </div>

      {/* Floating cost bar summary — front */}
      <div className="absolute right-[5%] bottom-[12%] w-52 opacity-90 rotate-[-1deg]">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3">
          <p className="text-[10px] font-mono text-white/50 mb-2 uppercase">Cost Breakdown</p>
          {[
            { label: "Materials", w: "58%", color: "bg-[oklch(0.55_0.14_55)]" },
            { label: "Labor", w: "24%", color: "bg-[oklch(0.60_0.10_200)]" },
            { label: "Subs", w: "14%", color: "bg-[oklch(0.50_0.08_260)]" },
          ].map(b => (
            <div key={b.label} className="mb-1.5">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-white/50">{b.label}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10">
                <div className={`h-1 rounded-full ${b.color}`} style={{ width: b.w }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-1.5 border-t border-white/10 mt-1">
            <span className="text-[10px] text-white/50 font-mono">Total Bid</span>
            <span className="text-xs font-bold font-mono text-[oklch(0.65_0.14_55)]">$487,240</span>
          </div>
        </div>
      </div>

      {/* Floating type tags — front left */}
      <div className="absolute left-[5%] bottom-[14%] flex flex-col gap-1.5 opacity-85 rotate-[1deg]">
        {["Material","Labor","Equipment","Subcontractor"].map(t => (
          <span key={t} className="rounded-full border border-white/15 bg-white/8 px-2.5 py-0.5 text-[10px] font-mono text-white/60">{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Thumbnail 4 — CSI Divisions ────────────────────────────────────────── */
function Thumbnail4() {
  return (
    <div className="absolute inset-0 bg-[oklch(0.19_0.02_260)] flex items-center justify-center overflow-hidden">
      {/* Floating division list behind */}
      <div className="absolute left-[4%] top-[8%] w-60 opacity-35 rotate-[-1.5deg]">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-2">
          {[
            { id: "02", name: "Site Work & Demo", total: "$20,250" },
            { id: "03", name: "Concrete", total: "$4,626" },
            { id: "05", name: "Structural Steel", total: "$22,500" },
            { id: "07", name: "Exterior Envelope", total: "$42,540" },
            { id: "09", name: "Finishes", total: "$110,490" },
          ].map(d => (
            <div key={d.id} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[oklch(0.55_0.14_55)] w-5">{d.id}</span>
              <div className="flex-1 h-1.5 rounded bg-white/15" />
              <span className="font-mono text-[10px] text-white/50">{d.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Big word */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <span className="font-mono text-[7vw] sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
          CSI<br />
          <span className="text-[oklch(0.65_0.14_55)]">DIVISIONS</span>
        </span>
        <p className="text-[2vw] sm:text-xs text-white/50 font-mono tracking-widest uppercase">8 divisions · 30 line items · live totals</p>
      </div>

      {/* Floating project header — front right */}
      <div className="absolute right-[4%] top-[14%] w-56 opacity-85 rotate-[2deg]">
        <div className="rounded-lg border border-white/15 bg-white/8 p-3">
          <div className="border-l-2 border-[oklch(0.55_0.14_55)] pl-2">
            <p className="text-[11px] font-bold text-white/80">Riverside Office</p>
            <p className="text-[10px] text-white/50 mt-0.5">Meridian Properties LLC</p>
            <p className="text-[10px] text-white/40">Bid Due: Apr 1, 2026</p>
          </div>
        </div>
      </div>

      {/* Floating chip filter — front bottom */}
      <div className="absolute left-[5%] bottom-[12%] flex flex-wrap gap-1.5 w-60 opacity-85 rotate-[-1deg]">
        {["02 Site","03 Concrete","05 Structural","07 Envelope","09 Finishes"].map((d,i) => (
          <span key={d} className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${i === 4 ? "border-[oklch(0.55_0.14_55)] bg-[oklch(0.55_0.14_55)]/20 text-[oklch(0.75_0.14_55)]" : "border-white/15 bg-white/5 text-white/50"}`}>{d}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Thumbnail 5 — Construction Estimating (with icons) ─────────────────── */
function Thumbnail5() {
  return (
    <div className="absolute inset-0 bg-[oklch(0.14_0.02_260)] flex items-center justify-center overflow-hidden">
      {/* ── Construction Icons — scattered behind ── */}
      
      {/* Hard Hat - top left, behind */}
      <div className="absolute left-[6%] top-[8%] opacity-40 rotate-[-8deg]">
        <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
          <path d="M8 42h48c2 0 3 1 3 2v2c0 1-1 2-3 2H8c-2 0-3-1-3-2v-2c0-1 1-2 3-2z" fill="#FF6B00" />
          <path d="M14 42c0-12 8-20 18-20s18 8 18 20" fill="#FF6B00" />
          <path d="M32 22v20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      {/* Crane - top right, behind */}
      <div className="absolute right-[8%] top-[5%] opacity-35 rotate-[5deg]">
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
          <rect x="28" y="20" width="8" height="38" fill="#FFB800" />
          <path d="M32 20L56 12v4L32 24" fill="#FFB800" />
          <path d="M32 20L14 16v4l18 4" fill="#FFB800" />
          <path d="M50 16v20" stroke="#FFB800" strokeWidth="2" />
          <path d="M46 36h8c2 0 3 1 3 2l-4 6-4-6c0-1 1-2 3-2" fill="#FFB800" />
          <rect x="26" y="14" width="12" height="8" rx="1" fill="#FFB800" />
        </svg>
      </div>

      {/* Warning Triangle - left middle, behind */}
      <div className="absolute left-[3%] top-[40%] opacity-30 rotate-[-5deg]">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <path d="M32 8L58 54H6L32 8z" fill="#FFB800" strokeLinejoin="round" />
          <path d="M32 24v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="46" r="3" fill="white" />
        </svg>
      </div>

      {/* Tools (hammer/wrench) - bottom left, front */}
      <div className="absolute left-[5%] bottom-[8%] opacity-75 rotate-[10deg]">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="38" width="24" height="6" rx="1" fill="#8B5A2B" transform="rotate(-45 10 38)" />
          <rect x="6" y="20" width="16" height="10" rx="2" fill="#FF6B00" transform="rotate(-45 6 20)" />
          <path d="M48 12c-4 0-8 2-10 6l-14 24c2 4 6 6 10 6s8-2 10-6l14-24c-2-4-6-6-10-6z" fill="#FF6B00" opacity="0.8" />
        </svg>
      </div>

      {/* Cement Mixer - bottom right, behind */}
      <div className="absolute right-[4%] bottom-[15%] opacity-45 rotate-[-3deg]">
        <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="30" rx="18" ry="14" fill="#FFB800" transform="rotate(-15 32 30)" />
          <path d="M20 24c4 8 16 12 24 8" stroke="white" strokeWidth="3" opacity="0.3" />
          <path d="M20 42l-6 14M44 42l6 14" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" />
          <circle cx="14" cy="56" r="4" fill="#FFB800" />
          <circle cx="50" cy="56" r="4" fill="#FFB800" />
        </svg>
      </div>

      {/* Safety Vest - right middle, behind */}
      <div className="absolute right-[3%] top-[38%] opacity-30 rotate-[8deg]">
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
          <path d="M18 16l-6 4v32l6 4h4V16h-4z" fill="#FFB800" />
          <path d="M46 16l6 4v32l-6 4h-4V16h4z" fill="#FFB800" />
          <path d="M22 16l5-6h10l5 6" stroke="#FFB800" strokeWidth="4" fill="none" />
          <path d="M14 30h8M14 40h8M42 30h8M42 40h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Barrier - top center-left, behind */}
      <div className="absolute left-[25%] top-[4%] opacity-25 rotate-[2deg]">
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="20" rx="2" fill="#FF6B00" />
          <path d="M16 16l12 20M28 16l12 20M40 16l12 20" stroke="white" strokeWidth="4" />
          <rect x="6" y="12" width="52" height="6" rx="2" fill="#FF6B00" />
        </svg>
      </div>

      {/* ── Floating UI Elements — mixed with icons ── */}

      {/* Line items snippet - behind left */}
      <div className="absolute left-[15%] top-[22%] rounded-lg border border-white/10 bg-white/5 p-2 w-44 opacity-30 rotate-[-3deg]">
        {[0,1,2].map(i => (
          <div key={i} className="flex gap-1.5 mb-1">
            <div className="h-1.5 flex-1 rounded bg-white/15" />
            <div className="h-1.5 w-8 rounded bg-white/10" />
            <div className="h-1.5 w-10 rounded bg-[#FF6B00]/40" />
          </div>
        ))}
      </div>

      {/* Cost bar summary - front right */}
      <div className="absolute right-[12%] top-[28%] w-40 opacity-70 rotate-[2deg]">
        <div className="rounded-lg border border-white/15 bg-white/8 p-2">
          {[
            { w: "62%", color: "bg-[#FF6B00]" },
            { w: "28%", color: "bg-[#FFB800]" },
            { w: "10%", color: "bg-white/40" },
          ].map((b, i) => (
            <div key={i} className="mb-1">
              <div className="h-1.5 w-full rounded-full bg-white/10">
                <div className={`h-1.5 rounded-full ${b.color}`} style={{ width: b.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Big identity words ── */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-center px-4">
        <span className="font-mono text-[6vw] sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
          CONSTRUCTION
        </span>
        <span className="font-mono text-[8vw] sm:text-5xl md:text-6xl font-bold tracking-tight leading-none text-[#FF6B00]">
          ESTIMATING
        </span>
        <p className="text-[2vw] sm:text-xs text-white/50 font-mono tracking-widest uppercase mt-2">Fork · Build · Ship</p>
      </div>

      {/* Division chips - front bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[8%] flex gap-1.5 opacity-80">
        {["Materials","Labor","Subs"].map((t, i) => (
          <span key={t} className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${i === 0 ? "border-[#FF6B00] bg-[#FF6B00]/20 text-[#FF6B00]" : "border-white/15 bg-white/5 text-white/50"}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}
