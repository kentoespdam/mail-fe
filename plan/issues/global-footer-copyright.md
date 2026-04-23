# Global Footer — Copyright Perumdam Tirta Satria

## 1. Context

Saat ini aplikasi belum punya footer. Prompt awal meminta penambahan footer `© Copyright Perumdam Tirta Satria 2026` di `src/app/(main)/template.tsx`, namun scope diperluas menjadi **global** agar footer konsisten muncul di:

- `/login` (public)
- `(main)/*` — `/dashboard`, `/persuratan`, `/publikasi`
- `(master)/master/*` — `tipe-surat`, `kategori-surat`, `pesan-singkat`, `jenis-dokumen`, `file-rule`
- `error.tsx`, `not-found.tsx`, `global-error.tsx`

Karena `(main)/template.tsx` hanya meng-cover satu route group, penempatan yang benar untuk scope global adalah `src/app/layout.tsx` (RootLayout). `body` sudah `min-h-full flex flex-col`, sehingga footer bisa di-render sebagai anak terakhir `body` dan otomatis mengalir di bawah konten.

### ASCII Mockup (after)

```
┌──────────────────────────────────────────────┐
│ [TopBar / LoginShell / MasterHeader]         │  ← di-render oleh template masing-masing
├──────────────────────────────────────────────┤
│                                              │
│                 <children>                   │  flex-1, scrollable
│                                              │
├──────────────────────────────────────────────┤
│  © Copyright Perumdam Tirta Satria 2026   v0.1.0  │  ← Footer (flow, non-sticky)
└──────────────────────────────────────────────┘
```

Commit terbaru relevan: `2cf9c20` (integrasi `MailListToggle` ke `ResizableHandle`) dan `e70e4c7` (harmonisasi palet 60-30-10) — footer harus **tidak memecah** tinggi penuh panel `/persuratan` (ResizablePanel). Karena pilihan behavior adalah **flow di akhir konten** (non-sticky), `main` di `(main)/template.tsx` yang sudah `flex-1 overflow-y-auto` akan tetap dominan; footer muncul setelah panel selesai scroll — bukan mengompres tingginya.

> ASUMSI: Versi aplikasi diambil dari `process.env.npm_package_version` (atau import static dari `package.json`). Tidak menambah dependency. Saat ini `package.json.version = "0.1.0"`.

## 2. Tujuan

- Menampilkan footer copyright di **seluruh halaman** aplikasi (public + protected).
- Tahun copyright **dinamis** (`new Date().getFullYear()`) agar tidak usang di 2027+.
- Menampilkan **versi aplikasi** di sisi kanan (mis. `v0.1.0`).
- Tidak memecah layout full-height `/persuratan` (ResizablePanel) — footer **flow** di akhir konten, bukan sticky.
- Konsisten dengan palet 60-30-10 (dominan `bg-background`, teks `text-muted-foreground`, border `border-border`).
- Aksesibel: `<footer role="contentinfo">`, kontras teks memadai, responsif mobile.

## 3. File Change Table

| Path | Perubahan |
|---|---|
| `src/components/dashboard/footer.tsx` | **NEW** — Server Component (`memo` opsional karena SC). Render `<footer>` dengan teks copyright + versi. Props kosong. |
| `src/app/layout.tsx` | Tambah `<Footer />` sebagai anak terakhir `<body>` setelah `<Toaster />` (atau sebelum, asal di bawah `<CustomThemeProvider>{children}` tapi masih dalam `body` flex-col). Import `Footer` via `@/components/dashboard/footer`. |
| `src/app/(main)/template.tsx` | **Revert** — pastikan tidak ada footer di level ini (tidak perlu diubah dari state sekarang, hanya catatan: jangan tambah footer lokal karena sudah global). |

> Catatan: Tidak perlu menyentuh `(master)/master/template.tsx` atau `/login/page.tsx` — footer di-inject via RootLayout.

## 4. Keputusan Arsitektur

| Opsi | Lokasi Mount | Pro | Con | Kapan cocok |
|---|---|---|---|---|
| **A (pilihan)** | `src/app/layout.tsx` (RootLayout) | 1 titik mount, cover semua route, no duplikasi | Perlu perhatikan `body` flex-col + `min-h-full` agar footer nempel ke bawah tanpa overlap | Footer global, konten copyright universal |
| B | Per template (`(main)/template.tsx` + `(master)/master/template.tsx` + `/login/page.tsx`) | Kontrol granular per group | Duplikasi, mudah drift, 3 titik maintenance | Footer berbeda per area |
| C | Di dalam `CustomThemeProvider` | Tersedia via provider tree | Semantik keliru (provider untuk theming, bukan layout shell) | — |

**Pilih A.** Justifikasi: prompt minta "global semua halaman"; RootLayout adalah titik paling tinggi di App Router. Struktur `body` saat ini (`min-h-full flex flex-col`) sudah siap menerima footer sebagai child terakhir tanpa mengubah tinggi `children`.

## 5. Implementation Steps

### Fase 1 — Preparation

1. Verifikasi struktur `src/app/layout.tsx` — pastikan `body` menggunakan `min-h-full flex flex-col` (sudah). Tidak perlu ubah className.
2. Verifikasi `(main)/template.tsx` — `main` pakai `flex-1 overflow-y-auto`; footer flow tidak akan mengompres area scroll karena `min-h-screen` berada di wrapper `div`, bukan di `body` (root flex). Konfirmasi secara manual di browser bahwa halaman `/persuratan` masih full-height dan panel tidak pecah.
3. Cek `package.json` — ambil `version` sebagai sumber versi. Jangan install library baru.

### Fase 2 — Scaffolding komponen Footer

1. Buat file `src/components/dashboard/footer.tsx`.
2. Deklarasikan sebagai **Server Component** (tidak perlu `"use client"`). Tidak ada hook/state.
3. Export default komponen `Footer` tanpa props.
4. Struktur markup:
   - Root: `<footer role="contentinfo" className="…">`
   - Container flex: kiri = teks copyright, kanan = versi aplikasi.
   - Tahun dihitung sekali di render: `new Date().getFullYear()`.
   - Versi: import dari `package.json` dengan `assert { type: "json" }` ATAU pakai `process.env.npm_package_version` ATAU hardcode konstanta `APP_VERSION` di `src/lib/` (pilih yang tidak trigger bundler warning — di Next 16 preferensi: hardcode konstanta di `lib/app-meta.ts` untuk menghindari import JSON di runtime).

> ASUMSI: Executor akan membuat `src/lib/app-meta.ts` export `APP_VERSION = "0.1.0"` (sinkron manual dengan `package.json`) jika import JSON dihindari. Alternatif: `process.env.npm_package_version` yang di-expose via `next.config.ts`. Pilih salah satu dan dokumentasikan di komentar file.

### Fase 3 — Styling (Tailwind v4, palet 60-30-10)

1. Footer container:
   - `border-t border-border` (30% zone).
   - `bg-background` (60% zone) — konsisten dengan `body`.
   - `text-muted-foreground` untuk teks (30% zone).
   - Padding: `px-4 py-3` (mobile), `md:px-6`.
   - Tipografi: `text-xs` atau `text-sm`, `tracking-tight`.
   - Layout: `flex flex-col items-center justify-between gap-2 sm:flex-row` — stack di mobile, inline di desktop.
2. Text copyright kiri: `© Copyright Perumdam Tirta Satria {year}`. Gunakan `&copy;` atau karakter `©` langsung (UTF-8 OK di Next).
3. Badge versi kanan: `<span className="font-mono text-[10px] uppercase tracking-wider">v{APP_VERSION}</span>`.
4. Pastikan **tidak sticky**: jangan pakai `sticky bottom-0` atau `fixed`. Biarkan flow mengikuti `body flex-col`.

### Fase 4 — Integrasi ke RootLayout

1. Edit `src/app/layout.tsx`.
2. Import `Footer` dari `@/components/dashboard/footer`.
3. Tempatkan `<Footer />` **di dalam `<body>`**, **setelah `<CustomThemeProvider>{children}</CustomThemeProvider>`**, dan **sebelum atau sesudah `<Toaster />`** (urutan tidak mempengaruhi; rekomendasi: setelah Provider, sebelum Toaster agar toast tetap overlay di atas).
4. Jangan bungkus Footer dengan `TooltipProvider` duplicated — sudah di-provide root.

### Fase 5 — Validation

1. Jalankan `bun dev`.
2. Uji visual per route di matrix (lihat checklist §8).
3. Uji full-height: `/persuratan` — pastikan `ResizablePanel` dan `MailList` tidak terkompres; scroll body keseluruhan harus menampilkan footer di akhir.
4. Uji dark mode via `ThemeToggle` — pastikan `bg-background` + `text-muted-foreground` tetap kontras.
5. Uji responsive: < 640px (stack), ≥ 640px (inline).

## 6. Constraints

- Clean architecture, no tech debt, no dead code.
- Indent **tabs** (Biome).
- Teks UI **Bahasa Indonesia / format copyright baku**: `© Copyright Perumdam Tirta Satria {year}`.
- Path alias `@/*`.
- **Tidak mengubah** public API `TopBar`, `Template`, atau layout group lain.
- **Tidak menambah library baru.**
- Footer harus **non-sticky** (flow di akhir konten) — tidak boleh pakai `fixed` / `sticky bottom-0`.
- Footer harus **tidak** memecah layout `/persuratan` (verifikasi manual full-height panel).
- Tahun dinamis (`new Date().getFullYear()`), **bukan** hardcode `"2026"`.
- Server Component — **tidak boleh** `"use client"` jika tidak butuh interaktivitas.

## 7. Tooling Instructions (CRITICAL)

Executor **wajib** memakai MCP tool berikut saat eksekusi:

- **`context7-mcp`** / `npx ctx7@latest`:
  - `library "Next.js" "App Router RootLayout footer best practice v16"` → dapatkan rekomendasi Next 16 untuk global shell element.
  - `library "Tailwind CSS" "v4 flex-col sticky footer alternative no-sticky flow"` → konfirmasi pola `body flex-col` + `main flex-1`.
- **`next-devtools-mcp`**:
  - Jalankan dev server, buka setiap route (`/login`, `/dashboard`, `/persuratan`, `/publikasi`, semua `/master/*`), capture runtime errors & hydration warnings.
  - Profile `/persuratan` untuk memastikan penambahan footer tidak menambah CLS atau memicu re-layout ResizablePanel.

## 8. Verification Checklist

- [ ] `bun run build` lolos tanpa warning baru
- [ ] `bun run lint` bersih (Biome, tabs, no unused imports)
- [ ] `bun run format` applied
- [ ] `next-devtools-mcp` scan: nol runtime error & hydration mismatch di semua route
- [ ] Manual test matrix:
  - [ ] `/login` — footer tampil di bawah card login, non-overlap
  - [ ] `/dashboard` — footer di bawah konten stub
  - [ ] `/persuratan` — footer muncul setelah `ResizablePanel` full-height; panel list/detail tidak terkompres
  - [ ] `/publikasi` — footer muncul setelah tabel + pagination
  - [ ] `/master/tipe-surat`, `/master/kategori-surat`, `/master/pesan-singkat`, `/master/jenis-dokumen`, `/master/file-rule` — footer muncul di bawah konten tabel master
  - [ ] `error.tsx` / `not-found.tsx` — footer tetap tampil
  - [ ] Dark mode — kontras OK, border visible
  - [ ] Mobile (< 640px) — layout footer stack vertikal, teks tidak overflow
  - [ ] Tahun auto-update (ubah clock OS sementara ke 2027 → footer tampil `2027`)
  - [ ] RBAC roles (SYSTEM/ADMIN/USER) — footer muncul sama untuk semua (tidak ter-gate)
