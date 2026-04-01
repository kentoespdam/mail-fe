# CLAUDE.md

## Commands
```bash
bun dev          # Dev server
bun run build    # Build
bun run lint     # Biome lint
bun run format   # Biome fix
```

## Tech Stack
Next.js 16.2.1 (App Router, React 19), Bun, TypeScript 5, Biome (tabs), Tailwind v4 (OKLch), shadcn v4 + base-ui, TanStack Query v5, Zustand v5, RHF + Zod v4, Appwrite + jose (JWT), NextProxy.

## Conventions
- **Path Alias:** `@/*` → `./src/*`
- **API Proxy:** `/api/proxy/*` → `API_BASE_URL` (Bearer auto-injected by middleware)
- **Auth:** `src/proxy.ts` (NextProxy) handles route protection, JWT refresh, API proxy
- **Forms:** `FieldGroup > Controller > Field > FieldLabel + Input + FieldError`, builder components accept `form` (UseFormReturn)
- **Routing:** Protected routes inside `(main)` group
- **UX:** All UI text, errors, toasts in Bahasa Indonesia
- **API docs:** `apidocs/` directory (core, master)

## Env Vars
`API_BASE_URL`, `APPWRITE_HOSTNAME`, `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `DEFAULT_MAIL_DOMAIN`, `SESSION_SECRET`

## Memory
Setelah menyelesaikan tugas (implement fitur, fix bug, refactor, dll), **selalu update memory** di `/home/dev/.claude/projects/-mnt-DATA-html-mail-fe/memory/`:
- Update `MEMORY.md` index jika ada route/feature baru
- Buat/update feature file jika ada fitur baru atau perubahan signifikan
- Update layer files jika ada perubahan arsitektur/pattern
