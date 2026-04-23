# Persuratan — Footer Tertutup oleh FolderTree Sidebar

## 1. Context

Setelah footer global di-mount di `src/app/layout.tsx` (lihat plan `global-footer-copyright.md`), muncul regresi visual **khusus di `/persuratan`**: teks copyright `© Copyright Perumdam Tirta Satria 2026` tertutup oleh panel kiri `MailFolderTree` (shadcn `Sidebar` collapsible="icon").

### Root Cause

`shadcn Sidebar` (desktop) menggunakan kelas internal `fixed inset-y-0 z-10 h-svh` (`src/components/ui/sidebar.tsx:233`). Meskipun di `persuratan-content.tsx:37` sudah ada override `top-20! h-[calc(100svh-80px)]!` untuk menurunkan 80px (tinggi `TopBar`), sidebar tetap **`fixed` terhadap viewport** dan memanjang sampai `bottom: 0` viewport. Footer (flow, tinggi ±48px) di-render setelah `<CustomThemeProvider>{children}</CustomThemeProvider>` di `body`, sehingga posisinya secara DOM ada di bawah — tapi secara visual tertutup oleh overlay sidebar `fixed` tersebut.

Route lain (`/dashboard`, `/publikasi`, `/master/*`) tidak kena karena tidak menggunakan `SidebarProvider` — konten mereka pure flow, sehingga footer tampil normal setelah konten habis.

### Chain layout saat ini

```
body (min-h-full flex flex-col)
├── TooltipProvider
│   └── CustomThemeProvider
│       └── (main)/template.tsx  →  div.min-h-screen.flex-col
│           ├── TopBar (sticky top-0, h-20)
│           └── main.flex-1.overflow-y-auto
│               └── PersuratanContent
│                   └── SidebarProvider h-[calc(100vh-80px)]
│                       ├── Sidebar  [fixed inset-y-0 + top-20! + h-[calc(100svh-80px)]!]  ← menutup footer
│                       └── SidebarInset (ResizablePanelGroup …)
└── Footer  ← flow di akhir body; tertutup overlay Sidebar fixed
```

### ASCII — masalah

```
┌─────────────────────────────────────────┐
│ TopBar (sticky)                         │
├──────┬──────────────────────────────────┤
│ Side │ ResizablePanel (list)            │
│ bar  ├──────────────────────────────────┤
│ fix  │ ResizablePanel (detail)          │
│ ed   │                                  │
│ s-0  │                                  │
│ ▓▓▓▓ │ Footer                           │  ← DOM: di bawah, VISUAL: tertutup ▓
│ ▓▓▓▓ │ (tertutup sidebar fixed)         │
└──────┴──────────────────────────────────┘
```

### ASCII — target

```
┌─────────────────────────────────────────┐
│ TopBar (sticky)                         │
├──────┬──────────────────────────────────┤
│ Side │ ResizablePanel (list)            │
│ bar  ├──────────────────────────────────┤
│ bot- │ ResizablePanel (detail)          │
│ tom- │                                  │
│ 12   │                                  │
├──────┴──────────────────────────────────┤
│ © Copyright Perumdam Tirta Satria 2026  │  ← Footer flow, tidak tertutup
└─────────────────────────────────────────┘
```

Commit relevan: plan `global-footer-copyright.md`, `2cf9c20` (MailListToggle), `e70e4c7` (palet 60-30-10).

---

## 2. Tujuan

- Footer copyright **tampil utuh** di `/persuratan` tanpa tertutup `Sidebar`/`MailFolderTree`.
- Tidak memecah layout 3-panel (`FolderTree` | `ResizablePanel.list` | `ResizablePanel.detail`) yang sudah bekerja.
- Tinggi kerja `SidebarProvider` + `ResizablePanel` tetap **full-height area konten** (viewport − TopBar − Footer), tanpa scroll ganda.
- Tidak menambah library.
- Tidak mengubah behavior footer di route lain (`/login`, `/dashboard`, `/publikasi`, `/master/*`).
- Tidak mengubah public API `Footer`, `TopBar`, `Sidebar`, atau `PersuratanContent`.

---

## 3. File Change Table

| Path | Perubahan |
|---|---|
| `src/components/persuratan/persuratan-content.tsx` | Sesuaikan tinggi `SidebarProvider` agar reserve tinggi footer, dan override ukuran `Sidebar` agar tidak memanjang sampai bottom viewport. Ganti `h-[calc(100vh-80px)]` → `h-[calc(100svh-80px-var(--footer-height))]`, override `Sidebar` → `top-20! h-[calc(100svh-80px-var(--footer-height))]!` (atau pakai `bottom-12!` agar sidebar berhenti di atas footer). |
| `src/components/dashboard/footer.tsx` | Tambahkan `style` inline `--footer-height` (mis. `3rem`) di root `<footer>` agar bisa dibaca via CSS var di descendant — ATAU (pilihan lebih sederhana) tetapkan tinggi tetap footer via className (`h-12`) + CSS variable global di `globals.css`. |
| `src/app/globals.css` | **Opsional** — deklarasi `:root { --footer-height: 3rem; }` agar bisa dipakai lintas komponen tanpa inline style. |

> ASUMSI: tinggi footer pada viewport desktop (`sm:flex-row`) ≈ 48px (`py-3` = 12px × 2 + teks `text-sm` ±24px). Pada mobile (`flex-col`, 2 baris teks), tinggi membesar ke ±72–80px. Kita gunakan **3rem (48px)** sebagai konstanta desktop-first; mobile akan push konten sedikit turun tapi tidak overlap karena `Sidebar` shadcn sudah auto-switch ke `Sheet` via `use-mobile` di breakpoint < md.

---

## 4. Keputusan Arsitektur

| Opsi | Pendekatan | Pro | Con | Kapan cocok |
|---|---|---|---|---|
| **A (pilihan)** | CSS variable `--footer-height` + override `bottom-12!` pada `Sidebar`, kurangi tinggi `SidebarProvider` sebesar footer | Surgical, hanya sentuh file persuratan; footer tetap flow global; mobile otomatis aman (`Sheet`) | Perlu jaga sinkron tinggi footer ↔ variable | Regresi lokal seperti ini |
| B | Pindahkan `<Footer />` ke dalam `(main)/template.tsx` sebagai sibling `main`, hapus dari RootLayout | Footer dibatasi oleh `flex-col` di template; Sidebar fixed tetap bottom viewport tapi footer ikut di-reserve `main` shrink | Harus duplikasi footer ke `(master)/master/template.tsx` dan `/login/page.tsx`; membatalkan keputusan plan sebelumnya (global via RootLayout) | Kalau user setuju footer bukan global |
| C | Ubah `Sidebar` shadcn agar tidak `fixed` (lepas dari overlay mode) | Struktur paling "benar" secara CSS flow | Invasif ke komponen UI kit yang dipakai banyak tempat; risiko regresi `collapsible=icon` + mobile `Sheet` | Kalau Sidebar perlu refactor menyeluruh |
| D | Buat footer `sticky bottom-0 z-20` | 1 baris perubahan | Melanggar plan sebelumnya (non-sticky); footer menutupi konten pada viewport pendek; merusak UX `ResizablePanel` full-height di route lain kalau scroll | Darurat saja |

**Pilih A.** Justifikasi:
- Footer tetap global (keputusan plan `global-footer-copyright.md` tidak dibatalkan).
- Perubahan terlokalisir di `persuratan-content.tsx` + deklarasi CSS var.
- Tidak menyentuh komponen UI kit (`sidebar.tsx`, `resizable.tsx`).
- Mobile (`Sheet`) tidak terpengaruh karena kelas override hanya aktif di desktop breakpoint (`md:` di-handle internal shadcn; class `top-20!` + `bottom-12!` hanya berpengaruh saat sidebar render sebagai `fixed`).

---

## 5. Implementation Steps

### Fase 1 — Preparation

1. Verifikasi tinggi aktual footer di devtools (`bun dev` → buka `/dashboard` → inspect `<footer>` → catat `offsetHeight`). Konfirmasi ±48px pada desktop ≥640px. Jika berbeda, sesuaikan konstanta di Fase 2.
2. Verifikasi kelas internal `Sidebar` di `src/components/ui/sidebar.tsx:233` — pastikan pola `fixed inset-y-0` masih ada (baseline root cause).
3. Verifikasi bahwa `use-mobile` breakpoint (`768px`) membuat `Sidebar` beralih ke `Sheet` di mobile (artinya override `bottom-12!` kita hanya efektif di desktop — OK).

### Fase 2 — Deklarasi CSS variable footer-height

Pilih **salah satu** (rekomendasi: **Opsi 2a**):

- **2a. Global CSS var di `src/app/globals.css`** — tambah di dalam `@theme` / `:root` existing: `--footer-height: 3rem;`. Pakai `@media (max-width: 639px)` atau `@media (max-width: 640px)` untuk override menjadi `5rem` (karena footer stack vertikal di mobile — tapi di mobile Sidebar sudah jadi Sheet, jadi override ini opsional).
- 2b. Inline style di `<footer style={{ "--footer-height": "3rem" } as CSSProperties}>` — tidak butuh file globals, tapi var hanya tersedia di subtree footer (tidak berguna untuk Sidebar di atasnya).

Pilihan **2a** wajib karena Sidebar perlu konsumsi var dan berada di subtree berbeda.

### Fase 3 — Patch `persuratan-content.tsx`

1. Ganti className `SidebarProvider` dari:
   - `h-[calc(100vh-80px)] min-h-0 overflow-hidden bg-background`
   → 
   - `h-[calc(100svh-80px-var(--footer-height,3rem))] min-h-0 overflow-hidden bg-background`
   (pakai `100svh` konsisten dengan kelas Sidebar; fallback 3rem jika var tidak terdefinisi.)
2. Ganti className `Sidebar` dari:
   - `border-r top-20! h-[calc(100svh-80px)]!`
   →
   - `border-r top-20! h-[calc(100svh-80px-var(--footer-height,3rem))]!`
   (alternatif ekuivalen: `border-r top-20! bottom-[var(--footer-height,3rem)]! h-auto!` — pilih yang tidak memicu warning Tailwind JIT. Opsi `h-[calc(...)]!` lebih aman karena arbitrary value valid.)
3. Jangan sentuh `ResizablePanelGroup` / `ResizablePanel` — sudah flex-based dan akan otomatis shrink mengikuti `SidebarProvider`.

### Fase 4 — Patch `globals.css`

1. Buka `src/app/globals.css`, temukan blok `:root` / `@theme` / `@layer base :root`.
2. Tambahkan variable: `--footer-height: 3rem;`
3. **Opsional** (jika footer mobile stack 2 baris mengganggu di `/persuratan` mobile — tidak mungkin karena Sidebar jadi Sheet, skip).
4. Jangan mengubah token palet OKLch yang sudah ada.

### Fase 5 — Validation

1. `bun dev` — buka `/persuratan` di desktop (≥ 1280px):
   - [ ] Sidebar berhenti ~48px di atas footer.
   - [ ] Footer terlihat utuh (teks copyright + badge versi).
   - [ ] `ResizablePanel` list + detail masih full-height area (tidak terkompres).
   - [ ] Drag `ResizableHandle` vertikal tetap smooth (tidak ada jitter CLS).
2. Collapse sidebar via `SidebarRail` (`Ctrl+B`) — Sidebar ciut ke icon mode; footer tetap utuh.
3. Resize browser ke `< 768px` — Sidebar beralih ke `Sheet` (overlay saat dibuka), footer tampil normal; buka Sheet → footer tidak tertutup (karena Sheet pakai backdrop, bukan fixed panel permanen).
4. Buka `/dashboard`, `/publikasi`, `/master/tipe-surat` — konfirmasi footer tidak regress (tetap flow di akhir konten).
5. Dark mode via `ThemeToggle` — border atas footer tetap kontras.
6. DevTools Elements → inspect `<aside>` Sidebar → confirm computed `bottom` ≈ 48px (atau `height` sudah dikurangi footer).

---

## 6. Constraints

- Clean architecture, no tech debt, no dead code.
- Indent **tabs** (Biome).
- Tidak menambah library baru.
- Tidak menyentuh `src/components/ui/sidebar.tsx` (UI kit shadcn, reusable).
- Tidak mengubah footer menjadi `sticky` / `fixed` — harus tetap **flow** (konsisten plan `global-footer-copyright.md`).
- Tidak mengubah public API `PersuratanContent`, `Sidebar`, atau `Footer`.
- Tidak mengubah behavior route selain `/persuratan`.
- Nilai `--footer-height` harus **sinkron** dengan tinggi riil `<footer>` — jika footer di-resize di masa depan, update variable. Tambahkan komentar di `globals.css` dan `footer.tsx` sebagai reminder.
- Gunakan `100svh` (small viewport height), konsisten dengan kelas Sidebar existing, agar aman di mobile browser dengan address bar dinamis.

---

## 7. Tooling Instructions (CRITICAL)

Executor **wajib** memakai MCP tool berikut:

- **`context7-mcp`** / `npx ctx7@latest`:
  - `library "Tailwind CSS" "v4 arbitrary value with css variable calc svh"` → konfirmasi sintaks `h-[calc(100svh-80px-var(--footer-height,3rem))]` valid di Tailwind v4 JIT.
  - `library "shadcn ui" "Sidebar fixed positioning override bottom class variant"` → konfirmasi override `bottom-*!` pada `<Sidebar>` tidak dipatahkan oleh internal merge class.
- **`next-devtools-mcp`**:
  - Jalankan dev server, buka `/persuratan` — capture:
    - Runtime errors + hydration warnings (harus nol).
    - CLS profile saat load awal + saat drag `ResizableHandle` (harus < 0.1).
    - Computed layout `<aside>` sidebar → verifikasi `bottom` / `height` sesuai target.
  - Sweep semua route `(main)/*` + `(master)/master/*` untuk konfirmasi zero regress.

---

## 8. Verification Checklist

- [ ] `bun run build` lolos tanpa warning baru.
- [ ] `bun run lint` bersih (Biome, tabs, no unused imports).
- [ ] `bun run format` applied.
- [ ] `next-devtools-mcp` scan: nol runtime error + nol hydration mismatch di `/persuratan`.
- [ ] Manual test matrix:
  - [ ] `/persuratan` desktop (≥ 1280px) — footer terlihat utuh, Sidebar tidak menutup.
  - [ ] `/persuratan` desktop — Sidebar collapse (`Ctrl+B` / `SidebarRail` click) → footer tetap utuh.
  - [ ] `/persuratan` tablet (~ 1024px) — layout tetap konsisten.
  - [ ] `/persuratan` mobile (< 768px) — Sidebar = `Sheet`; footer tampil di bawah konten scrollable.
  - [ ] `/persuratan` — `ResizablePanelGroup` masih bisa di-drag; panel detail scroll internal berfungsi.
  - [ ] `/persuratan` — toggle `MailListToggle` (hide list) → footer tetap utuh.
  - [ ] `/dashboard`, `/publikasi`, `/master/*`, `/login` — tidak ada regress visual pada footer.
  - [ ] Dark mode — border + teks footer tetap kontras, sidebar tidak overlap.
  - [ ] RBAC roles (SYSTEM/ADMIN/USER) — perilaku identik.
  - [ ] DevTools: computed `bottom` / `height` Sidebar `<aside>` memperhitungkan `--footer-height`.
