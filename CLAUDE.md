# CLAUDE.md

Guidance for Claude Code working in this repo. See `AGENTS.md` for the full product spec, brand rules, and SEO/copy conventions — this file is the engineering quick-reference.

## 1. Project overview

Public website + estimate simulator ("Simulateur") for **EBM Ben Mokhtar** (Tunisian construction / BTP company). Marketing pages plus a multi-step quote wizard that captures qualified leads, backed by a simple admin back-office for staff to edit pricing, content, project galleries, and read leads.

**Stack**

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Styling/UI**: Tailwind CSS v4, shadcn/ui (style `base-nova`, Base UI primitives via `@base-ui/react`, `@radix-ui/react-slot`), Lucide icons, `next-themes`, `framer-motion`, `tw-animate-css`, `sonner` toasts
- **Auth**: NextAuth v5 beta (`next-auth@5.0.0-beta`), Credentials provider, JWT sessions, bcrypt password hashing
- **Data**: MongoDB via Mongoose 9 (HMR-safe singleton in `src/lib/db.ts`)
- **Validation**: Zod v4
- **Email**: Nodemailer (OVH SMTP, optional, env-driven)
- **Uploads**: local filesystem under `UPLOAD_DIR` (default `./uploads`, gitignored, served via `/api/uploads/[...path]`)

## 2. Architecture

```
src/
├── app/
│   ├── (marketing)/        # Public site route group
│   │   ├── page.tsx        # Accueil
│   │   ├── construction/   # Construction villa / immeubles
│   │   ├── renovation/     # Rénovation maison, salle de bain
│   │   ├── services/[...slug]/  # Catch-all for fluide / élec / menuiserie / extérieurs
│   │   ├── projets/        # Résidences (Amira, Tulipe, Ennakhil, …)
│   │   ├── simulateur/     # Multi-step estimate wizard
│   │   ├── actualites/, contact/, acces-refuse/
│   │   └── layout.tsx, loading.tsx, not-found.tsx
│   ├── admin/
│   │   ├── login/          # Sign-in page
│   │   ├── (dashboard)/    # Authed route group: leads, chantiers, content, contact-forms, settings, site
│   │   ├── actions.ts      # Server actions for the admin UI
│   │   └── layout.tsx
│   ├── api/                # Route handlers
│   │   ├── auth/           # NextAuth handlers
│   │   ├── leads/          # POST: public simulator submission (validates, prices server-side, persists Lead, optional email)
│   │   ├── simulator/settings/  # Public read of pricing snapshot
│   │   ├── contact/, blog-posts/, projects/, services/, faqs/, site-settings/, chantier-assets/
│   │   ├── upload/, uploads/[...path]/   # Image upload + serving
│   │   └── admin/          # Auth-gated CRUD: leads, projects, services, blog-posts, faqs, settings, site-settings, chantier-assets, contact-submissions
│   ├── layout.tsx, globals.css, forbidden.tsx, not-found.tsx
│   └── favicon.ico
├── auth.ts                 # NextAuth config (Credentials + Mongo lookup)
├── proxy.ts                # Middleware: protects /admin/* and redirects logged-in users away from /admin/login
├── components/             # ui/, admin/, brand/, contact/, home/, landing/, layout/, marketing/, motion/, simulateur/, templates/
├── content/                # Static French copy modules (home, simulateur, projets, contact, service-pages, residence-covers, tunis-locations, …)
├── lib/
│   ├── db.ts               # Mongoose singleton
│   ├── mail.ts             # Lead notification email
│   ├── navigation.ts       # Nav structure
│   ├── advanced-simulator/ # Pricing engine: createDefaultLineItems, calculateAdvancedEstimateTotals, SIMULATOR_PRICING_VERSION
│   ├── simulator-pricing.ts, simulator-settings-defaults.ts
│   ├── cms-content.ts, service-page-editor.ts, embedded-gallery.ts
│   └── utils.ts, use-prefers-reduced-motion.ts
├── models/                 # Mongoose schemas: User, Lead, SimulatorSettings, SiteSettings, Project, ServicePage, BlogPost, FaqEntry, ContactSubmission
├── hooks/, types/
scripts/seed.ts             # Upsert admin user + default SimulatorSettings doc (key: "default")
public/, uploads/           # uploads/ created at runtime, not committed
advanced-simulator/         # Out-of-build prototype (excluded in tsconfig)
```

**Data flow — simulator submission** (`POST /api/leads`):
1. Zod-validates `{ name, email, phone, simulation.project }`.
2. Loads (or creates) the singleton `SimulatorSettings` doc keyed `"default"`.
3. Computes line items + totals server-side via `lib/advanced-simulator/pricing` — never trust the client estimate.
4. Persists a `Lead` with `estimateTnd`, `pricingVersion = ${SIMULATOR_PRICING_VERSION}@${settings.updatedAt}`, full `settingsSnapshot`, and the simulation payload.
5. Best-effort sends notification email to `SMTP_USER ?? ADMIN_EMAIL` if SMTP is configured.

**Auth flow**: `proxy.ts` middleware (matcher `/admin/:path*`) calls `auth()` and redirects unauthenticated requests to `/admin/login` with a `callbackUrl`. Credentials provider in `src/auth.ts` looks up `User` in Mongo, checks `bcrypt.compare`, and exposes `role` on the JWT/session.

## 3. Key conventions

- **Path alias**: `@/*` → `src/*` (use it; avoid relative `../../..`).
- **Strict TS**: prefer explicit types and interfaces, typed component props, `unknown` + narrowing over `any`. Reuse existing types in `src/types` and `src/models` before inventing new shapes (see AGENTS.md).
- **shadcn aliases**: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`. Style `base-nova`, base color `neutral`, CSS variables in `src/app/globals.css`.
- **Route groups**: `(marketing)` for public pages, `(dashboard)` for authed admin — group folders don't appear in URLs.
- **Naming**: kebab-case files (`service-page-editor.ts`), PascalCase Mongoose models (`SimulatorSettings.ts`), Next.js conventional `page.tsx` / `layout.tsx` / `loading.tsx` / `not-found.tsx` / `route.ts`.
- **French UI copy** lives in `src/content/*.ts`. Respect spelling/accents from AGENTS.md (Rénovation, Actualités, m², …). Assistant replies stay in **English** even if the user writes French.
- **Brand**: noir / blanc / gris / orange. Every public page should carry a CTA (Demander un devis / Lancer le simulateur).
- **Validation**: every API route handler should `safeParse` its input with Zod before touching the DB.
- **DB access**: always `await connectDB()` from `@/lib/db` before Mongoose calls — it caches the connection on `globalThis` for HMR.

## 4. Commands

| Command | What it does |
|---|---|
| `npm install` | Install deps |
| `npm run dev` | Next dev server on `127.0.0.1:3000` |
| `npm run build` | Production build |
| `npm start` | Production server on `127.0.0.1:3000` |
| `npm run lint` | ESLint (flat config, `eslint-config-next` core-web-vitals + TS) |
| `npm run seed` | `tsx scripts/seed.ts` — upsert admin user + default `SimulatorSettings` |

**AGENTS.md rule** (applies to Claude here): do **not** run `npm install` / `dev` / `build` / `start` / `lint` unless the user explicitly asks for it in the same message. The user runs these locally.

## 5. Environment

Required (loaded from `.env.local`, then `.env`):

- `MONGODB_URI` — Mongo connection string
- `AUTH_SECRET` — NextAuth signing secret (`openssl rand -base64 32`)
- `AUTH_URL` — public site URL, no trailing slash (e.g. `http://localhost:3000`)
- `ADMIN_EMAIL` — first admin login (defaults to `admin@ebm-entreprise.tn` in seed)
- `ADMIN_PASSWORD` — required by `npm run seed` to create the first admin

Optional:

- `SMTP_HOST`, `SMTP_PORT` (default `587`, secure if `465`), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` — OVH SMTP for lead notifications. Without all three of host/user/password, email is silently skipped.
- `UPLOAD_DIR` — absolute path for runtime uploads (back-office chantier photos). Must be writable; include in backups alongside Mongo dumps.
- `NODE_ENV`

External services: MongoDB; OVH SMTP (optional); Unsplash images allow-listed in `next.config.ts` (`images.unsplash.com`).

## 6. Gotchas

- **Pricing is server-authoritative.** `/api/leads` recomputes totals from the persisted `SimulatorSettings` — don't refactor it to trust client-submitted `estimateTnd`. Each Lead embeds a full `settingsSnapshot` + `pricingVersion` so historic estimates remain reproducible after admins change prices.
- **`SimulatorSettings` is a singleton** keyed `key: "default"`. The seed and the leads route both `findOneAndUpdate` / `findOne` against that key — keep it.
- **`advanced-simulator/` at the repo root is excluded in `tsconfig.json`** (it's a prototype). The active engine is `src/lib/advanced-simulator/`.
- **NextAuth v5 is in beta** (`5.0.0-beta.30`). API surface differs from v4 — middleware uses the `auth(req => …)` wrapper exported from `src/auth.ts`, and the file is named `proxy.ts` (not `middleware.ts`) — verify Next.js still picks this up if you touch routing config.
- **HMR-safe Mongoose**: don't call `mongoose.connect` directly elsewhere; use `connectDB()` so the dev cache on `globalThis.mongooseCache` keeps working.
- **Nodemailer override**: `package.json` pins `nodemailer ^8.0.5` and `uuid ^13` via `overrides` — bumping either may need an explicit override update.
- **Uploads are local-disk only.** No S3/CDN. Behind nginx/Caddy in prod, raise `client_max_body_size` for image uploads, and back up `UPLOAD_DIR` together with Mongo.
- **README.md is UTF-16-encoded** (looks spaced-out when read raw). Don't rewrite it as UTF-8 without preserving intent.
- **Performance budget**: <2s perceived load is a product requirement. Prefer WebP, semantic H1/H2/H3, image alt text — see AGENTS.md SEO section.
- **Brand colors and CTA presence on every page** are non-negotiable per AGENTS.md once the layout exists.
