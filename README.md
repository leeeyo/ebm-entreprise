# EBM Entreprise

Production-ready V1 website and estimate simulator for **EBM Ben Mokhtar**, a Tunisian construction and civil engineering company.

The project combines a public marketing website, a server-authoritative project estimate simulator, lead capture, and a simple administration area for content, pricing, projects, and inquiries.

## Features

- Public construction, renovation, services, projects, news, simulator, and contact pages
- Multi-step estimate simulator with admin-managed pricing
- Server-side estimate validation and qualified lead capture
- Back-office for projects, services, blog posts, FAQs, site settings, leads, and contact forms
- Local image uploads through a configurable runtime directory
- Optional SMTP notifications, Google Analytics, Meta Pixel, and Meta Conversions API
- SEO metadata, sitemap, robots configuration, and semantic marketing pages

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS v4 and shadcn/ui
- MongoDB and Mongoose
- Auth.js / NextAuth v5 credentials authentication
- Nodemailer

## Requirements

- Node.js 20.9 or newer
- MongoDB

## Local Setup

1. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`:

   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `AUTH_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

3. Install dependencies and seed the first administrator:

   ```bash
   npm install
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The public site is available at `http://localhost:3000`. The admin login is available at `http://localhost:3000/admin/login`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Upsert the initial admin and default simulator settings |
| `npm run seed:content` | Seed the default CMS content |

## Environment

See [.env.example](./.env.example) for the full configuration template.

Required application variables:

- `MONGODB_URI`
- `AUTH_SECRET`
- `AUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional integrations:

- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- Google Analytics: prefer server-side `GA_MEASUREMENT_ID`, `GA_DISABLED`, `GA_DEBUG`; `NEXT_PUBLIC_GA_*` remains supported for compatibility
- Meta: `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, and related tracking flags
- Upload storage: `UPLOAD_DIR`, defaulting to `./uploads`

## Production Notes

- Run the app behind a TLS-enabled reverse proxy.
- Keep MongoDB private and back up it together with `UPLOAD_DIR`.
- Ensure the Node.js process can write to `UPLOAD_DIR`.
- Configure SMTP only when lead notification emails are required.
- Seed the admin account before the first production login.

## Repository Layout

```text
scripts/     Database seed scripts
src/app/     Public pages, admin pages, and API route handlers
src/components/
src/content/ Static French content and seed data
src/lib/     Database, pricing, analytics, email, and shared helpers
src/models/  Mongoose models
public/      Production static assets
uploads/     Runtime uploads, intentionally not committed
```

Additional implementation notes are available in [AGENTS.md](./AGENTS.md) and [docs/meta-tracking.md](./docs/meta-tracking.md).
