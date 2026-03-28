# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run lint     # Lint with Biome
bun run format   # Format with Biome (auto-fix)
```

## Stack

- **Next.js 16.2.1** (App Router, React 19, React Compiler enabled)
- **Bun** package manager — use `bun add` not `npm install`
- **Biome** for linting/formatting (tabs, recommended rules) — not ESLint/Prettier
- **Tailwind CSS v4** via PostCSS plugin (no tailwind.config; styles in `src/app/globals.css` using CSS custom props with OKLch colors)
- **@base-ui/react** + **shadcn v4** UI primitives, **CVA** for variants
- **react-hook-form** + **zod v4** for forms
- **TanStack Query v5** for server state
- **jose** for JWT encrypt/decrypt
- **next-themes** for dark mode, **sonner** for toasts

## Architecture

**Auth flow:** Login server action → Appwrite session + JWT → encrypted `token` cookie (jose). Proxy middleware (`src/proxy.ts`, exported as `NextProxy`) handles route protection, JWT refresh from Appwrite session cookie, and API proxying (`/api/proxy/*` → backend).

**Key directories:**
- `src/actions/` — server actions (auth)
- `src/lib/` — `session.ts` (JWT), `dal.ts` (data access layer, cached user verification), `api-client.ts` (generic REST client proxied through `/api/proxy/*`), `constants.ts` (env vars)
- `src/components/builder/` — controlled form inputs wrapping react-hook-form `Controller`
- `src/components/ui/` — shadcn components
- `src/hooks/` — `useLogin()` combines form + mutation + navigation
- `src/types/` — `auth.ts` (LoginSchema, LoginPayload), `api.ts` (ApiError)

**Patterns:**
- Path alias: `@/*` → `./src/*`
- Route group `(main)` for protected routes
- Form composition: `FieldGroup > Field > FieldLabel + Input + FieldError`
- Builder components accept `form` prop (react-hook-form instance) + field metadata
- Middleware uses `NextProxy` export (Next.js 16 pattern) — not `middleware.ts` default export

## Environment Variables

Required: `SESSION_SECRET`, `APPWRITE_PROJECT_ID`, `APPWRITE_ENDPOINT`, `API_BASE_URL`
