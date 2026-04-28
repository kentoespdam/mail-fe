# SmartOffice Mail Service — Frontend

> **Next.js 16 + React 19 frontend** untuk migrasi SmartOffice Mail Service dari CodeIgniter 2 ke arsitektur modern REST API.

## Tech Stack

| Layer | Teknologi |
|:------|:----------|
| **Framework** | Next.js 16.2.2 (App Router, React 19) |
| **Runtime** | Bun |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 (OKLch color system) |
| **UI Components** | shadcn v4 + Base UI |
| **State Management** | Zustand v5 (client), TanStack Query v5 (server) |
| **Table** | TanStack Table v8 |
| **Forms** | React Hook Form v7 + Zod v4 |
| **Auth** | Appwrite + jose (JWT session) |
| **Icons** | Hugeicons, Tabler Icons |
| **Linting** | Biome (tabs, format + lint) |

## Quick Start

```bash
bun install
bun dev          # Dev server
bun run build    # Production build
bun run lint     # Biome lint
bun run format   # Biome format
```

## Env Vars

```env
API_BASE_URL=           # Backend Spring Boot API
APPWRITE_HOSTNAME=
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
DEFAULT_MAIL_DOMAIN=
SESSION_SECRET=
```

## Arsitektur

```
src/
├── app/
│   ├── (main)/              # Protected routes (auth required)
│   │   ├── dashboard/
│   │   ├── persuratan/      # Mail (inbox/outbox/internal)
│   │   ├── publikasi/       # Publikasi
│   │   └── master/          # Master data admin
│   │       ├── pesan-singkat/
│   │       ├── tipe-surat/
│   │       └── kategori-surat/
│   └── login/
├── components/
│   ├── ui/                  # shadcn + custom base components
│   ├── builder/             # Form controller components (RHF wrappers)
│   ├── dashboard/           # Dashboard widgets
│   ├── auth/
│   ├── quick-message/
│   ├── mail-type/
│   ├── mail-category/
│   └── publication/
├── hooks/                   # Custom hooks (useQueryState, etc)
├── lib/                     # API clients, session, utils
└── types/                   # TypeScript type definitions
```

### Pattern & Konvensi

- **API Proxy:** `/api/proxy/*` → `API_BASE_URL` (Bearer auto-injected via `src/proxy.ts` NextProxy)
- **Auth:** NextProxy middleware handles route protection, JWT refresh, API proxy
- **Forms:** `FieldGroup > Controller > Field > FieldLabel + Input + FieldError`
- **URL State:** Pagination, sort, filter disimpan di URL query params via `useQueryState`
- **UI Text:** Semua dalam Bahasa Indonesia

## Progress Pengembangan

### Iterasi 1: Fondasi & Master Data (Minggu 1-6)

#### Sprint 1.1 — Setup Proyek & Infrastruktur (Minggu 1-3)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-1.1.1 | Setup Next.js 16 + TypeScript + Bun | 5 | ✅ Done |
| FE-1.1.2 | Konfigurasi Tailwind v4 + shadcn v4 + Base UI | 5 | ✅ Done |
| FE-1.1.3 | Konfigurasi TanStack Query + Zustand | 5 | ✅ Done |
| FE-1.1.4 | App Router structure + protected routes | 3 | ✅ Done |
| FE-1.1.5 | Biome lint + format | 3 | ✅ Done |
| FE-1.1.6 | API proxy layer (NextProxy) | 5 | ✅ Done |

#### Sprint 1.2 — Master Data & Admin UI (Minggu 4-6)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-1.2.1 | Layout utama (sidebar + topbar + navigation) | 8 | ✅ Done |
| FE-1.2.2 | Login page + Appwrite auth flow | 5 | ✅ Done |
| FE-1.2.3 | CRUD Pesan Singkat (quick-message) | 5 | ✅ Done |
| FE-1.2.4 | CRUD Tipe Surat (mail-type) | 5 | ✅ Done |
| FE-1.2.5 | CRUD Kategori Surat (mail-category) | 5 | ✅ Done |
| FE-1.2.6 | CRUD Publikasi (publication) | 5 | ✅ Done |
| FE-1.2.7 | Builder components (form controllers) | 5 | ✅ Done |
| FE-1.2.8 | DataTable component (TanStack Table) | 5 | ✅ Done |
| FE-1.2.9 | URL query state untuk pagination/sort/filter | 3 | ✅ Done |

---

### Iterasi 2: Mail Service Inti (Minggu 7-12)

#### Sprint 2.1 — Inbox & Mail Composer (Minggu 7-9)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-2.1.1 | Halaman Inbox — list mail dengan pagination & sorting | 8 | ⬜ Todo |
| FE-2.1.2 | Mail Composer — rich text editor (TipTap) | 13 | ⬜ Todo |
| FE-2.1.3 | Mail Detail — view dengan thread visualization | 8 | ⬜ Todo |
| FE-2.1.4 | Reply / Forward dengan quote handling | 5 | ⬜ Todo |
| FE-2.1.5 | Search & filter mail (multi-criteria) | 8 | ⬜ Todo |
| FE-2.1.6 | Mail folder tree navigation | 5 | ⬜ Todo |
| FE-2.1.7 | Loading states & skeleton screens | 3 | ⬜ Todo |

#### Sprint 2.2 — Recipients & Attachments (Minggu 10-12)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-2.2.1 | Recipient Selector — TO/CC/BCC/Disposisi dengan autocomplete | 8 | ⬜ Todo |
| FE-2.2.2 | Employee search dari HR API | 5 | ⬜ Todo |
| FE-2.2.3 | Drag & drop attachment upload (dropzone + progress) | 8 | ⬜ Todo |
| FE-2.2.4 | File preview modal (PDF, image, doc) | 5 | ⬜ Todo |
| FE-2.2.5 | Digital signature UI (PIN input) | 8 | ⬜ Todo |

---

### Iterasi 3: Arsip & Analitik (Minggu 13-18)

#### Sprint 3.1 — Archive Management (Minggu 13-15)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-3.1.1 | Archive management dashboard | 8 | ⬜ Todo |
| FE-3.1.2 | Archive form + location picker (gedung/lantai/rak/box) | 5 | ⬜ Todo |
| FE-3.1.3 | Archive search dengan filter lokasi | 8 | ⬜ Todo |
| FE-3.1.4 | Access control management UI | 5 | ⬜ Todo |
| FE-3.1.5 | Location hierarchy tree visualization | 3 | ⬜ Todo |

#### Sprint 3.2 — Dashboard & Reports (Minggu 16-18)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-3.2.1 | Dashboard — stats cards + charts (Recharts) | 8 | ⬜ Todo |
| FE-3.2.2 | Report pages — date range picker + filters | 8 | ⬜ Todo |
| FE-3.2.3 | SLA response time visualization | 5 | ⬜ Todo |
| FE-3.2.4 | Export laporan (PDF/Excel) | 5 | ⬜ Todo |
| FE-3.2.5 | Interactive charts dengan drill-down | 8 | ⬜ Todo |

---

### Iterasi 4: Polish & Production (Minggu 19-24)

#### Sprint 4.1 — Performance & Testing (Minggu 19-21)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-4.1.1 | Performance optimization (code splitting, lazy loading) | 8 | ⬜ Todo |
| FE-4.1.2 | Error boundary + user-friendly error handling | 5 | ⬜ Todo |
| FE-4.1.3 | Responsive design (mobile/tablet) | 8 | ⬜ Todo |
| FE-4.1.4 | Unit tests (Vitest + RTL, 80%+ coverage) | 8 | ⬜ Todo |
| FE-4.1.5 | E2E tests (Playwright) | 5 | ⬜ Todo |
| FE-4.1.6 | Accessibility audit (WCAG 2.1 AA) | 5 | ⬜ Todo |

#### Sprint 4.2 — UAT & Deployment (Minggu 22-24)

| ID | Story | SP | Status |
|:---|:------|:---|:-------|
| FE-4.2.1 | UAT environment + testing | 5 | ⬜ Todo |
| FE-4.2.2 | Error tracking (Sentry) | 5 | ⬜ Todo |
| FE-4.2.3 | Production build optimization | 5 | ⬜ Todo |
| FE-4.2.4 | Production deployment + CDN | 5 | ⬜ Todo |
| FE-4.2.5 | User documentation | 5 | ⬜ Todo |

---

## API Endpoints (Backend)

Dokumentasi lengkap ada di `apidocs/`. Ringkasan endpoint:

| Group | Prefix | Endpoint |
|:------|:-------|:---------|
| **Master** | `/api/v1/` | `mail-types`, `mail-categories`, `quick-messages`, `document-types`, `file-rules` |
| **Mail** | `/api/v1/` | `mails`, `mails/{id}/recipients`, `mails/{id}/attachments` |
| **Folder** | `/api/v1/` | `mail-folders` |
| **Archive** | `/api/v1/` | `mail-archives`, `mail-archives/{id}/access`, `mail-archives/{id}/notifications` |
| **Publication** | `/api/v1/` | `publications` |
| **Reports** | `/api/v1/reports/` | `category-statistics`, `org-statistics`, `response-time` |

## Database (20 Tabel)

| Kategori | Tabel |
|:---------|:------|
| **Master** | `mail_type`, `mail_category`, `mail_folder`, `pesan_singkat`, `smtp_mail_config` |
| **Transaksi** | `mail`, `sys_user_task`, `mail_recipient`, `mail_archive`, `mail_archive_access`, `mail_archive_notif`, `mail_archive_notif_log`, `attachments`, `attachment_download_history`, `mail_respontime`, `print_log`, `smtp_mail_log` |
| **Pelaporan** | `mail_category_statistic`, `mail_org_statistic` |

## Run with Docker

1. `cp .env.example .env` lalu isi nilai yang dibutuhkan.
2. `docker compose up -d --build`
3. Akses di http://localhost:3000
4. Stop: `docker compose down`
---

*Frontend development plan untuk migrasi SmartOffice Mail Service (CodeIgniter 2 → Spring Boot + Next.js)*
