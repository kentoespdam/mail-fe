# SmartOffice Mail Service — Frontend (QWEN.md)

## Project Overview

**SmartOffice Mail Service** is a Next.js 16 + React 19 frontend for migrating the SmartOffice Mail Service from CodeIgniter 2 to a modern REST API architecture (Spring Boot backend). This is a government mail management system for PERUMDAM TIRTA SATRIA.

### Core Technologies

| Layer | Technology |
|:------|:----------|
| **Framework** | Next.js 16.2.2 (App Router, React 19) |
| **Runtime** | Bun |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 (OKLch color system) |
| **UI** | shadcn v4 + Base UI |
| **State** | Zustand v5 (client), TanStack Query v5 (server) |
| **Tables** | TanStack Table v8 |
| **Forms** | React Hook Form v7 + Zod v4 |
| **Auth** | Appwrite + jose (JWT session) |
| **Linting** | Biome v2.2.0 |

---

## Building and Running

### Prerequisites
- [Bun](https://bun.sh/) runtime installed
- Environment variables configured (see `.env.example` or README)

### Commands

```bash
# Install dependencies
bun install

# Development server
bun dev

# Production build
bun run build

# Start production server
bun run start

# Lint (Biome - auto-fix)
bun run lint

# Format (Biome)
bun run format
```

### Environment Variables

Required env vars (configure in `.env.local`):

```env
API_BASE_URL=           # Backend Spring Boot API (e.g., http://localhost:8080/api/v1)
APPWRITE_HOSTNAME=
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
DEFAULT_MAIL_DOMAIN=
SESSION_SECRET=
```

---

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Protected routes (auth required)
│   │   ├── dashboard/
│   │   ├── persuratan/      # Mail service (inbox/outbox/internal)
│   │   ├── publikasi/       # Publication management
│   │   └── ...
│   ├── (master)/            # Master data admin routes
│   │   ├── pesan-singkat/
│   │   ├── tipe-surat/
│   │   └── kategori-surat/
│   ├── login/
│   ├── layout.tsx           # Root layout (theme, fonts, toaster)
│   ├── providers.tsx        # React Query provider
│   └── theme-providers.tsx  # next-themes provider
├── components/
│   ├── ui/                  # shadcn + custom base components
│   ├── builder/             # Form controller components (RHF wrappers)
│   ├── dashboard/           # Dashboard widgets
│   ├── auth/                # Auth-related components
│   ├── quick-message/       # Quick message feature components
│   ├── mail-type/           # Mail type feature components
│   ├── mail-category/       # Mail category feature components
│   └── publication/         # Publication feature components
├── hooks/                   # Custom hooks (TanStack Query + URL state)
├── lib/                     # API clients, session, utils, constants
├── types/                   # TypeScript type definitions + Zod schemas
└── actions/                 # Server actions
```

---

## Development Conventions

### Architecture Patterns

#### 1. **Modular Context (ADR-001)**
- Per-module context files to reduce token bloat
- Root files act as indices

#### 2. **Feature Module Structure**
Each feature module follows this pattern:
- `src/hooks/<feature>-hooks.tsx` — TanStack Query hooks + UI state logic
- `src/lib/<feature>-api.ts` — API client functions
- `src/types/<feature>.ts` — TypeScript types + Zod schemas
- `src/components/<feature>/` — Feature-specific UI components
- `src/app/(main)/<feature>/` — Page routes

#### 3. **Hook Pattern**
```typescript
// Data fetching hook
export function useQuickMessages(page, size, search, sortBy, sortDir) {
  return useQuery({ queryKey: [...], queryFn: () => fetchQuickMessages(...) });
}

// Mutation hook
export function useCreateQuickMessage(onSuccess?: () => void) {
  const qc = useQueryClient();
  const form = useForm({ resolver: zodResolver(Schema) });
  const mutation = useMutation({
    mutationFn: createQuickMessage,
    onSuccess: () => { qc.invalidateQueries(...); toast.success(); }
  });
  return { form, mutation, onSubmit: form.handleSubmit(mutation.mutate) };
}

// UI state hook (URL-synced pagination/sort/filter)
export function useQuickMessageContent() { ... }
```

#### 4. **URL State Synchronization**
Use `useQueryState` for pagination, sorting, filters:
```typescript
const [page, setPage] = useQueryState("page", 0, {
  parse: (v) => Number.parseInt(v ?? "0", 10),
  serialize: (v) => String(v),
});
```

#### 5. **API Proxy Layer**
- All API calls go through `/api/proxy/*` → `API_BASE_URL`
- JWT Bearer token auto-injected via `src/proxy.ts` middleware
- Middleware handles auth protection, JWT refresh, cookie management

#### 6. **Form Pattern**
```
FieldGroup > Controller > Field > FieldLabel + Input + FieldError
```
- All forms use React Hook Form + Zod validation
- `builder/` components provide reusable form field wrappers

### Coding Standards

- **Strict TypeScript** — no `any`, full type safety
- **Tab indentation** (2 spaces equivalent via Biome config)
- **Biome** for linting + formatting (replaces ESLint + Prettier)
- **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`)
- **Server Components** by default; `"use client"` for client components

### Linting Rules (Biome)

- Tabs for indentation
- Next.js + React recommended rules enabled
- `suspicious/noUnknownAtRules` off (Tailwind compatibility)
- `a11y/useSemanticElements` off (Base UI compatibility)

### Testing Practices

Currently no test framework configured. Future plans include:
- Vitest + React Testing Library (unit tests)
- Playwright (E2E tests)

---

## Key Libraries & Usage

### TanStack Query (Server State)
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
```

### Zustand (Client State)
```typescript
import { create } from "zustand";
```

### React Hook Form + Zod
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Schema = z.object({ field: z.string().min(1) });
const form = useForm({ resolver: zodResolver(Schema) });
```

### TanStack Table
```typescript
import { useReactTable, getCoreRowModel, ... } from "@tanstack/react-table";
```

---

## API Integration

### Backend Endpoints (Spring Boot)

| Group | Prefix | Endpoints |
|:------|:-------|:----------|
| **Master** | `/api/v1/` | `mail-types`, `mail-categories`, `quick-messages`, `document-types`, `file-rules` |
| **Mail** | `/api/v1/` | `mails`, `mails/{id}/recipients`, `mails/{id}/attachments` |
| **Folder** | `/api/v1/` | `mail-folders` |
| **Archive** | `/api/v1/` | `mail-archives`, `mail-archives/{id}/access`, `mail-archives/{id}/notifications` |
| **Publication** | `/api/v1/` | `publications` |
| **Reports** | `/api/v1/reports/` | `category-statistics`, `org-statistics`, `response-time` |

Full API docs in `apidocs/`.

---

## Development Progress

### ✅ Iteration 1: Foundation & Master Data (Complete)
- Project setup (Next.js 16, Bun, Tailwind v4, shadcn v4)
- Auth flow (Appwrite + JWT session)
- CRUD for: Pesan Singkat, Tipe Surat, Kategori Surat, Publikasi
- DataTable component with URL-synced pagination/sort/filter

### ⬜ Iteration 2: Core Mail Service (Todo)
- Inbox, Mail Composer (TipTap), Mail Detail
- Reply/Forward, Search, Folder navigation
- Recipient selector (TO/CC/BCC/Disposisi)
- Attachments (drag-drop, preview)

### ⬜ Iteration 3: Archive & Analytics (Todo)
- Archive management dashboard
- Dashboard with charts (Recharts)
- Reports with date range picker

### ⬜ Iteration 4: Polish & Production (Todo)
- Performance optimization
- Testing (Vitest, Playwright)
- Accessibility audit (WCAG 2.1 AA)

---

## Important Notes

- **UI Text:** All UI text is in **Bahasa Indonesia**
- **Next.js 16:** This version has breaking changes from training data — consult `node_modules/next/dist/docs/` for API changes
- **Auth Flow:** JWT stored in httpOnly cookie, refreshed via Appwrite session
- **Protected Routes:** `/persuratan`, `/publikasi`, `/master` require authentication
