# Refactor: Ekstraksi Hook `usePagination` dari Logika Pagination yang Duplikat

## Context

Proyek ini memiliki **5 content hook** yang masing-masing menduplikasi logika pagination identik (~50 baris kode per hook):

| Hook | File |
|------|------|
| `useMailTypeContent` | `src/hooks/mail-type-hooks.tsx` |
| `useQuickMessageContent` | `src/hooks/quick-message-hooks.tsx` |
| `useDocumentTypeContent` | `src/hooks/document-type-hooks.tsx` |
| `useMailCategoryContent` | `src/hooks/mail-category-hooks.tsx` |
| `usePublicationContent` | `src/hooks/publication-hooks.tsx` |

### Logika yang Duplikat di Setiap Hook

1. **State extraction dari URL** via `useQueryStates()` — 5 field: `page`, `size`, `search`, `sortBy`, `sortDir`
2. **Setter functions** (`setPage`, `setPageSize`, `setSearchValue`, `setSorting`) — semua menggunakan `useCallback` + `setStates`, dan reset `page` ke 0 saat filter/sort/search berubah
3. **Konversi sorting** — `useMemo` yang mengkonversi `sortBy`/`sortDir` string ↔ TanStack `SortingState` array

### Yang BERBEDA per Hook (Tidak Diekstrak)

- Filter parameter tambahan: `mailTypeId` (mail-category), `status` (publication)
- Query hook spesifik (contoh: `useMailTypes(...)`, `usePublications(...)`)
- Definisi kolom tabel (`ColumnDef`)
- State modal/dialog (create, edit, delete, duplicate)
- Mutation hooks

---

## Tujuan

1. Membuat hook reusable `usePagination()` di `src/hooks/use-pagination.ts`
2. Refactor kelima content hook untuk menggunakan `usePagination()`
3. **Zero regression** — behavior dan URL sync harus identis sebelum dan sesudah refactor
4. Return type setiap content hook **tidak berubah** — sehingga file consumer (content components) tidak perlu dimodifikasi

---

## Infrastruktur yang Sudah Ada

Pahami file-file ini sebelum mulai implementasi:

| File | Fungsi |
|------|--------|
| `src/hooks/use-query-state.ts` | `useQueryStates()` untuk sinkronisasi state ↔ URL, `queryParsers` helper |
| `src/hooks/use-debounced-value.ts` | `useDebouncedValue()` — ada tapi tidak digunakan di pagination |
| `src/types/commons.ts` | Tipe `PagedResponse<T>` dan `BasePage` |
| `src/components/ui/data-table.tsx` | Komponen `DataTable` dan `DataTablePagination` |

---

## Langkah Implementasi

> **PENTING:** Gunakan skill/MCP tools selama implementasi:
> - **Context7 MCP** — untuk referensi dokumentasi library (TanStack React Table, Next.js, React)
> - **Next DevTools MCP** — untuk debugging URL params dan verifikasi pagination

### Langkah 1: Pelajari Kode yang Ada

Baca dan pahami file-file berikut untuk mengerti pattern yang digunakan:

- `src/hooks/use-query-state.ts` — cara kerja `useQueryStates()`, `queryParsers`, dan `setStates`
- `src/hooks/mail-type-hooks.tsx` — contoh content hook **sederhana** (tanpa filter tambahan), fokus pada fungsi `useMailTypeContent()` baris 102-154
- `src/hooks/mail-category-hooks.tsx` — contoh content hook **dengan filter tambahan** (`mailTypeId`)
- Gunakan **Context7 MCP** untuk cari dokumentasi `SortingState` dari `@tanstack/react-table`

### Langkah 2: Buat Hook `usePagination` — File Baru

Buat file baru: `src/hooks/use-pagination.ts`

Hook ini harus:
- Menambahkan directive `"use client"` di baris pertama
- Memanggil `useQueryStates()` satu kali
- Mengekstrak kelima field pagination dari `searchParams` menggunakan `queryParsers` (`page`, `size`/pageSize, `search`/searchValue, `sortBy`, `sortDir`)
- Menyediakan setter functions: `setPage`, `setPageSize`, `setSearchValue`, `setSorting`
- Mengkonversi `sortBy`/`sortDir` ke TanStack `SortingState` (dan sebaliknya di `setSorting`)
- Men-expose `searchParams` dan `setStates` dari `useQueryStates()` agar hook dengan filter tambahan bisa mengaksesnya
- Me-re-export `queryParsers` dari `./use-query-state` agar consumer cukup import dari satu tempat
- Mendefinisikan dan export interface `PaginationState` sebagai return type

**Return type hook:**
- `page`, `setPage` — navigasi halaman
- `pageSize`, `setPageSize` — ukuran halaman
- `searchValue`, `setSearchValue` — pencarian
- `sorting`, `setSorting` — sorting TanStack format
- `sortBy`, `sortDir` — sorting string format (untuk diteruskan ke query hook)
- `searchParams`, `setStates` — akses langsung untuk filter tambahan

**Penting:** Ambil konstanta `DEFAULT_SIZE = 20` ke file ini.

### Langkah 3: Refactor Hook Sederhana (Tanpa Filter Tambahan)

Refactor **3 hook** berikut — mereka identis, mulai dari yang paling sederhana:

1. **`useMailTypeContent`** di `src/hooks/mail-type-hooks.tsx`
2. **`useQuickMessageContent`** di `src/hooks/quick-message-hooks.tsx`
3. **`useDocumentTypeContent`** di `src/hooks/document-type-hooks.tsx`

Untuk masing-masing:
- Ganti import `queryParsers, useQueryStates` dari `./use-query-state` dengan import `usePagination` dari `./use-pagination`
- Hapus semua blok state extraction, sorting memo, dan setter functions (~50 baris)
- Ganti dengan satu baris destructuring: `const { page, setPage, pageSize, ... } = usePagination()`
- Hapus konstanta `DEFAULT_SIZE` dari file
- Query call, columns, dialog states, return object — **TIDAK BERUBAH**

**Jalankan `bun run build` setelah refactor setiap file** untuk memastikan tidak ada error.

### Langkah 4: Refactor Hook dengan Filter Tambahan

Refactor **2 hook** yang memiliki filter parameter tambahan:

1. **`useMailCategoryContent`** di `src/hooks/mail-category-hooks.tsx`
   - Import `usePagination` dan `queryParsers` dari `./use-pagination`
   - Destructure termasuk `searchParams` dan `setStates`
   - **Pertahankan** logika spesifik `mailTypeId`:
     - `useMemo` yang membaca `searchParams.get("mailTypeId")` via `queryParsers.optionalString`
     - `useCallback` untuk `setMailTypeId` yang memanggil `setStates({ mailTypeId: value, page: 0 })`

2. **`usePublicationContent`** di `src/hooks/publication-hooks.tsx`
   - Sama seperti di atas, tapi pertahankan logika `status` filter
   - Perhatikan: publication menggunakan `searchValue || undefined` saat memanggil query hook

**Jalankan `bun run build` setelah setiap file.**

### Langkah 5: Cleanup dan Verifikasi Final

- Pastikan `DEFAULT_SIZE` hanya ada di `src/hooks/use-pagination.ts` (hapus dari semua hook lain)
- Pastikan tidak ada import `useQueryStates` atau `queryParsers` dari `./use-query-state` yang tersisa di hook files (kecuali di `use-pagination.ts` sendiri)
- Jalankan verifikasi final (lihat bagian Verifikasi di bawah)

---

## File yang Perlu Dimodifikasi

| Aksi | File |
|------|------|
| **BARU** | `src/hooks/use-pagination.ts` |
| **EDIT** | `src/hooks/mail-type-hooks.tsx` |
| **EDIT** | `src/hooks/quick-message-hooks.tsx` |
| **EDIT** | `src/hooks/document-type-hooks.tsx` |
| **EDIT** | `src/hooks/mail-category-hooks.tsx` |
| **EDIT** | `src/hooks/publication-hooks.tsx` |

**TIDAK ADA perubahan** pada file consumer (content components di `src/components/*/`) karena return type setiap content hook tidak berubah.

---

## Verifikasi & Testing

### 1. Build Check (WAJIB setelah setiap langkah)

```bash
bun run build
```

Pastikan tidak ada error TypeScript. Proyek menggunakan `strict: true`.

### 2. Lint & Format

```bash
bun run lint
bun run format
```

### 3. Verifikasi Fungsional via Browser

Gunakan **Next DevTools MCP** untuk memverifikasi di setiap halaman:

| Halaman | Filter Tambahan |
|---------|----------------|
| `/master/tipe-surat` | — |
| `/master/pesan-singkat` | — |
| `/master/jenis-dokumen` | — |
| `/master/kategori-surat` | `mailTypeId` |
| `/publikasi` | `status` |

**Checklist per halaman:**
- [ ] Navigasi halaman (next, prev, first, last) memperbarui URL param `page`
- [ ] Ubah page size memperbarui URL param `size` dan reset `page` ke 0
- [ ] Search memperbarui URL param `search` dan reset `page` ke 0
- [ ] Klik header kolom sorting memperbarui `sortBy`/`sortDir` dan reset `page` ke 0
- [ ] Filter tambahan (jika ada) tetap berfungsi dan reset `page` ke 0
- [ ] Refresh browser mempertahankan semua URL params

---

## Catatan Penting

### Penggunaan MCP Tools (WAJIB)

1. **Context7 MCP** — Gunakan untuk:
   - Referensi tipe `SortingState` dan `OnChangeFn<SortingState>` dari `@tanstack/react-table`
   - Referensi API hooks dari Next.js 16 (`useSearchParams`, `useRouter`, `usePathname`)
   - Dokumentasi `useMemo` dan `useCallback` dari React 19

2. **Next DevTools MCP** — Gunakan untuk:
   - Debug URL params saat testing
   - Inspect component behavior setelah refactor

### Aturan Implementasi

- **Jangan ubah file consumer** (content components) — return type content hook harus identis
- **Jangan tambah fitur baru** — ini murni refactor, bukan enhancement
- **Jangan sentuh logika API** — inkonsistensi `search` vs `keyword` (publication) sudah di-handle di level API file, bukan di hook
- **Urutan refactor penting** — mulai dari hook sederhana (Langkah 3) sebelum yang kompleks (Langkah 4)
- **Build setelah setiap file** — jalankan `bun run build` untuk deteksi error sedini mungkin
- **Finalisasi** — setelah semua selesai, jalankan `bun run build` dan `bun run lint` sekali lagi untuk memastikan tidak ada error
