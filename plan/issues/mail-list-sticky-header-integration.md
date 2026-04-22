# Integrasi Sticky Header Table ke MailList (Persuratan)

## Context

Komponen primitif `StickyTable` sudah selesai dibuat di `src/components/ui/sticky-table.tsx` (commit `c500fab`) — menyediakan sub-komponen composable (`StickyTableRoot`, `StickyTableHeader`, `StickyTableBody`, `StickyTableRow`, `StickyTableHead`, `StickyTableCell`, dst) dengan pola shadcn v4 + token OKLch Tailwind v4, single-scroll container, dan `position: sticky` di `<thead>`.

Saat ini halaman **Persuratan** (`src/components/persuratan/mail-list.tsx`) masih memakai `DataTable` generik dari `src/components/ui/data-table.tsx`. Kolom yang ditampilkan: Tgl Pengiriman, Pengirim, Perihal, Tipe, Jenis, Sirkulasi, Batas Respon.

Issue ini menindak-lanjuti pekerjaan sticky-header dengan **mengintegrasikannya ke MailList** supaya header kolom tetap terlihat saat user menggulir daftar surat yang panjang di panel atas `ResizablePanel` (tinggi panel terbatas, daftar surat bisa ratusan baris).

### Kondisi Sekarang

```
┌─ MailList (panel atas ResizablePanel, h ~ 45% viewport) ──┐
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Tgl Pengiriman | Pengirim | Perihal | Tipe | ...       │ │  ← hilang saat scroll!
│ ├────────────────────────────────────────────────────────┤ │
│ │ row 1                                                   │ │
│ │ row 2                                                   │ │
│ │ row 3 ...  (body overflow-auto)                         │ │
│ └────────────────────────────────────────────────────────┘ │
│ Pagination                                                  │
└────────────────────────────────────────────────────────────┘
```

### Target

```
┌─ MailList ────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Tgl Pengiriman | Pengirim | Perihal | Tipe | ...       │ │  ← sticky, selalu terlihat
│ ├────────────────────────────────────────────────────────┤ │
│ │ row 1                                                   │ │
│ │ row 2                                                   │ │
│ │ ... body scroll vertikal                                │ │
│ └────────────────────────────────────────────────────────┘ │
│ Pagination                                                  │
└────────────────────────────────────────────────────────────┘
```

---

## Tujuan

1. Header kolom MailList **sticky secara vertikal** selama row body di-scroll, tanpa kehilangan feature existing (sorting, row selection highlight, unread indicator, pagination).
2. Scroll horizontal pada viewport kecil tetap berfungsi dan tidak memecah sticky header.
3. Tidak ada regresi pada API `MailList` (props signature **tidak berubah**) — konsumer (`persuratan-content.tsx`) tidak perlu diubah.
4. Clean architecture: bila diperlukan, buat komponen perantara `StickyDataTable` di `src/components/ui/` yang menjembatani TanStack Table + primitif `StickyTable` — sehingga reusable untuk halaman lain.
5. Tidak merusak `DataTable` existing (masih dipakai halaman master).

---

## Keputusan Arsitektur (Harus Dibuat di Fase Preparation)

Executor **wajib memilih salah satu** sebelum coding, dan dokumentasikan alasannya di komentar file:

| Opsi | Deskripsi | Kapan Cocok |
|------|-----------|-------------|
| **A. Komponen baru `StickyDataTable`** | Buat `src/components/ui/sticky-data-table.tsx` yang memakai TanStack Table + primitif `StickyTable`. `MailList` memakai komponen baru ini. | Jika halaman lain (master, publikasi) juga butuh sticky header di masa depan. **Preferred jika pola reusable**. |
| **B. Inline di MailList** | `MailList` langsung memakai primitif `StickyTable` + `useReactTable` lokal — tanpa abstraksi baru. | Jika hanya MailList yang butuh sticky, dan halaman lain tidak akan mengadopsi. |

> Rekomendasi: **Opsi A** — konsisten dengan `DataTable` existing dan lebih reusable. Tapi putuskan berdasarkan riset Context7 + kebutuhan proyek.

---

## Langkah Implementasi

> **PENTING — Gunakan MCP Tools di setiap fase:**
> - **Context7** (`npx ctx7@latest` atau skill `context7-mcp`) — riset pola terbaru
> - **next-devtools-mcp** — bug runtime + profil scroll performance

### Fase 1 — Preparation (Riset)

1. Jalankan Context7 untuk memastikan pola terbaru:
   - `npx ctx7@latest library "TanStack Table" "integrate custom table primitives sticky header"`
   - `npx ctx7@latest library "shadcn/ui" "table composition with custom primitives"`
   - `npx ctx7@latest library "Base UI" "scroll area accessibility sticky"`
2. Baca ulang file referensi berikut untuk memahami kontrak yang ada:
   - `src/components/ui/sticky-table.tsx` — primitif sticky (sudah ada)
   - `src/components/ui/data-table.tsx` — DataTable existing (jangan diubah)
   - `src/components/persuratan/mail-list.tsx` — konsumer sekarang
   - `src/components/persuratan/persuratan-content.tsx` — cara MailList di-mount di ResizablePanel
3. Putuskan **Opsi A atau B** di atas. Tulis keputusan sebagai komentar JSDoc di top-of-file komponen baru / yang dimodifikasi.
4. Identifikasi behavior yang harus dipreservasi dari `DataTable`:
   - `isLoading` → skeleton rows
   - `emptyMessage` → empty state
   - `onRowClick(row)` → select mail
   - `getRowClassName(row)` → conditional row class (selected, unread, hover)
   - `sorting` + `onSortingChange` → TanStack Table controlled sorting
   - Ikon sort di header (asc/desc/none)

### Fase 2 — Scaffolding

**Jika Opsi A (`StickyDataTable`):**

1. Buat `src/components/ui/sticky-data-table.tsx` dengan directive `"use client"`.
2. Definisikan props interface identik dengan `DataTable` existing supaya migrasi minim:
   - `columns`, `data`, `isLoading`, `sorting`, `onSortingChange`, `emptyMessage`, `onRowClick`, `getRowClassName`
3. Export named: `StickyDataTable`. Re-pakai `DataTablePagination` dari `data-table.tsx` (pagination tidak sticky, sudah di luar area scroll).
4. Siapkan slot untuk skeleton & empty row yang konsisten dengan `DataTable`.

**Jika Opsi B (inline):**

1. Refactor `mail-list.tsx` untuk memakai `useReactTable` + primitif `StickyTable` langsung — tetap export `MailList` dengan props signature identik.

### Fase 3 — Logic Implementation

1. **Wiring TanStack Table**:
   - `useReactTable({ data, columns, getCoreRowModel, getSortedRowModel, state: { sorting }, onSortingChange, manualPagination: true })`
   - Render `table.getHeaderGroups()` → `<StickyTableHeader>` + `<StickyTableHead>`
   - Render `table.getRowModel().rows` → `<StickyTableRow>` + `<StickyTableCell>`
2. **Sticky header wiring**:
   - Bungkus tabel di `<StickyTableRoot>` — **ini container scroll** (`overflow-auto`).
   - Pastikan `<StickyTableHeader>` memakai `position: sticky; top: 0; z-index: 10` (sudah built-in di primitif).
   - **Background header wajib solid** (sudah built-in: `bg-background`).
2. **Sort indicator**:
   - Di `<StickyTableHead>`, render ikon sort (`lucide-react` `ArrowUp` / `ArrowDown` / `ArrowUpDown`) berdasarkan `column.getIsSorted()`.
   - Header cell jadi `<button>` bila `column.getCanSort()` → accessible keyboard.
3. **Row click & className**:
   - Teruskan `onRowClick(row)` ke `<StickyTableRow onClick={...}>`.
   - Merge `getRowClassName(row)` ke `className` row.
4. **Loading / Empty state**:
   - Saat `isLoading`: render N baris skeleton (pakai `Skeleton` shadcn) di dalam `<StickyTableBody>` — header tetap terlihat.
   - Saat `data.length === 0 && !isLoading`: single row dengan `colSpan={columns.length}` menampilkan `emptyMessage`.
5. **Height management**:
   - `StickyTableRoot` harus punya tinggi terbatas agar sticky aktif. Di `MailList`, container parent (`flex-1 overflow-hidden`) sudah memberi constraint — cukup set `StickyTableRoot` dengan `h-full`.
   - **JANGAN** memakai `maxHeight` inline di `MailList` — biarkan flexbox parent yang menentukan tinggi.

### Fase 4 — Integrasi ke MailList

1. Ganti import `DataTable` → `StickyDataTable` (atau refactor jika Opsi B).
2. Hapus wrapper `<div className="flex-1 overflow-auto bg-card border shadow-sm">` **jika** `StickyTableRoot` sudah handle overflow + border — hindari double border/scroll.
3. Pastikan kolom MailList tetap:
   - Tgl Pengiriman (sortable, dengan unread dot indicator)
   - Pengirim (sortable)
   - Perihal (sortable, truncate + title)
   - Tipe (non-sortable)
   - Jenis (non-sortable, Badge)
   - Sirkulasi (non-sortable)
   - Batas Respon (sortable)
4. Row tetap menerapkan:
   - Background `bg-primary/5` saat `selectedMailId === row.original.id`
   - `text-muted-foreground` untuk mail read (`readStatus !== 0`)
   - `font-bold` subject untuk unread
5. Props `MailList` **tidak berubah** → `persuratan-content.tsx` tidak perlu di-touch.

### Fase 5 — Styling

1. Pakai token shadcn v4 **saja** — `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `border-border`.
2. Header shadow/border-bottom konsisten dengan yang sudah ada di `StickyTable` primitif (jangan override).
3. Row density tetap compact (`text-[11px]`, `h-8`) seperti versi existing.
4. Dark mode — verifikasi kontras header vs body (sticky background harus menutupi body scroll di bawahnya).
5. Tidak boleh menambah CSS file baru. Semua via Tailwind utility + `cn()`.

### Fase 6 — Validation

1. Manual test checklist (pakai data dummy di `src/lib/dummy/mail-dummy.ts` — tambahkan row dummy sementara ke ≥ 50 jika perlu untuk verifikasi scroll, **jangan commit data dummy bertambah**):
   - [ ] Scroll body vertikal → header sticky, tidak hilang
   - [ ] Scroll horizontal di layout mobile → header ikut scroll horizontal, tetap sticky vertikal
   - [ ] Klik header sortable → sort toggle + ikon sort berubah
   - [ ] Klik row → mail detail terbuka, highlight row aktif
   - [ ] Row unread (dot + bold subject) tampil benar
   - [ ] Loading skeleton tampil saat `isLoading=true`, header tetap terlihat
   - [ ] Empty state tampil saat `data=[]`
   - [ ] Resize panel `ResizablePanel` — tidak ada layout shift / flicker
   - [ ] Dark mode — kontras jelas
   - [ ] Keyboard: Tab ke header sortable, Enter/Space memicu sort
2. **next-devtools-mcp** scan di `/persuratan`:
   - Zero hydration warning
   - Zero React key warning
   - Profil scroll (scroll cepat di list) — target 60fps, tidak ada re-render header tiap row
3. Pastikan `MailList.displayName` masih `"MailList"` (ada `memo()`).

---

## File yang Berubah

| Aksi | File | Catatan |
|------|------|---------|
| **BARU** (Opsi A) | `src/components/ui/sticky-data-table.tsx` | Jembatan TanStack Table + StickyTable primitif |
| **UBAH** | `src/components/persuratan/mail-list.tsx` | Ganti `DataTable` → `StickyDataTable` (Opsi A) atau refactor ke primitif (Opsi B). Props signature tidak berubah. |

**TIDAK BOLEH DIUBAH:**
- `src/components/ui/sticky-table.tsx` — primitif sudah final
- `src/components/ui/data-table.tsx` — dipakai halaman master lain
- `src/components/persuratan/persuratan-content.tsx` — consumer MailList
- Halaman master (`/master/*`) — tidak terdampak

---

## Constraint Penting (Clean Architecture)

1. **Single Responsibility** — `StickyDataTable` (jika dibuat) hanya menggabungkan TanStack Table + primitif sticky. Tidak boleh handle business logic (mail-specific behavior).
2. **No duplication** — jangan copy-paste isi `DataTable` lalu ubah sedikit. Bila banyak overlap, pikirkan shared hook (`useDataTableLogic`) atau biarkan dua komponen hidup berdampingan dengan perbedaan yang jelas (sticky vs non-sticky).
3. **Props signature `MailList` tetap** — consumer (`persuratan-content.tsx`) tidak perlu diubah. Kompatibilitas = wajib.
4. **Bahasa Indonesia** untuk UI text (empty message, tooltip), **Bahasa Inggris** untuk nama komponen/prop/var.
5. **Tabs** untuk indentation (Biome).
6. **Zero tech debt** — tidak ada `TODO`, `any`, `@ts-ignore`, atau dead code.
7. **Tidak menambah dependency baru** — cukup TanStack Table + primitif yang ada.

---

## Instruksi Tooling (WAJIB)

### Context7 — Riset Sebelum Coding

Wajib minimal 2 query sebelum mulai implementasi:

```bash
npx ctx7@latest library "TanStack Table" "headless table with custom renderer sticky header"
npx ctx7@latest library "shadcn/ui" "data table composition with sticky thead pattern"
```

Bila ragu pada pola accessibility (header sortable sebagai `<button>` di dalam `<th>`):

```bash
npx ctx7@latest library "Base UI" "column header sortable button accessibility"
```

Ambil snippet terbaru. **Jangan mengandalkan memori training** — TanStack Table v8 API stable tapi pola composition dengan primitif custom jarang terdokumentasi.

### next-devtools-mcp — Selama Development

- Aktifkan saat `bun dev` berjalan.
- Cek konsol React error/warning setiap save.
- Profil performance scroll list panjang — pastikan header tidak ter-re-render tiap scroll.
- Cek bundle impact komponen baru (harus minimal — reuse primitif).

---

## Verifikasi & Finalisasi

### 1. Build (WAJIB lulus)

```bash
bun run build
```

TypeScript `strict: true` — zero implicit `any`, zero type error.

### 2. Lint & Format

```bash
bun run lint
bun run format
```

### 3. MCP Final Check

- `next-devtools-mcp` di `/persuratan` — **zero errors, zero warnings**.
- Jika ada warning composition shadcn/Base UI → resolve sebelum selesai.

### 4. Final Checklist

- [ ] `bun run build` — sukses, zero error
- [ ] `bun run lint` — sukses
- [ ] Sticky header MailList bekerja saat scroll vertikal list panjang
- [ ] Sticky header tidak pecah saat scroll horizontal viewport kecil
- [ ] Sorting masih berfungsi (ikon + state)
- [ ] Row click tetap memicu mail detail
- [ ] Unread indicator (dot + bold) tetap tampil
- [ ] Row highlight saat mail terpilih tetap tampil
- [ ] Loading skeleton + empty state tampil, header tetap sticky
- [ ] Dark mode OK
- [ ] Props `MailList` tidak berubah → `persuratan-content.tsx` tidak ter-touch
- [ ] `next-devtools-mcp` — zero runtime warning
- [ ] Tidak ada `TODO` / `any` / dead code / commented-out code
- [ ] JSDoc singkat di top-of-file komponen baru

### 5. Update Memory

Setelah merge, update `/home/dev/.claude/projects/-mnt-DATA-html-mail-fe/memory/`:
- `features/mail-viewer.md` — catat `MailList` sudah pakai sticky header
- `layers/ui-design.md` — tambahkan `StickyDataTable` bila Opsi A dipilih

---

## Catatan untuk Executor

- Fokus pada **proses dan arsitektur**, bukan line-by-line code. Issue ini sengaja tidak menyediakan source code low-level — gunakan Context7 untuk snippet terbaru dan pola shadcn existing (`data-table.tsx`) sebagai referensi composition.
- Bila menemukan ambiguitas (misal: `StickyDataTable` harus duplikasi logika skeleton `DataTable` atau extract shared?) → **tanya dulu** sebelum implementasi.
- Prioritaskan **correctness + zero regresi** di atas elegansi abstraksi. Bila Opsi A lebih kompleks dari yang diduga, fallback ke Opsi B dan dokumentasikan alasan switch.
- Semua UI text (empty message, tooltip) dalam **Bahasa Indonesia**.
