# Optimasi MailList dengan DataTable & Compact UI

## Context

Halaman `/persuratan` sudah memiliki komponen `MailList` dan `MailToolbar` yang berfungsi (Fase 1 & enhance selesai). Sekarang perlu:

1. **Migrasi `MailList` ke `DataTable`** — manfaatkan komponen `DataTable` yang sudah ada (`src/components/ui/data-table.tsx`) agar mendapat fitur sortable & filterable secara built-in dari TanStack Table
2. **Compact UI** — buat tampilan daftar email lebih padat dan efisien (kurangi padding, font size, spacing)
3. **Compact `MailToolbar`** — kurangi jarak antar tombol agar toolbar tidak memakan banyak ruang vertikal
4. **Optimasi performa** — kurangi re-render yang tidak perlu pada `MailList` dan `MailToolbar` dengan memoization (`useMemo`, `useCallback`, `memo`)

### File yang Sudah Ada

| File | Deskripsi |
|------|-----------|
| `src/components/persuratan/mail-list.tsx` | Komponen tabel daftar surat (manual Table) |
| `src/components/persuratan/mail-toolbar.tsx` | Toolbar aksi & filter |
| `src/components/persuratan/persuratan-content.tsx` | Container utama 3-panel |
| `src/components/ui/data-table.tsx` | Komponen DataTable reusable (TanStack Table) |
| `src/hooks/use-pagination.ts` | Hook pagination + sorting + search (URL query state) |
| `src/types/mail.ts` | Type definitions |
| `src/lib/dummy/mail-dummy.ts` | Dummy data |
| `apidocs/core/mail.json` | API spec — endpoint `GET /api/v1/mails/search` |

### API Search Endpoint (Referensi)

`GET /api/v1/mails/search` mendukung parameter:
- `page`, `size` — pagination
- `sortBy`, `sortDir` — sorting (field name + asc/desc)
- `keyword` — pencarian teks
- `mailTypeId`, `mailCategoryId` — filter dropdown
- `startDate`, `endDate` — filter tanggal
- `hasAttachment`, `senderId` — filter tambahan

Response: `PagedResponseMailSummaryResponse` dengan `content[]`, `page`, `size`, `totalElements`, `totalPages`

---

## Langkah Implementasi

> **WAJIB:** Gunakan skill/MCP tools selama implementasi:
> - **context7** — untuk referensi docs library (TanStack Table, shadcn DataTable, Tailwind CSS). Contoh: `npx ctx7@latest library "tanstack table" "column definitions sorting"` lalu `npx ctx7@latest docs <id> "column definitions and sorting"`
> - **next-devtools** — untuk verifikasi route, komponen, dan error setelah implementasi. Gunakan `get_errors`, `get_routes`, `get_page_metadata`

### Langkah 1: Definisikan Column Definitions untuk DataTable

**File:** `src/components/persuratan/mail-list.tsx`

**Tujuan:** Buat array `ColumnDef<MailSummaryDto>[]` yang mendefinisikan kolom tabel dengan sorting support.

- Buat konstanta `columns` di luar komponen (agar stabil, tidak re-create setiap render)
- Kolom yang perlu didefinisikan:

  | Kolom | Field | Sortable | Catatan |
  |-------|-------|----------|---------|
  | Tgl Pengiriman | `mailDate` | Ya | Format `dd/MM/yyyy HH:mm`, tampilkan dot indicator jika unread |
  | Pengirim | `audit.createdByName` | Ya | Akses nested field via `accessorFn` |
  | Perihal | `subject` | Ya | Truncate dengan max-width, bold jika unread |
  | Tipe | `type.name` | Tidak | Akses nested field via `accessorFn` |
  | Jenis | `category.name` | Tidak | Tampilkan sebagai Badge |
  | Sirkulasi | `circulationName` | Tidak | — |
  | Batas Respon | `maxResponseDate` | Ya | Format tanggal, warna destructive, tampilkan "-" jika null |

- Gunakan `enableSorting: true/false` per kolom
- Untuk kolom yang perlu styling khusus (unread bold, badge, dll), gunakan `cell` renderer
- Pastikan referensi context7 untuk syntax `ColumnDef` yang benar

### Langkah 2: Migrasi MailList ke DataTable Component

**File:** `src/components/persuratan/mail-list.tsx`

**Tujuan:** Ganti implementasi manual `<Table>` menjadi komponen `DataTable` dari `@/components/ui/data-table.tsx`.

- Import `DataTable` dan `DataTablePagination` dari `@/components/ui/data-table`
- Ganti props interface `MailListProps`:
  - Tambah: `sorting`, `onSortingChange` (dari TanStack Table `SortingState`)
  - Hapus props yang sudah di-handle oleh DataTable secara internal
  - Tetap pertahankan: `mails`, `isLoading`, `selectedMailId`, `onSelectMail`, `page`, `pageSize`, `totalElements`, `onPageChange`, `onPageSizeChange`
- Render `DataTable` dengan props:
  - `columns={columns}`
  - `data={mails}`
  - `isLoading={isLoading}`
  - `sorting={sorting}`
  - `onSortingChange={onSortingChange}`
  - `emptyMessage="Tidak ada surat."`
- Row click untuk select mail — implementasikan melalui custom cell renderer atau row onClick handler
- Pertahankan `DataTablePagination` terpisah di bawah DataTable
- Pastikan styling row selected dan unread tetap ada (lewat custom row styling)

### Langkah 3: Compact UI untuk MailList

**File:** `src/components/persuratan/mail-list.tsx`

**Tujuan:** Buat tampilan daftar email lebih padat dan efisien.

- Kurangi padding cell: gunakan `py-1.5` atau `py-2` (bukan default `py-4`)
- Kurangi font size: gunakan `text-xs` untuk cell content
- Kurangi lebar kolom yang tidak perlu lebar (Tipe, Jenis, Sirkulasi)
- Badge: gunakan ukuran lebih kecil (`text-[9px]` atau `text-[10px]`)
- Pastikan row height lebih compact tapi masih readable
- Hilangkan spacing/gap yang berlebihan di wrapper
- Terapkan perubahan ini di column definitions (`cell` renderer) dan di wrapper div

### Langkah 4: Compact MailToolbar

**File:** `src/components/persuratan/mail-toolbar.tsx`

**Tujuan:** Kurangi jarak antar tombol dan buat toolbar lebih compact.

- Kurangi gap antar tombol: ubah `gap-2` menjadi `gap-1` atau `gap-1.5` pada button groups
- Kurangi padding toolbar container: ubah `p-4` menjadi `p-2` atau `px-3 py-2`
- Kurangi gap vertikal antar baris toolbar: ubah `gap-4` menjadi `gap-2`
- Gunakan `size="xs"` pada tombol jika tersedia, atau `size="sm"` dengan custom `h-7`
- Kurangi margin pada icon dalam tombol: `mr-0.5` atau hilangkan `mr-1`
- Pertimbangkan gabungkan baris filter dan search ke satu baris jika muat
- Pastikan label tetap readable meskipun spacing dikurangi

### Langkah 5: Optimasi State & Memoization

**File:** `src/components/persuratan/persuratan-content.tsx`, `mail-list.tsx`, `mail-toolbar.tsx`

**Tujuan:** Kurangi re-render yang tidak perlu.

- **`persuratan-content.tsx`:**
  - Wrap callback handlers (`handleSelectMail`, `handleSelectFolder`, `setKeyword`, dll) dengan `useCallback`
  - Wrap computed values (`filteredMails`, `selectedMailSummary`, `selectedMailDetail`) dengan `useMemo`
  - Pastikan props yang dikirim ke child components stabil (referensi tidak berubah setiap render)

- **`mail-list.tsx`:**
  - Pastikan komponen sudah di-wrap `memo` (sudah ada, verifikasi masih berlaku setelah refactor)
  - Pastikan `columns` didefinisikan di luar komponen (stabil, tidak re-create)
  - Jika ada formatter function di dalam cell renderer, pastikan stabil (didefinisikan di luar atau di-memoize)

- **`mail-toolbar.tsx`:**
  - Wrap komponen dengan `memo`
  - Wrap internal handlers (`handleAction`, `handleDelete`) dengan `useCallback`
  - Pastikan props yang diterima sudah stabil dari parent

### Langkah 6: Integrasikan Sorting ke Parent Component

**File:** `src/components/persuratan/persuratan-content.tsx`

**Tujuan:** Hubungkan sorting state dari DataTable ke parent agar siap digunakan saat integrasi API.

- Tambah state `sorting` (`SortingState` dari TanStack Table) di `persuratan-content.tsx`
- Buat handler `onSortingChange` dengan `useCallback`
- Pass `sorting` dan `onSortingChange` ke `MailList`
- Untuk dummy data fase ini: sorting bisa hanya update state tanpa efek pada data (nanti di Fase 2 akan dikirim ke API sebagai `sortBy` & `sortDir`)
- Atau jika ingin, terapkan client-side sorting pada `filteredMails` menggunakan sorting state

---

## File Change Summary

| Aksi | File | Perubahan |
|------|------|-----------|
| **Edit** | `src/components/persuratan/mail-list.tsx` | Migrasi ke DataTable, column defs, compact UI |
| **Edit** | `src/components/persuratan/mail-toolbar.tsx` | Compact spacing, memo wrap, useCallback handlers |
| **Edit** | `src/components/persuratan/persuratan-content.tsx` | Sorting state, useCallback/useMemo optimasi |

---

## Instruksi untuk Implementor

1. **WAJIB** gunakan skill/MCP tools selama implementasi:
   - **context7** — untuk referensi docs TanStack Table (ColumnDef, sorting, accessorFn), shadcn DataTable, dan Tailwind CSS spacing utilities
   - **next-devtools** — untuk verifikasi route, error check, dan page metadata setelah implementasi
2. Ikuti konvensi project: Biome format (tabs), semua teks UI dalam **Bahasa Indonesia**, import alias `@/*`
3. Gunakan komponen UI yang sudah ada di `@/components/ui/` — jangan buat komponen baru kecuali benar-benar diperlukan
4. Referensi pattern dari fitur lain yang sudah menggunakan DataTable (cek `src/components/` untuk contoh `ColumnDef` dan `DataTable` usage)
5. Jangan ubah logic filtering/pagination dasar — fokus pada migrasi DataTable, compact UI, dan optimasi
6. Pastikan semua styling unread (bold) dan selected row (highlight) tetap berfungsi setelah migrasi
7. Perhatikan: `DataTable` dari `data-table.tsx` sudah handle skeleton loading, empty state, dan sort header icons — manfaatkan fitur ini

---

## Finalisasi & Verifikasi

Setelah implementasi selesai, **WAJIB** lakukan:

1. **MCP next-devtools:**
   - `get_errors` — pastikan tidak ada runtime/build error
   - `get_routes` — verifikasi route `/persuratan` masih terdaftar
   - `get_page_metadata` — verifikasi komponen ter-render dengan benar
2. **Build:** `bun run build` — pastikan **tidak ada error** TypeScript/compile
3. **Lint:** `bun run lint` — fix dengan `bun run format` jika perlu
4. **Visual Check:**
   - Tabel menggunakan DataTable (bukan manual Table)
   - Header kolom yang sortable menampilkan sort indicator (icon asc/desc/selector)
   - Klik header kolom sortable → sort berubah (asc → desc → none)
   - Tampilan lebih compact: row height lebih kecil, spacing lebih rapat
   - Toolbar lebih compact: gap antar tombol lebih kecil
   - Row unread tetap **bold**, row selected tetap di-highlight
   - Pagination tetap berfungsi normal
   - Loading skeleton tampil saat `isLoading=true`
   - Empty state tampil saat data kosong
5. **Jika ada error:** fix semua error sebelum menganggap tugas selesai
