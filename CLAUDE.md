# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Astro dev server (localhost:4321)
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
```

No test or lint commands are configured. Deployment to GitHub Pages is automated via `.github/workflows/deploy-github-pages.yml` on push to `main`.

## Stack

- **Astro 6** — static site generator with file-based routing
- **Preact 10** — lightweight React alternative for interactive components (client-side hydration only)
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (no tailwind.config.js; configuration is in CSS)
- **TypeScript** — strict mode with path aliases (`@/*`, `@components/*`, `@layouts/*`, `@data/*`)

## Architecture

### Routing

`src/pages/` maps directly to URLs. Service pages live under `src/pages/uslugi/`. All navigation links go through `src/utils/basePath.ts#withBase()` — this is required for GitHub Pages project-site URL prefix support. Never hardcode `/` paths directly; always use `withBase()`.

### Data Layer

Business content is driven by three JSON files in `src/data/`:
- `services.json` — service definitions (slug, title, description, icon, pricing)
- `prices.json` — detailed pricing by category with work types and cost ranges
- `business.json` — business metadata (address, phone, hours, coordinates)

Components and pages import these directly. Changing a price or adding a service starts here.

### Components

- **Astro components** (`src/components/*.astro`) — server-rendered, no client JS. Used for layout, navigation, static cards.
- **Preact components** (`src/components/*.tsx`) — client-side interactive. Currently `QuizCalculator.tsx`, `BeforeAfterSlider.tsx`, `LeadForm.tsx`, `MessengerModal.tsx`. Must be hydrated via Astro's `client:*` directives (e.g., `client:load`).

### Styling

Global theme is in `src/styles/global.css` using CSS custom properties. Dark theme is the default; light mode toggled via `data-theme` attribute on `<html>` (persisted in localStorage). The accent color is gold `#f2d85b`. All theme values (`--color-*`, `--font-*`, `--spacing-*`) are defined there — prefer these variables over hardcoded Tailwind values.

### GitHub Pages Config

`astro.config.mjs` reads the `ASTRO_GITHUB_PAGES` env var to conditionally set `base` and `site`. The CI workflow sets this automatically. Locally the variable is not set, so paths work without a prefix.

### Lead Form Backend

The site has a lead form (`LeadForm.tsx`) that accepts photos and submits to a Cloudflare Worker which forwards to a Telegram bot. The Worker lives in `worker/` (separate package, deployed independently via `wrangler deploy`). The site reads the Worker URL from the `PUBLIC_LEAD_FORM_URL` env var (`.env`); see `worker/README.md` for setup.
