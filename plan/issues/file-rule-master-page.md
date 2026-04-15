# Implementasi Page `/master/file-rule`

## Context

Perlu ditambahkan halaman master baru **Aturan File** (`/master/file-rule`) untuk mengelola aturan tipe file yang diperbolehkan (allowed file types) beserta batas ukuran per context. API backend sudah tersedia (lihat `apidocs/master/file-rule.json`). Implementasi mengikuti pattern yang sudah ada pada `/master/jenis-dokumen` (document-type).

### API Endpoints (file-rule.json)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/file-rules` | List paginated (search, context, sortBy, sortDir, page, size) |
| POST | `/api/v1/file-rules` | Create |
| PUT | `/api/v1/file-rules/{id}` | Update |
| DELETE | `/api/v1/file-rules/{id}` | Delete |
| GET | `/api/v1/file-rules/lookup` | Lookup by context (required query: `context`) |

> **Catatan:** Tidak ada endpoint GET by ID dan tidak ada endpoint toggle status. Berbeda dari pattern jenis-dokumen/tipe-surat.

### Schema

- **Request (`AllowedFileTypeRequest`):** `{ context: string (min 1), extension: string (min 1), maxSizeMb: int32, isActive?: boolean }`
- **Response (`AllowedFileTypeDto`):** `{ id, context, extension, maxSizeMb, isActive, createdAt, updatedAt }`

---

## Referensi Pattern (Jenis Dokumen / Tipe Surat)

Ikuti pattern dari fitur **Jenis Dokumen** dengan penyesuaian:

| Layer | File Referensi | Fungsi |
|-------|----------------|--------|
| Types | `src/types/document-type.ts` | Zod schema, DTO, PagedResponse |
| API | `src/lib/document-type-api.ts` | Fetch functions (CRUD) |
| Hooks | `src/hooks/document-type-hooks.tsx` | TanStack Query hooks + orchestrator hook |
| Content | `src/components/document-type/document-type-content.tsx` | Main page component |
| Form Dialog | `src/components/document-type/document-type-form-dialog.tsx` | Create/Edit dialog |
| Delete Dialog | `src/components/document-type/document-type-delete-dialog.tsx` | Delete confirmation |
| Page | `src/app/(master)/master/jenis-dokumen/page.tsx` | Next.js route page |
| Layout | `src/app/(master)/master/layout.tsx` | Tab navigation (MASTER_TABS) |

### Perbedaan dengan Pattern Jenis Dokumen

1. **Tidak ada toggle status endpoint** — Tidak ada PATCH status. Field `isActive` dikelola via form create/update (checkbox/switch).
2. **Tidak ada GET by ID** — Untuk edit, gunakan data dari row tabel yang sudah di-fetch (pass DTO langsung ke form dialog).
3. **Multiple fields** — Form punya 4 field (context, extension, maxSizeMb, isActive), bukan 1 field seperti jenis-dokumen.
4. **Filter context** — List endpoint punya query param `context` untuk filter, mirip filter `status` di jenis-dokumen.

---

## Langkah Implementasi

> **PENTING:** Gunakan skill/MCP tools (**context7** dan **next-devtools**) untuk referensi API dan dokumentasi library selama implementasi. Contoh:
> - Gunakan context7 untuk lookup docs Zod v4, TanStack Query v5, React Hook Form, dll.
> - Gunakan next-devtools untuk verifikasi route dan debugging.

### Langkah 1: Buat Types (`src/types/file-rule.ts`)

Buat file types baru mengikuti pattern `src/types/document-type.ts`:

- `FileRuleSchema` — Zod v4 schema dengan fields:
  - `context` (string, min 1, pesan: "Context wajib diisi")
  - `extension` (string, min 1, pesan: "Ekstensi wajib diisi")
  - `maxSizeMb` (number/coerce, min 1, pesan: "Ukuran maksimal wajib diisi")
  - `isActive` (boolean, default true)
- `FileRulePayload` — Inferred type dari schema
- `FileRuleDto` — Interface: `id`, `context`, `extension`, `maxSizeMb`, `isActive`, `createdAt`, `updatedAt`
- `PageFileRule` — Extends `PagedResponse<FileRuleDto>` dari `src/types/commons.ts`

### Langkah 2: Buat API Service (`src/lib/file-rule-api.ts`)

Buat file API baru mengikuti pattern `src/lib/document-type-api.ts`:

- Base endpoint: `/api/proxy/v1/file-rules`
- Functions:
  - `fetchFileRules(params)` — GET list paginated (params: search, context, sortBy, sortDir, page, size)
  - `fetchFileRulesLookup(context)` — GET `/lookup?context={context}`
  - `createFileRule(payload)` — POST
  - `updateFileRule(id, payload)` — PUT `/{id}`
  - `deleteFileRule(id)` — DELETE `/{id}`
- **Tidak ada** `fetchFileRule` (get by ID) dan `toggleFileRuleStatus`
- Pesan error dalam Bahasa Indonesia ("aturan file")

### Langkah 3: Buat Hooks (`src/hooks/file-rule-hooks.tsx`)

Buat hooks mengikuti pattern `src/hooks/document-type-hooks.tsx`:

- `QUERY_KEY = "file-rules"`
- `useFileRules()` — Query hook paginated
- `useCreateFileRule()` — Mutation + form (zodResolver). Form fields: context, extension, maxSizeMb, isActive.
- `useUpdateFileRule()` — Mutation + form + populate dari DTO. **Tidak perlu fetch by ID**, langsung populate dari data row.
- `useDeleteFileRule()` — Mutation
- `useFileRuleContent()` — Orchestrator hook (pagination, sorting, search, dialog states, column definitions)

**Kolom tabel:**

| # | Kolom | Accessor | Sortable | Keterangan |
|---|-------|----------|----------|------------|
| 1 | No | index | Tidak | Row number |
| 2 | Context | `context` | Ya | - |
| 3 | Ekstensi | `extension` | Ya | - |
| 4 | Max Size (MB) | `maxSizeMb` | Ya | - |
| 5 | Status | `isActive` | Tidak | Badge "Aktif" / "Nonaktif" (bukan toggle switch karena tidak ada endpoint terpisah) |
| 6 | Aksi | - | Tidak | Edit, Hapus |

### Langkah 4: Buat Components (`src/components/file-rule/`)

Buat 3 file component mengikuti pattern `src/components/document-type/`:

1. **`file-rule-content.tsx`** — Main content, render DataTable + dialogs. Gunakan `useFileRuleContent()`.
2. **`file-rule-form-dialog.tsx`** — Create + Edit dialog. Fields:
   - `context` — InputTextControll (text input)
   - `extension` — InputTextControll (text input, contoh: ".pdf", ".docx")
   - `maxSizeMb` — InputTextControll (number input)
   - `isActive` — Switch/Checkbox component (default: true)
3. **`file-rule-delete-dialog.tsx`** — Delete dialog, gunakan `DeleteConfirmDialog` dari `src/components/builder/delete-confirm-dialog.tsx`.

Semua label/title/toast dalam Bahasa Indonesia ("Aturan File", "Tambah Aturan File", "Edit Aturan File", dll).

### Langkah 5: Buat Route Page (`src/app/(master)/master/file-rule/page.tsx`)

Buat page file mengikuti pattern `src/app/(master)/master/jenis-dokumen/page.tsx`:

- Export `dynamic = "force-dynamic"`
- Render `FileRuleContent` component

### Langkah 6: Tambahkan Tab di Master Layout

Edit `src/app/(master)/master/layout.tsx`:

- Tambahkan entry baru di array `MASTER_TABS`:
  ```
  { value: "file-rule", label: "Aturan File", path: "/master/file-rule", icon: IconFileSettings }
  ```
- Import icon `IconFileSettings` dari `@tabler/icons-react` (atau `IconFileCheck` jika tidak tersedia)
- Posisi: setelah "Jenis Dokumen" (tab terakhir)

---

## File Change Summary

| Aksi | File |
|------|------|
| **Baru** | `src/types/file-rule.ts` |
| **Baru** | `src/lib/file-rule-api.ts` |
| **Baru** | `src/hooks/file-rule-hooks.tsx` |
| **Baru** | `src/components/file-rule/file-rule-content.tsx` |
| **Baru** | `src/components/file-rule/file-rule-form-dialog.tsx` |
| **Baru** | `src/components/file-rule/file-rule-delete-dialog.tsx` |
| **Baru** | `src/app/(master)/master/file-rule/page.tsx` |
| **Edit** | `src/app/(master)/master/layout.tsx` (tambah tab) |

---

## Verifikasi

Setelah implementasi selesai, lakukan pengecekan berikut:

1. **Build:** Jalankan `bun run build` — pastikan tidak ada error TypeScript/compile
2. **Lint:** Jalankan `bun run lint` — pastikan tidak ada linting error (gunakan `bun run format` jika perlu)
3. **MCP Check:** Gunakan next-devtools MCP untuk verifikasi route `/master/file-rule` terdaftar dan bisa diakses
4. **Manual Test:**
   - Navigasi ke `/master/file-rule` via tab Master Data
   - Test CRUD: tambah, edit, hapus aturan file
   - Test form validation (context wajib, extension wajib, maxSizeMb minimal 1)
   - Test search dan sorting
   - Test pagination
   - Pastikan semua toast message tampil dalam Bahasa Indonesia
