# LoadBear — Construction Estimate Builder

A professional construction estimating tool built for small general contractors and subcontractors. Think of it as the modern SaaS replacement for that single-tab spreadsheet with 30-50 line items and a markup section that gets most small GCs through the door.

## What It Does

- **Project header** with editable project name, client, estimator, address, dates, and bid due date
- **Line items table** with inline editing — CSI division, description, quantity, unit (SF, LF, EA, CY, etc.), unit cost, and auto-calculated total
- **Division chip filters** to quickly scope down to a specific CSI division; click a selected chip to deselect and see all
- **Cost type tagging** — every line item is tagged as Material, Labor, Equipment, or Subcontractor for roll-up breakdowns
- **Division subtotals** — items are grouped by CSI division with running subtotals per group
- **Markup section** — configurable overhead %, profit margin, contingency (5-10% typical), bond cost, and sales tax on materials
- **Bid summary card** — visual cost breakdown by type with progress bars, plus a running total bid price that updates live
- **AI estimating assistant** — floating chat panel powered by AI SDK 6 via the Vercel AI Gateway, pre-configured with construction estimating expertise
- **Settings modal** with General and Agent tabs — pick your model (Claude, GPT-5 Mini, Gemini), set temperature, max tokens, and customize the system prompt

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| AI | AI SDK 6 + Vercel AI Gateway |
| Fonts | Inter (body), JetBrains Mono (numbers) |
| State | `useSyncExternalStore` (zero-dependency reactive store) |

## Project Structure

```
app/
  page.tsx              # Main estimate page (client component)
  layout.tsx            # Root layout with fonts, metadata, Toaster
  api/chat/route.ts     # AI chat streaming endpoint
  globals.css           # Design tokens (warm amber primary, slate neutrals)

components/
  app-header.tsx        # Top bar with LoadBear branding, AI + Settings buttons, mobile menu
  project-header.tsx    # Editable project info card
  division-chips.tsx    # Chip-style division filter bar
  line-items-table.tsx  # Main line items table with division grouping
  line-item-row.tsx     # Individual editable row
  add-line-item-dialog.tsx  # Modal for adding new line items
  markup-section.tsx    # Overhead, profit, contingency, bond, tax inputs
  bid-summary.tsx       # Cost breakdown + total bid price card
  chat-panel.tsx        # Floating AI chat panel
  settings-dialog.tsx   # Settings modal (General + Agent tabs)

data/
  estimate.json         # Sample estimate (Riverside Office Renovation)
  agent-settings.json   # Default AI agent configuration

lib/
  types.ts              # TypeScript interfaces for the whole app
  estimate-store.ts     # Reactive store with mutations + derived calculations
  format.ts             # Currency, number, percent formatting helpers
```

## Running Locally

```bash
pnpm install
pnpm dev
```

The app loads with a pre-populated sample estimate for a commercial office renovation (~30 line items across 8 CSI divisions). Edit anything inline, add new items, tweak markups, and watch the bid total update in real time.

## AI Assistant

The chat panel connects to the Vercel AI Gateway — no API key setup needed for OpenAI, Anthropic, or Google models. The default model is Claude Opus 4.6 with a construction-focused system prompt. You can change the model, temperature, and prompt from Settings > Agent.
