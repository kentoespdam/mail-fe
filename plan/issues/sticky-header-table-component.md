# Komponen Tabel dengan Sticky Header (shadcn/ui + Base UI)

## Context

Proyek membutuhkan komponen **Tabel reusable** yang memiliki **sticky header** — header tabel tetap terlihat di bagian atas area scroll saat user menggulir dataset yang panjang. Komponen ini akan menjadi fondasi untuk halaman-halaman data intensif di aplikasi (listing, report, audit log, dll).

Tech stack yang harus digunakan:

| Layer | Library | Tujuan |
|-------|---------|--------|
| Framework | **Next.js 16 (App Router) + React 19** | Sesuai proyek |
| Aesthetic & Design Tokens | **shadcn/ui v4** | Konsistensi visual dengan komponen lain (OKLch tokens, Tailwind v4) |
| Accessibility & Primitives | **Base UI** | Headless primitive untuk aksesibilitas (ARIA roles, keyboard nav, focus management) |
| Data (opsional) | TanStack Table v8 (sudah ada di `src/components/ui/data-table.tsx`) | Integrasi sorting/pagination jika dibutuhkan di fase lanjutan |

### Fitur Utama

1. **Sticky Header** — `<thead>` tetap di atas saat `<tbody>` di-scroll secara vertikal
2. **Horizontal Scroll Responsif** — pada viewport kecil, tabel scroll horizontal **tanpa merusak** sticky header (header harus ikut scroll horizontal bersama body, tetapi tetap sticky secara vertikal)
3. **Aksesibilitas** — role semantik (`table`, `rowgroup`, `row`, `columnheader`, `cell`), keyboard navigation, dan screen reader yang benar
4. **Design Token Konsisten** — menggunakan CSS variable OKLch dari shadcn v4 (`--border`, `--muted`, `--foreground`, dll)

### Yang Sudah Ada (Referensi)

Pahami file-file ini sebelum mulai:

| File | Peran |
|------|-------|
| `src/components/ui/data-table.tsx` | Komponen table existing berbasis TanStack Table (bukan sticky header) |
| `src/components/ui/table.tsx` | Primitif table shadcn dasar (jika ada), atau gunakan sebagai template style |
| `src/app/globals.css` | Token OKLch & CSS variable Tailwind v4 |

---

## Tujuan

1. Membuat komponen `<StickyTable>` (atau nama serupa) di `src/components/ui/sticky-table.tsx`
2. Komponen harus **composable** ala shadcn — expose sub-komponen (`StickyTable.Root`, `.Header`, `.Body`, `.Row`, `.Head`, `.Cell`) atau named exports terpisah
3. Sticky header **tidak boleh "pecah"** saat tabel di-scroll horizontal di mobile
4. Zero regression terhadap `DataTable` existing — ini komponen **baru**, bukan pengganti

---

## Langkah Implementasi

> **PENTING — Gunakan MCP Tools di setiap fase:**
> - **Context7 MCP** (`ctx7`) — cari **best practice terbaru** untuk:
>   - Kombinasi shadcn/ui + Base UI (pola composition, prop forwarding, `Slot`)
>   - Base UI table/grid primitives dan ARIA pattern
>   - Sticky positioning di Tailwind v4 (CSS `position: sticky` + container-query)
> - **Next DevTools MCP (`next-devtools-mcp`)** — gunakan selama development untuk:
>   - Identifikasi bug runtime (hydration, layout shift)
>   - Profil performance (paint, scroll jank, reflow saat sticky aktif)

### Fase 1 — Preparation (Riset & Desain)

1. Jalankan **Context7 MCP** untuk fetch dokumentasi terbaru:
   - Query: `"shadcn/ui table component latest pattern"`
   - Query: `"Base UI table accessibility primitive composition"`
   - Query: `"Tailwind v4 position sticky inside overflow container"`
2. Tentukan struktur DOM akhir. Keputusan arsitektur yang harus dibuat:
   - **Single-scroll vs dual-scroll container** — rekomendasi: satu container dengan `overflow: auto`, header menggunakan `position: sticky; top: 0` di dalam `<thead>` (bukan container terpisah)
   - **Semantic `<table>` vs `role="grid"` div-based** — pilih sesuai pedoman Base UI
3. Dokumentasikan keputusan arsitektur singkat di komentar atas file komponen

### Fase 2 — Scaffolding

1. Buat file `src/components/ui/sticky-table.tsx` dengan `"use client"` directive
2. Definisikan API komponen (sub-components atau named exports) mengikuti pola shadcn existing di `src/components/ui/`
3. Tambahkan TypeScript types:
   - Props untuk `Root` (wrapper + container scroll)
   - Props untuk `Header`, `Body`, `Row`, `Head`, `Cell`
   - Prop opsional `maxHeight` atau `scrollClassName` untuk mengatur tinggi area scroll
4. Pastikan semua sub-component meneruskan `ref` dan `className` (pola `React.forwardRef` + `cn()` helper)

### Fase 3 — Logic Implementation

1. Implementasikan **sticky header**:
   - `<thead>` memiliki `position: sticky; top: 0; z-index: tinggi`
   - Background **wajib solid** (gunakan `bg-background` atau token shadcn) — sticky dengan background transparan akan menampilkan konten di bawahnya
   - Tambahkan border-bottom atau shadow halus sebagai pemisah visual saat body di-scroll
2. Implementasikan **horizontal scroll yang kompatibel**:
   - Container scroll (`overflow: auto`) membungkus `<table>` dengan `min-width` agar kolom tidak tertekan
   - Sticky header **harus berada di dalam container scroll yang sama** dengan body — jangan pisahkan ke container berbeda (akan menyebabkan desync saat scroll horizontal)
3. Aksesibilitas:
   - Gunakan tag `<table>` native + role yang benar, **atau** gunakan primitif Base UI jika tersedia
   - Tambahkan `scope="col"` pada `<th>`
   - Dukung keyboard navigation standar (tab antar cell interaktif)
4. (Opsional di fase ini) dukung prop `stickyFirstColumn` untuk frozen first column — **hanya jika ada waktu**; jangan blok PR

### Fase 4 — Styling

1. Gunakan **design tokens shadcn v4** saja:
   - `bg-background`, `bg-muted`, `text-foreground`, `text-muted-foreground`
   - `border-border`, padding dan radius konsisten dengan komponen lain
2. Variants via `cva` (class-variance-authority) jika perlu (misal: `size: "sm" | "default"`)
3. Dark mode harus bekerja otomatis via token OKLch
4. Pastikan **tidak ada CSS custom** di luar `className` — semua via Tailwind utility

### Fase 5 — Validation

1. Buat halaman demo sementara (misal di `src/app/(main)/dashboard/_demo-sticky-table/page.tsx` atau di route dashboard yang ada) dengan **minimal 50 baris dummy data** untuk memverifikasi scroll
2. Test manual checklist:
   - [ ] Scroll vertikal body — header tetap di atas
   - [ ] Scroll horizontal di viewport kecil (< 768px) — header ikut scroll horizontal, **tetap sticky vertikal**
   - [ ] Resize window — tidak ada layout shift atau flicker header
   - [ ] Dark mode — kontras header vs body tetap jelas
   - [ ] Keyboard tab — fokus berpindah dengan benar
3. Gunakan **Next DevTools MCP** untuk:
   - Cek tidak ada hydration error di console
   - Profil performance saat scroll cepat (target: 60fps, tidak ada jank)
   - Verifikasi tidak ada warning React/Next
4. Hapus halaman demo setelah verifikasi (atau pertahankan di folder `_dev/` jika tim ingin pakai sebagai contoh)

---

## File yang Perlu Dimodifikasi / Dibuat

| Aksi | File |
|------|------|
| **BARU** | `src/components/ui/sticky-table.tsx` |
| **BARU (sementara)** | Halaman demo untuk verifikasi (hapus atau pindahkan sebelum merge) |

**TIDAK BOLEH DIUBAH:**
- `src/components/ui/data-table.tsx` — komponen existing tetap utuh
- Halaman consumer existing — komponen ini additive

---

## Constraint Penting (Clean Architecture)

1. **Single Responsibility** — komponen ini **hanya** menangani layout + sticky + scroll. Tidak boleh handle sorting, pagination, selection, filtering. Biarkan consumer yang compose logika data.
2. **Tidak duplikasi** — jika `src/components/ui/table.tsx` sudah ada dengan primitif styling, **extend/compose** daripada duplikasi.
3. **Tidak introduce dependency baru** tanpa persetujuan — gunakan yang sudah ada di `package.json` (shadcn, base-ui, Tailwind v4, cva).
4. **Bahasa Indonesia** untuk UI text dan error message (sesuai konvensi proyek), **Bahasa Inggris** untuk nama komponen/prop/variable.
5. **Tabs (bukan spaces)** untuk indentation (sesuai Biome config proyek).
6. **Zero technical debt** — jangan tinggalkan `TODO`, `any` type, atau commented-out code di PR final.

---

## Instruksi Tooling (WAJIB)

### Context7 (Web Search / `ctx7` CLI)

Sebelum menulis kode, **wajib** jalankan minimal 2 query:

```bash
npx ctx7@latest library "shadcn/ui" "sticky header table composition pattern"
npx ctx7@latest library "Base UI" "table or grid headless primitive accessibility"
```

Ambil snippet terbaru dan sesuaikan dengan versi yang ada di `package.json`. **Jangan mengandalkan memori training** — API shadcn dan Base UI berubah cepat.

### Next DevTools MCP

Selama development:
- Aktifkan MCP ini di editor
- Gunakan untuk identifikasi **bug runtime** (hydration mismatch, missing keys, warning)
- Gunakan untuk **performance profiling** saat scroll — pastikan tidak ada re-render berlebihan pada header sticky

---

## Verifikasi & Finalisasi

### 1. Build (WAJIB lulus tanpa error)

```bash
bun run build
```

TypeScript `strict: true` — pastikan tidak ada implicit `any` atau type error.

### 2. Lint & Format

```bash
bun run lint
bun run format
```

### 3. MCP Final Check

- Jalankan **Next DevTools MCP** scan di halaman demo — **zero errors, zero warnings**
- Jika ada warning dari shadcn/Base UI composition, resolve sebelum selesai

### 4. Checklist Final

- [ ] `bun run build` — sukses, zero error
- [ ] `bun run lint` — sukses
- [ ] Sticky header bekerja di desktop (scroll vertikal)
- [ ] Sticky header bekerja di mobile (scroll horizontal tidak merusak sticky vertikal)
- [ ] Dark mode OK
- [ ] Aksesibilitas: screen reader membaca header sebagai `columnheader`, keyboard nav jalan
- [ ] Next DevTools MCP — zero runtime error/warning
- [ ] Tidak ada `TODO` / `any` / dead code
- [ ] Halaman demo dihapus atau dipindahkan ke `_dev/`
- [ ] Dokumentasi singkat (JSDoc) di atas setiap named export

---

## Catatan untuk Executor

- Fokus pada **proses dan arsitektur**, bukan line-by-line code. Issue ini sengaja tidak menyediakan source code low-level — gunakan Context7 dan pola shadcn existing untuk menyusun implementasi sendiri.
- Jika menemukan ambiguitas desain (misal: harus composable API atau single-component API), **tanya dulu** sebelum implementasi — jangan asumsi.
- Prioritaskan **accessibility dan correctness** di atas feature richness. Komponen dasar yang solid > komponen kaya fitur yang buggy.
