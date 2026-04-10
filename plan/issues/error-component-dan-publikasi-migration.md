# Error Components & Migrasi State Publikasi ke URL Query Params

## Latar Belakang

Aplikasi belum memiliki error boundary/error component sama sekali. Jika terjadi error di runtime, user melihat halaman blank tanpa feedback. Selain itu, fitur **Publikasi** masih menggunakan `useState` untuk pagination/filter/search, sehingga state hilang saat refresh page — tidak konsisten dengan fitur master lainnya yang sudah menggunakan URL query params.

## Tujuan

1. Menambahkan error boundary dan not-found page agar user mendapat feedback yang jelas saat terjadi error
2. Migrasi state pagination/filter/search di fitur Publikasi dari `useState` ke URL query params
3. Sesuaikan types & API layer publikasi dengan API spec (`apidocs/core/publication.json`)

---

## Bagian 1: Error Components ✅ DONE

### Instruksi Umum
- Gunakan `context7` MCP untuk referensi API `error.tsx`, `global-error.tsx`, dan `not-found.tsx` dari Next.js
- Semua teks dalam **Bahasa Indonesia**
- Styling menggunakan Tailwind + komponen shadcn (Card, Button) yang sudah ada
- Komponen tetap sederhana, tidak perlu over-engineer

### Langkah-langkah

1. **`src/app/global-error.tsx`** ✅
2. **`src/app/error.tsx`** ✅
3. **`src/app/(main)/error.tsx`** ✅
4. **`src/app/(master)/master/error.tsx`** ✅
5. **`src/app/not-found.tsx`** ✅

---

## Bagian 2: Migrasi Publikasi ke URL Query Params ✅ DONE

Hook `usePublicationContent()` sudah dibuat, `publication-content.tsx` sudah direfactor.

---

## Bagian 3: Sesuaikan Types & API Publikasi dengan API Spec

### Temuan: API Spec vs Kode Saat Ini

| Aspek | API Spec (`publication.json`) | Kode saat ini (`publication.ts`) |
|-------|-------------------------------|----------------------------------|
| **`id` type** | `string` | `number` ❌ |
| **`documentTypeId` (request)** | `string` | `number` ❌ |
| **`documentType` (response)** | nested `{ id: string, name: string }` | flat `documentTypeId` + `documentTypeName` ❌ |
| **Pagination params** | `page` + `size` | `offset` + `limit` ❌ |
| **Response shape** | `PagedModel { content: T[], page: PageMetadata }` | raw array `PublicationDto[]` ❌ |
| **`filePath`** | tidak ada di response | ada di DTO ❌ |
| **`totalCount`** | tidak ada (ada di `page.totalElements`) | ada di DTO ❌ |
| **`fileSize`** | `int32` | `number` ✅ |
| **`createdByUserId`** | `int32` | `number` ✅ |

### Step 1: Update `src/types/publication.ts`

- Tambah `DocumentTypeLookup` interface: `{ id: string; name: string }`
- Tambah `PageMetadata` interface: `{ size: number; number: number; totalElements: number; totalPages: number }`
- Tambah `PublicationPage` interface: `{ content: PublicationDto[]; page: PageMetadata }`
- `PublicationDto.id`: `number` → `string`
- `PublicationDto.documentTypeId` + `documentTypeName` → `documentType: DocumentTypeLookup | null`
- Hapus `filePath` (tidak ada di API spec)
- Hapus `totalCount` (ada di PageMetadata)
- `CreatePublicationSchema.documentTypeId`: `z.number().min(1)` → `z.string().min(1, "Tipe dokumen wajib dipilih")`
- Hapus `PublicationFilter` interface (tidak dipakai lagi)

### Step 2: Update `src/lib/publication-api.ts`

- `fetchPublications()` signature → `(page, size, search?, status?, sortBy?, sortDir?)`
  - Params: `page`, `size`, `keyword`, `status`, `sortBy`, `sortDir`
  - Return type: `PublicationPage` (bukan `PublicationDto[]`)
- `fetchPublication(id: string)` — id `number` → `string`
- `createPublication` / `updatePublication` — id param `number` → `string`
- `deletePublication(id: string)` — id `number` → `string`
- Hapus import `PublicationFilter`

### Step 3: Update `src/hooks/publication-hooks.tsx`

- `usePublications()`: langsung pass `page/size/search/status/sortBy/sortDir` ke `fetchPublications`
- `usePublicationContent()`:
  - `totalCount` → `data?.page?.totalElements ?? 0`
  - `hasNext` → `page < (data?.page?.totalPages ?? 1) - 1`
  - `publications` → `data?.content ?? []`
  - Tambah `sortBy`, `sortDir`, `setSorting` (konsisten dengan mail-category)
- `useUpdatePublication`: `id: number` → `id: string`
- `useDeletePublication`: `id: number` → `id: string`
- Default values form: `documentTypeId: 0` → `documentTypeId: ""`
- `populate()`: `pub.documentTypeId` → `pub.documentType?.id ?? ""`

### Step 4: Update Components

**`src/components/publication/publication-content.tsx`**
- Gunakan `data.content` dan pagination dari `data.page`

**`src/components/publication/publication-table.tsx`**
- `pub.documentTypeName` → `pub.documentType?.name ?? "—"`

**`src/components/publication/publication-form-fields.tsx`**
- `InputNumberControll` untuk `documentTypeId` → `InputTextControll` (karena string)

**`src/components/publication/edit-publication-form.tsx`**
- Line 20: `useRef<number | null>` → `useRef<string | null>`

**`src/components/publication/publication-delete-dialog.tsx`**
- `pub.id` sudah otomatis string setelah type berubah

---

## Verifikasi

1. `bun run build` — pastikan tidak ada type error
2. MCP `next-devtools` (`get_errors`) — tidak ada runtime error
3. `grep` semua file yang menggunakan `PublicationDto` — tidak ada referensi ke field lama (`documentTypeId`, `documentTypeName`, `filePath`, `totalCount`)
4. Test manual:
   - Buka `/publikasi`, ubah filter/search/pagination, refresh — state harus bertahan di URL
   - Akses URL yang tidak ada — harus tampil halaman 404
   - Error boundary bisa diverifikasi dengan throw error di komponen
