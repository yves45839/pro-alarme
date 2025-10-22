### Quick orientation for AI coding agents

This repository is a Next.js 15 app (app router) written in TypeScript and React 19 with Tailwind CSS. The site is a small marketing/application site for "Pro Alarme". Use these notes to be productive quickly and to maintain project conventions.

Key files and locations
- `package.json` — scripts: `dev` (Next dev with turbopack), `build`, `start`, `lint`.
- `src/app/` — application entry (app router). Main pages/components live here: `page.tsx`, `layout.tsx`, `terms/page.tsx`.
- `src/app/globals.css` — Tailwind + global styles. Keep styling consistent here.
- `public/images/` — static images imported with `@public/*` path alias configured in `tsconfig.json`.
- `next.config.ts` — image remotePatterns configured for Unsplash (used by `next/image`).

Project conventions you must follow
- App router (React Server Components by default): files under `src/app` follow Next.js app directory semantics. Keep server/client boundaries in mind: any component using hooks or client-only APIs must use `"use client"` at the top (see `src/app/page.tsx`).
- TypeScript strict mode is enabled — prefer explicit types for props and hooks where reasonable. Avoid disabling type checks.
- Path aliases: `@/*` -> `src/*` and `@public/*` -> `public/*`. Prefer these imports when referencing project modules or public assets.
- Styling: Tailwind utility classes are used directly in JSX; prefer adding classes in place for small changes. For larger layout or theme adjustments, update `globals.css`.
- Images: use `next/image` with imported assets (e.g. `import agentSecurityImage from "@public/images/agent-securite.png"`) or remote images permitted by `next.config.ts`.

Build & developer workflows (explicit commands)
- Local dev (uses turbopack by default): `npm run dev` — runs `next dev --turbopack`.
- Production build: `npm run build` then `npm start`.
- Lint: `npm run lint` (project has ESLint configured via `eslint-config-next`).

Patterns and examples from the codebase
- Multi-step interactive form: see `src/app/page.tsx` — a client component that manages step state with `useState`, `useMemo`, and controlled inputs. If editing the form, maintain current step logic (array `stepQuestions`, `currentStep` state, `handleNext`, `handleBack`).
- Icons: small inline SVG functional components (e.g. `LightningIcon`, `ShieldIcon`) living in `page.tsx`. Reuse pattern: accept `SVGProps<SVGSVGElement>` and spread props onto `<svg>`.
- Fonts: `next/font/google` is used in `src/app/layout.tsx` and injected via CSS variables. When adding fonts, keep the same pattern to preserve `--font-*` variables.

Integration & external dependencies
- Vercel deployment: README includes Vercel defaults. Build output is `.next`.
- Remote images: `images.unsplash.com` allowed in `next.config.ts`. If adding other external image hosts, update `remotePatterns`.

What an AI agent should do and avoid
- Do: Make minimal, focused edits and run type/lint checks locally (see commands above). Add explicit types for public exports and component props.
- Do: Preserve French copy (the site is French). Keep text content changes small unless asked.
- Avoid: Changing global build or dependency versions unless explicitly requested. Avoid adding large libraries; prefer existing stack (Next, React, Tailwind).

Examples to reference in PRs
- When adding a client component, start with:
  - a top-line `"use client"` directive
  - explicit prop typing: `type Props = { ... }`
  - Tailwind classes for layout

- When importing an image asset use the alias and `next/image`:
  - `import logo from "@public/images/logo.png";` and `<Image src={logo} alt="..." width={400} height={200} />`

Edge cases discovered
- The project currently uses `next dev --turbopack` in `package.json`. Turbopack can behave differently than webpack; if file-watch or type errors occur in local dev, try removing `--turbopack` for a fallback dev environment.

References to inspect when uncertain
- `src/app/page.tsx` — main interactive logic and UI patterns.
- `src/app/layout.tsx` — global fonts and root layout.
- `next.config.ts` — image host rules.
- `tsconfig.json` — path aliases and strict TypeScript settings.

If anything here is unclear or you want more detail (tests, CI, or deployment configs), tell me which area to expand and I will update this file.
