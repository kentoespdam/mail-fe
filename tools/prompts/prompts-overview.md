# 🛠 Prompt Templates Overview

## 1. `generate-component.md`
**Standard:** React 19 (Compiler), Tailwind v4 (OKLch, 60-30-10), Biome (Tabs), Bahasa Indonesia.
* **Libraries:** `shadcn v4` (base-mira), `@base-ui/react`, `@tabler/icons-react`, `TanStack Query/Table`.
* **Rules:** Wajib `memo()` + `displayName`, gunakan path alias `@/*`, output file tunggal `.tsx`.

## 2. `scaffold-module.md` (Ref: `patterns.md`)
**Input:** Nama Fitur `{F}`, Route, Endpoint.
**Architecture:**
1.  `types/{f}.ts`: Zod Schema, DTOs, Spring Page interface.
2.  `lib/{f}-api.ts`: CRUD fetchers melalui `/api/proxy/*`.
3.  `hooks/{f}-hooks.tsx`: `use{F}Content` orchestrator (State + Table logic).
4.  `components/{f}/`: UI Components (Content, Form Dialogs, Delete).
5.  `app/(main)/.../page.tsx`: Entry point dengan `force-dynamic`.

## 3. `review-pr.md`
**Format:** `CRITICAL` | `WARNING` | `SUGGESTION`.
* **Security:** Hardcoded secrets? Zod validation di semua input?
* **Standards:** Biome compliance (Tabs)? Tailwind v4 (CSS variables)?
* **Logic:** Penggunaan `NextProxy` & Server Actions? Bahasa Indonesia untuk UI/Toast?

## 4. `debug-issue.md`
**Protocol:**
1.  **Repro:** Langkah trigger isu secara konsisten.
2.  **Logs:** Trace via `bun dev` atau Proxy Middleware.
3.  **Isolate:** Cek logika `src/actions/` vs `src/lib/api-client.ts`.
4.  **Lint:** Jalankan `bun run lint` (Biome) untuk error sintaks/logika.
5.  **Verify:** Apply fix + `bun run build`.

## 5. `explain-module.md`
**Analysis:**
* **Entry:** Route group & Page entry.
* **Flow:** Server Action → Proxy (`/api/proxy/*`) → Backend Service.
* **State:** Hook Orchestrator & TanStack Query integration.
* **Security:** Integrasi `dal.ts` (cache) dan `session.ts` (`jose`).