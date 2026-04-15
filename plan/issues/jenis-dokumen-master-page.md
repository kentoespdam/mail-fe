# Implementasi Page `/master/jenis-dokumen`

## Context

Perlu ditambahkan halaman master baru **Jenis Dokumen** (`/master/jenis-dokumen`) untuk mengelola data jenis dokumen (document types) yang digunakan pada fitur publikasi. API backend sudah tersedia (lihat `apidocs/master/document-type.json`). Implementasi mengikuti pattern yang sudah ada pada `/master/tipe-surat`.

### API Endpoints (document-type.json)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/document-types` | List paginated (search, status, sortBy, sortDir, page, size) |
| POST | `/api/v1/document-types` | Create |
| GET | `/api/v1/document-types/{id}` | Get by ID |
| PUT | `/api/v1/document-types/{id}` | Update |
| DELETE | `/api/v1/document-types/{id}` | Delete |
| PATCH | `/api/v1/document-types/{id}/status` | Toggle status |
| GET | `/api/v1/document-types/lookup` | Lookup (dropdown) |

### Schema

- **Request:** `{ name: string }` (max 100 karakter)
- **Response:** `{ id, name, status (ACTIVE/INACTIVE/DELETED), publicationCount }`

---

## Referensi Pattern (Tipe Surat)

Ikuti 1:1 pattern dari fitur **Tipe Surat** yang terdiri dari file-file berikut:

| Layer | File Referensi | Fungsi |
|-------|----------------|--------|
| Types | `src/types/mail-type.ts` | Zod schema, DTO, PagedResponse |
| API | `src/lib/mail-type-api.ts` | Fetch functions (CRUD + toggle + lookup) |
| Hooks | `src/hooks/mail-type-hooks.tsx` | TanStack Query hooks + orchestrator hook |
| Content | `src/components/mail-type/mail-type-content.tsx` | Main page component |
| Form Dialog | `src/components/mail-type/mail-type-form-dialog.tsx` | Create/Edit dialog |
| Delete Dialog | `src/components/mail-type/mail-type-delete-dialog.tsx` | Delete confirmation |
| Page | `src/app/(master)/master/tipe-surat/page.tsx` | Next.js route page |
| Layout | `src/app/(master)/master/layout.tsx` | Tab navigation (MASTER_TABS) |

---

## Langkah Implementasi

> **PENTING:** Gunakan skill/MCP tools (context7, next-devtools) untuk referensi API dan dokumentasi library selama implementasi.

### Langkah 1: Buat Types (`src/types/document-type.ts`)

Buat file types baru mengikuti pattern `src/types/mail-type.ts`:

- `DocumentTypeSchema` — Zod v4 schema, field: `name` (string, min 1, max 100). Pesan error dalam Bahasa Indonesia.
- `DocumentTypePayload` — Inferred type dari schema
- `DocumentTypeDto` — Interface: `id`, `name`, `status` (ACTIVE/INACTIVE/DELETED), `publicationCount` (number)
- `PageDocumentType` — Extends `PagedResponse<DocumentTypeDto>` dari `src/types/commons.ts`

### Langkah 2: Buat API Service (`src/lib/document-type-api.ts`)

Buat file API baru mengikuti pattern `src/lib/mail-type-api.ts`:

- Base endpoint: `/api/proxy/v1/document-types`
- Functions: `fetchDocumentTypes`, `fetchDocumentTypesLookup`, `fetchDocumentType`, `createDocumentType`, `updateDocumentType`, `deleteDocumentType`, `toggleDocumentTypeStatus`
- Endpoint toggle status: `PATCH /{id}/status` (perhatikan: endpoint ini `/status`, bukan `/toggle-status` seperti mail-type)
- Pesan error dalam Bahasa Indonesia ("jenis dokumen", bukan "tipe surat")

### Langkah 3: Buat Hooks (`src/hooks/document-type-hooks.tsx`)

Buat hooks mengikuti pattern `src/hooks/mail-type-hooks.tsx`:

- `QUERY_KEY = "document-types"`
- `useDocumentTypes()` — Query hook paginated
- `useCreateDocumentType()` — Mutation + form (zodResolver)
- `useUpdateDocumentType()` — Mutation + form + populate
- `useDeleteDocumentType()` — Mutation
- `useToggleDocumentTypeStatus()` — Mutation
- `useDocumentTypeContent()` — Orchestrator hook (pagination, sorting, search, dialog states, column definitions)

Perbedaan kolom dari mail-type:
- Kolom `categoryCount` diganti `publicationCount` dengan header "Jumlah Publikasi"
- Sisanya sama (index, name, status toggle, actions)

### Langkah 4: Buat Components (`src/components/document-type/`)

Buat 3 file component mengikuti pattern `src/components/mail-type/`:

1. **`document-type-content.tsx`** — Main content, render DataTable + dialogs. Gunakan `useDocumentTypeContent()`.
2. **`document-type-form-dialog.tsx`** — Create + Edit dialog. Field: nama (InputTextControll). Gunakan `useCreateDocumentType()` dan `useUpdateDocumentType()`.
3. **`document-type-delete-dialog.tsx`** — Delete dialog, gunakan `DeleteConfirmDialog` dari `src/components/builder/delete-confirm-dialog.tsx`.

Semua label/title/toast dalam Bahasa Indonesia ("Jenis Dokumen", "Tambah Jenis Dokumen", dll).

### Langkah 5: Buat Route Page (`src/app/(master)/master/jenis-dokumen/page.tsx`)

Buat page file mengikuti pattern `src/app/(master)/master/tipe-surat/page.tsx`:

- Export `dynamic = "force-dynamic"`
- Render `DocumentTypeContent` component

### Langkah 6: Tambahkan Tab di Master Layout

Edit `src/app/(master)/master/layout.tsx`:

- Tambahkan entry baru di array `MASTER_TABS`:
  ```
  { value: "jenis-dokumen", label: "Jenis Dokumen", path: "/master/jenis-dokumen", icon: IconFileDescription }
  ```
- Import icon `IconFileDescription` dari `@tabler/icons-react`
- Posisi: setelah "Pesan Singkat" (tab ke-4)

---

## File Change Summary

| Aksi | File |
|------|------|
| **Baru** | `src/types/document-type.ts` |
| **Baru** | `src/lib/document-type-api.ts` |
| **Baru** | `src/hooks/document-type-hooks.tsx` |
| **Baru** | `src/components/document-type/document-type-content.tsx` |
| **Baru** | `src/components/document-type/document-type-form-dialog.tsx` |
| **Baru** | `src/components/document-type/document-type-delete-dialog.tsx` |
| **Baru** | `src/app/(master)/master/jenis-dokumen/page.tsx` |
| **Edit** | `src/app/(master)/master/layout.tsx` (tambah tab) |

---

## Verifikasi

Setelah implementasi selesai, lakukan pengecekan berikut:

1. **Build:** Jalankan `bun run build` — pastikan tidak ada error TypeScript/compile
2. **Lint:** Jalankan `bun run lint` — pastikan tidak ada linting error (gunakan `bun run format` jika perlu)
3. **MCP Check:** Gunakan next-devtools MCP untuk verifikasi route `/master/jenis-dokumen` terdaftar dan bisa diakses
4. **Manual Test:**
   - Navigasi ke `/master/jenis-dokumen` via tab Master Data
   - Test CRUD: tambah, edit, duplikat, hapus jenis dokumen
   - Test toggle status (switch aktif/nonaktif)
   - Test search dan sorting
   - Test pagination
   - Pastikan semua toast message tampil dalam Bahasa Indonesia
