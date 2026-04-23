# Ekstraksi Custom Hooks dari Halaman `/persuratan`

## Context

Halaman `/persuratan` saat ini memiliki semua state management dan business logic terpusat di satu komponen `persuratan-content.tsx`. Seiring bertambahnya fitur (Fase 2: integrasi API, Fase 3: compose/disposition), file ini akan membengkak dan sulit di-maintain.

### Masalah Saat Ini

- `persuratan-content.tsx` mengelola 6+ state (`selectedFolderId`, `selectedMailId`, `keyword`, `page`, `pageSize`, `sorting`) + semua handler + filtering logic + rendering layout — semuanya dalam 1 file
- Logic filtering, selection, dan pagination tercampur dengan rendering
- Tidak ada separation of concerns — sulit di-test dan di-extend
- Saat Fase 2 (API integration), file ini akan semakin kompleks dengan TanStack Query hooks, mutation handlers, dll

### Target

Pisahkan logic ke custom hooks terpisah, sehingga `persuratan-content.tsx` hanya fokus pada **layout dan rendering**. Hook files di-split per domain agar tidak terlalu panjang.

### File yang Terlibat

| File | Status | Deskripsi |
|------|--------|-----------|
| `src/components/persuratan/persuratan-content.tsx` | **Edit** | Hapus logic, ganti dengan custom hooks |
| `src/hooks/persuratan/use-mail-navigation.ts` | **Baru** | Hook untuk folder selection & mail selection |
| `src/hooks/persuratan/use-mail-list-state.ts` | **Baru** | Hook untuk search, pagination, sorting, filtering |
| `src/hooks/persuratan/use-mail-detail-state.ts` | **Baru** | Hook untuk mail detail data (dummy → nanti API) |

### Referensi Pattern

Lihat hook pattern yang sudah ada di project:
- `src/hooks/mail-type-hooks.tsx` — contoh domain hook (query + mutation + columns + form)
- `src/hooks/use-pagination.ts` — contoh reusable hook yang sudah dipakai 6 fitur
- `src/hooks/use-query-state.ts` — URL query state management

---

## Langkah Implementasi

> **WAJIB:** Gunakan skill/MCP tools selama implementasi:
> - **context7** — untuk referensi docs library (React hooks best practices, TanStack Table). Contoh:
>   ```bash
>   npx ctx7@latest library "react" "custom hooks best practices"
>   npx ctx7@latest docs <id> "custom hooks patterns"
>   ```
> - **next-devtools** — untuk verifikasi route, error check, dan page metadata:
>   - `get_errors` — cek error setelah setiap perubahan
>   - `get_routes` — pastikan route `/persuratan` masih terdaftar
>   - `get_page_metadata` — verifikasi komponen ter-render dengan benar

### Langkah 1: Buat Hook `useMailNavigation`

**File baru:** `src/hooks/persuratan/use-mail-navigation.ts`

**Tanggung jawab:**
- State `selectedFolderId` (default: `"inbox"`)
- State `selectedMailId` (default: `null`)
- Handler `selectFolder(folderId)` — set folder, reset selectedMailId ke null
- Handler `selectMail(mailId)` — set selected mail

**Return type:** Object berisi state values + handler functions.

**Catatan:**
- Saat `selectFolder` dipanggil, harus reset `selectedMailId` ke `null` (behavior existing)
- Semua handler harus di-wrap `useCallback` agar stabil untuk child components yang di-`memo`
- Gunakan `"use client"` di awal file (ini client-side state)

### Langkah 2: Buat Hook `useMailListState`

**File baru:** `src/hooks/persuratan/use-mail-list-state.ts`

**Tanggung jawab:**
- State `keyword` (search text)
- State `page`, `pageSize` (pagination)
- State `sorting` (TanStack `SortingState`)
- Handler `handleSearch(keyword)` — set keyword, reset page ke 0
- Handler `handlePageChange(page)` — set page
- Handler `handlePageSizeChange(size)` — set size, reset page ke 0
- Handler `handleSortingChange` — set sorting (type `OnChangeFn<SortingState>`)
- Computed `filteredMails` — filter dummy mails berdasarkan `selectedFolderId` + `keyword`

**Parameter:** `selectedFolderId: string` (dari `useMailNavigation`)

**Return type:** Object berisi state values + handlers + `filteredMails`.

**Catatan:**
- Import `DUMMY_MAILS` dari `@/lib/dummy/mail-dummy` (nanti Fase 2 diganti TanStack Query)
- `filteredMails` harus di-wrap `useMemo` dengan dependency `[selectedFolderId, keyword]`
- Saat `selectFolder` berubah di parent, `page` harus di-reset — tambahkan `resetPagination()` yang bisa dipanggil dari luar, atau terima `selectedFolderId` sebagai param dan gunakan `useEffect` untuk reset saat berubah
- Pilihan desain: **lebih baik pakai approach explicit reset** — expose `resetPagination()` dan panggil dari `useMailNavigation.selectFolder`. Hindari `useEffect` untuk side effect seperti ini.

**Pendekatan yang disarankan:**
```
useMailListState(selectedFolderId) → return { ..., resetPagination }
```
Di dalam hook, gunakan `useEffect` yang watch `selectedFolderId` untuk reset page ke 0 saat folder berubah. Ini lebih sederhana dibanding cross-hook coordination.

### Langkah 3: Buat Hook `useMailDetailState`

**File baru:** `src/hooks/persuratan/use-mail-detail-state.ts`

**Tanggung jawab:**
- Computed `selectedMailSummary` — cari mail dari dummy data berdasarkan `selectedMailId`
- Computed `selectedMailDetail` — cari detail dari dummy data berdasarkan `selectedMailId`

**Parameter:** `selectedMailId: string | null` (dari `useMailNavigation`)

**Return type:** `{ selectedMailSummary, selectedMailDetail }`

**Catatan:**
- Kedua value harus di-wrap `useMemo`
- Import `DUMMY_MAILS` dan `DUMMY_MAIL_DETAIL` dari `@/lib/dummy/mail-dummy`
- Hook ini sengaja kecil — nanti Fase 2 akan berisi `useQuery` untuk fetch detail dari API
- Alasan dipisah dari `useMailListState`: concern berbeda (list vs detail), dan nanti detail punya lifecycle sendiri (loading, error, refetch)

### Langkah 4: Refactor `persuratan-content.tsx`

**File:** `src/components/persuratan/persuratan-content.tsx`

**Tujuan:** Hapus semua state & logic, ganti dengan custom hooks.

**Yang harus dilakukan:**
1. Hapus semua `useState`, `useMemo`, `useCallback` yang sudah dipindah ke hooks
2. Import dan gunakan 3 hooks baru:
   ```
   const navigation = useMailNavigation()
   const mailList = useMailListState(navigation.selectedFolderId)
   const mailDetail = useMailDetailState(navigation.selectedMailId)
   ```
3. Komponen hanya berisi **layout JSX** — pass hook values sebagai props ke child components
4. Pastikan semua props yang di-pass ke child components sama persis seperti sebelumnya (jangan ubah interface child components)
5. Import `DUMMY_FOLDERS` tetap di sini (untuk MailFolderTree) — atau pindahkan ke `useMailNavigation` jika ingin lebih bersih

**Sebelum refactor:** Baca ulang `persuratan-content.tsx` dan pastikan semua state & handler sudah ter-cover di hooks baru.

**Validasi:** Setelah refactor, `persuratan-content.tsx` seharusnya:
- Tidak punya `useState` sama sekali
- Tidak punya `useMemo` (kecuali jika ada derived value yang pure layout)
- Hanya punya 3 hook calls + JSX return

### Langkah 5: Verifikasi Behavior Tidak Berubah

**Tujuan:** Pastikan refactor tidak mengubah behavior apapun.

1. **Build check:** Jalankan `bun run build` — harus **0 error**
2. **Lint check:** Jalankan `bun run lint` — fix dengan `bun run format` jika perlu
3. **MCP check:**
   - `get_errors` — pastikan tidak ada runtime/build error
   - `get_routes` — verifikasi route `/persuratan` masih terdaftar
   - `get_page_metadata` — verifikasi komponen ter-render
4. **Manual / visual check:**
   - Klik folder di sidebar → mail list berubah sesuai folder, selected mail ter-reset
   - Klik mail di list → detail panel menampilkan detail mail
   - Search keyword → mail list ter-filter, page reset ke 0
   - Pagination (next/prev/change size) → berfungsi normal
   - Sorting header klik → sorting state berubah
   - Layout 3-panel resizable masih berfungsi normal (drag handle)

---

## File Change Summary

| Aksi | File | Deskripsi |
|------|------|-----------|
| **Baru** | `src/hooks/persuratan/use-mail-navigation.ts` | Folder & mail selection state + handlers |
| **Baru** | `src/hooks/persuratan/use-mail-list-state.ts` | Search, pagination, sorting, filtered mails |
| **Baru** | `src/hooks/persuratan/use-mail-detail-state.ts` | Mail detail data (summary + detail) |
| **Edit** | `src/components/persuratan/persuratan-content.tsx` | Hapus logic, ganti dengan 3 hook calls |

---

## Konvensi yang Harus Diikuti

1. **Biome format** — gunakan tabs, bukan spaces. Jalankan `bun run format` setelah selesai
2. **Import alias** — gunakan `@/*` untuk path `./src/*`
3. **"use client"** — semua hook file yang menggunakan React hooks harus punya `"use client"` di baris pertama (karena ini Next.js App Router)
4. **Bahasa Indonesia** — semua teks UI, toast, error message dalam Bahasa Indonesia
5. **TypeScript strict** — semua function & return type harus typed, jangan pakai `any`
6. **Naming convention** — hook files: `use-<nama>.ts`, hook functions: `use<Nama>`
7. **Jangan ubah child components** — `MailList`, `MailToolbar`, `MailDetail`, `MailFolderTree` tidak perlu diubah. Hanya ubah bagaimana `persuratan-content.tsx` memanggil mereka

---

## Finalisasi & Verifikasi

Setelah implementasi selesai, **WAJIB** lakukan semua langkah berikut:

1. **MCP next-devtools:**
   - `get_errors` — pastikan tidak ada runtime/build error
   - `get_routes` — verifikasi route `/persuratan` masih terdaftar  
   - `get_page_metadata` — verifikasi komponen ter-render dengan benar
2. **Build:** `bun run build` — pastikan **tidak ada error** TypeScript/compile
3. **Lint:** `bun run format` lalu `bun run lint` — harus clean
4. **Jika ada error:** fix semua error sebelum menganggap tugas selesai. Jangan submit dengan error.
