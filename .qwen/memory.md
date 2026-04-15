# Project Memory: mail-fe

## Overview
Next.js 16 (App Router) mail service frontend with Appwrite auth backend.

## Stack
- **Framework:** Next.js 16.2.1 (React 19, RSC, React Compiler)
- **Language:** TypeScript 5 (strict, paths: @/* → src/*)
- **Styling:** Tailwind CSS 4, shadcn/ui (base-mira)
- **State:** Zustand, TanStack Query, React Hook Form + Zod
- **Icons:** Lucide, Hugeicons
- **Linting:** Biome
- **Runtime:** Bun

## Auth Flow (Appwrite)
1. POST `/v1/account/sessions/email` → session cookie
2. POST `/v1/account/jwt` → JWT
3. Store: `token` (JWT), `mail_session` (encrypted Appwrite cookie)
4. Auto-refresh via middleware before expiry

## Key Files
```
src/
├── app/
│   ├── (dashboard)/dashboard/page.tsx  # Protected route
│   ├── (master)/master/                # Master data pages (tipe-surat, jenis-dokumen)
│   ├── actions/auth.ts                 # Server: doLogin, logout
│   ├── login/page.tsx                  # Public login
│   ├── layout.tsx, page.tsx, providers.tsx
│   └── globals.css
├── components/
│   ├── auth/login-form.tsx
│   ├── builder/                        # Form controls (input-text, delete-confirm)
│   ├── mail-type/, document-type/      # Master data components
│   └── ui/                             # shadcn components
├── hooks/                              # auth-hooks, mail-type-hooks, document-type-hooks
├── lib/
│   ├── api-client.ts                   # HTTP utils (proxy via /api/proxy)
│   ├── document-type-api.ts            # Master data API
│   ├── constants.ts                    # Appwrite config
│   ├── dal.ts                          # verifySession, getUser (RSC)
│   ├── session.ts                      # JWT encrypt/decrypt, cookies
│   └── utils.ts                        # cn()
├── types/                              # auth.ts, api.ts, document-type.ts
└── proxy.ts                            # Middleware: auth, refresh, proxy
```

## Env Vars
```
APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_HOSTNAME
SESSION_SECRET (base64url, A256GCM), DEFAULT_MAIL_DOMAIN, API_BASE_URL
```

## Patterns
- **RSC:** `getSession`, `verifySession`, `getUser` (cache + redirect)
- **Client:** TanStack Query mutations, toast (sonner)
- **Proxy:** `/api/proxy/*` → `API_BASE_URL` with Bearer JWT
- **Validation:** Zod schemas in `types/`
- **Master Data:** Consistent pattern (Types → API → Hooks/Orchestrator → Components → Page) with DataTable and Form/Delete dialogs.
- **Form controls:** Standardized controls in `components/builder/` using `react-hook-form`.

## Commands
```bash
bun dev          # Start dev server
bun build        # Production build
bun lint         # Biome check
bun format       # Biome format
```
