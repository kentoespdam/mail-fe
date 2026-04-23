# Harmonisasi Warna & Penyempurnaan UI/UX Template Utama (Persuratan & Publikasi)

## Context

Template `src/app/(main)/template.tsx` adalah wrapper utama untuk seluruh modul di dalam route group `(main)` — khususnya **Persuratan** (korespondensi) dan **Publikasi**. Modul-modul ini merupakan area kerja dengan traffic tinggi dan durasi penggunaan yang panjang, sehingga kualitas visual dan kenyamanan mata pengguna menjadi krusial.

Saat ini komposisi warna antara **Topbar** (navigasi), **Content Area** (workspace), tombol, dan komponen interaktif belum sepenuhnya harmonis. Hierarki visual dan separasi antara area navigasi dan area kerja masih bisa dipertajam. Tujuan issue ini adalah mengelevasi kualitas visual seluruh modul di bawah template tersebut ke standar *enterprise dashboard* yang profesional dan aksesibel.

### Area Scope

| Area | File / Komponen |
|------|-----------------|
| Template wrapper | `src/app/(main)/template.tsx` |
| Design tokens global | `src/app/globals.css` (OKLch variables) |
| Topbar | komponen topbar yang di-render di dalam template |
| Sidebar & folder tree | komponen sidebar persuratan/publikasi (via `(main)` layout) |
| Content modul | halaman `/persuratan`, `/publikasi` (anak dari template ini) |
| Tombol & komponen interaktif | komponen shadcn/ui lintas modul |

> **Catatan penting:** Template ini menjadi induk banyak halaman. Setiap perubahan token/warna harus diuji di **semua sub-route** (`/persuratan`, `/publikasi`, dan halaman anak lainnya).

---

## Tujuan

1. **Harmonisasi warna** — menciptakan komposisi warna yang seimbang antara Topbar, Content Area, tombol, dan komponen interaktif, dengan separasi visual yang jelas antara area navigasi dan workspace.
2. **Hierarki visual** — mempertajam penggunaan whitespace, kontras, dan elevasi agar modul Persuratan terasa profesional dan intuitif untuk penggunaan berdurasi panjang.
3. **Konsistensi lintas modul** — memastikan Publikasi dan Persuratan berbagi bahasa visual yang sama melalui design token shadcn/ui.
4. **Aksesibilitas** — seluruh kombinasi warna (text/background, foreground/accent, ring/border) memenuhi **WCAG 2.1 AA** (kontras ≥ 4.5:1 untuk teks normal, ≥ 3:1 untuk teks besar & elemen UI).
5. **Zero low-level hack** — semua perubahan melalui design token & utility Tailwind; **tidak ada** inline hex color atau custom CSS file baru.

---

## Implementation Steps

### Fase 1 — Research & Audit (Current State Analysis)

> **Tooling WAJIB di fase ini:**
> - **Context7** (`npx ctx7@latest`) untuk riset best practice:
>   - `npx ctx7@latest library shadcn "theming color tokens"` → fetch docs penggunaan CSS variables shadcn v4
>   - `npx ctx7@latest library "Tailwind CSS" "OKLch color palette v4"` → best practice palette Tailwind v4
>   - Riset web tambahan (via Context7 atau WebSearch) untuk: *"Institutional Dashboard color palette"*, *"Color palettes for Enterprise Mail Systems"*, *"UI/UX best practices for high-traffic correspondence apps"*
> - **next-devtools-mcp** untuk snapshot kondisi awal route `/persuratan` & `/publikasi` (screenshot, layout tree, warning log)

Aktivitas:
1. Inventarisasi seluruh token warna yang saat ini dipakai di `globals.css` — catat mana yang konsisten, mana yang duplikat/ad-hoc.
2. Identifikasi titik-titik *color clash* antara Topbar, Sidebar, Content, dan tombol (khususnya state: default/hover/active/focus/disabled).
3. Audit kontras setiap pasangan `foreground`/`background` dengan tool kontras (devtools bawaan browser atau next-devtools-mcp).
4. Dokumentasikan temuan dalam format tabel singkat (issue/severity/lokasi) — simpan sebagai lampiran di PR description.

**Deliverable Fase 1:** Tabel audit + referensi palette hasil riset Context7.

---

### Fase 2 — Design Refinement (Definisi Palette & Hierarki)

Aktivitas:
1. Definisikan **tiga zona visual** yang jelas:
   - **Navigation zone** (Topbar + Sidebar) — tone lebih tenang/netral, sedikit lebih gelap dari workspace (atau sebaliknya, tergantung arah desain) agar terasa sebagai *chrome*, bukan konten.
   - **Workspace zone** (Content Area) — tone paling netral & terang, fokus pada readability jangka panjang.
   - **Interactive accents** (tombol primary, link, badge aktif) — gunakan warna aksen shadcn (`--primary`, `--accent`) dengan disiplin; jangan terlalu banyak varian.
2. Tentukan skema token yang akan diubah/ditambah di `globals.css` (dalam OKLch, sesuai konvensi project):
   - `--background`, `--foreground`
   - `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`
   - `--topbar` *(tambahan baru bila belum ada)*
   - `--card`, `--muted`, `--accent`, `--primary`, `--ring`, `--border`
3. Pastikan **dark mode** ikut dipertimbangkan — setiap token wajib punya pasangan `.dark`.
4. Susun **design rationale** singkat (1–2 paragraf) di PR description: mengapa palette ini cocok untuk sistem korespondensi institusional.

**Deliverable Fase 2:** Daftar token final (nama + nilai OKLch untuk light & dark) + rationale.

---

### Fase 3 — Integration (Penerapan ke `template.tsx` & Global Styles)

Aktivitas:
1. Update `src/app/globals.css` — terapkan token baru di block `:root` dan `.dark`. **Hanya sentuh variables**, jangan tulis selector custom baru.
2. Update `src/app/(main)/template.tsx` — aplikasikan class/utility Tailwind yang merujuk ke token baru (mis. `bg-background`, `bg-sidebar`, `border-border`). Tidak boleh ada nilai warna literal.
3. Propagasi ke komponen anak bila ada hard-coded color class yang bentrok (mis. `bg-white`, `text-gray-*`, `border-slate-*`) — ganti ke token shadcn.
4. Verifikasi konsistensi dengan komponen shadcn yang sudah ada (Button variants, Badge, Input, Table) — tidak perlu override varian bawaan kecuali ada ketidakcocokan.
5. Jalankan dev server dan lakukan spot-check di `/persuratan` + `/publikasi` + halaman anak (list, detail, form, modal).

**Deliverable Fase 3:** Diff yang rapi, terbatas pada `globals.css`, `template.tsx`, dan koreksi hard-coded color di komponen terkait.

---

### Fase 4 — Validation (Visual & Technical Check)

> **Tooling WAJIB di fase ini:**
> - **next-devtools-mcp** — jalankan ulang untuk:
>   - deteksi **layout shift** akibat perubahan (CLS regression)
>   - deteksi **rendering issues / warnings** di console
>   - bandingkan snapshot sebelum–sesudah di `/persuratan` & `/publikasi`
> - **Context7** — bila menemui issue spesifik shadcn/Tailwind, fetch docs terkait (jangan menebak).

Aktivitas:
1. Kontras check WCAG AA untuk seluruh pasangan warna kunci (minimum: text-on-background, text-on-sidebar, primary-button-text, muted-foreground, destructive-foreground).
2. Manual test matrix:
   - Light mode & dark mode
   - Viewport: mobile (≤ 640px), tablet (768px), desktop (≥ 1280px)
   - State komponen: hover / focus-visible / active / disabled / loading
3. Regression check tiap sub-halaman yang mewarisi template: list, detail modal, form dialog, toast, empty state.
4. Pastikan semua teks UI tetap dalam **Bahasa Indonesia** (tidak ada string Inggris yang tak sengaja bocor saat refactor).

**Deliverable Fase 4:** Checklist tervalidasi + screenshot before/after (minimum topbar, sidebar, list view, detail view — light & dark mode).

---

## File Change Summary

| Aksi | File | Catatan |
|------|------|---------|
| **Edit** | `src/app/globals.css` | Tambah/ubah OKLch token di `:root` dan `.dark` |
| **Edit** | `src/app/(main)/template.tsx` | Pasang class Tailwind berbasis token baru |
| **Edit (kondisional)** | Komponen Topbar & Sidebar yang di-render oleh template | Ganti hard-coded color class ke token shadcn |
| **Edit (kondisional)** | Halaman / komponen Persuratan & Publikasi yang masih pakai warna literal | Normalisasi ke token |
| **Tidak boleh** | File CSS baru di luar `globals.css` | Semua styling via utility Tailwind |
| **Tidak boleh** | Inline `style={{ color: '#...' }}` | Harus via class + token |

---

## Constraints

1. **Design System only** — strictly `shadcn/ui` tokens + Tailwind v4 utilities. Tidak ada library styling tambahan.
2. **No tech debt** — jangan tinggalkan token lama yang tak terpakai; bersihkan sekaligus.
3. **Clean architecture** — perubahan terbatas pada lapisan styling; tidak mengubah logic, state, atau data flow.
4. **Bahasa Indonesia** untuk seluruh teks UI (toast, label, tooltip, empty state) — tidak berubah oleh issue ini, tapi verifikasi saat refactor.
5. **Biome format** — tabs, single quote (sesuai config), tidak melawan formatter.
6. **Accessibility non-negotiable** — target WCAG AA; kegagalan kontras = blocker, bukan nice-to-have.

---

## Tooling Instructions (MANDATORY)

Implementor **wajib** menggunakan tooling berikut selama pengerjaan — bukan opsional:

1. **Context7** (CLI `npx ctx7@latest` atau skill `context7-mcp`) untuk:
   - Riset best practice *"Institutional Dashboard"* & *"Enterprise Mail System color palette"*.
   - Fetch dokumentasi terkini `shadcn/ui` theming, `Tailwind CSS v4` OKLch utilities, dan komponen shadcn yang disentuh.
   - Hindari menebak API/token — verifikasi lewat docs terlebih dahulu.
2. **next-devtools-mcp** untuk:
   - Pre-change snapshot (baseline) route `/persuratan` & `/publikasi`.
   - Post-change audit: layout shift, rendering error, console warning.
   - Compare before/after rendering behaviour.
3. Catat penggunaan tooling di deskripsi PR (query + ringkasan temuan) sebagai *audit trail*.

---

## Finalisasi & Verifikasi

Sebelum menandai issue selesai, implementor **WAJIB** menjalankan:

1. `bun run build` — **zero error** TypeScript/compile. Tidak boleh di-skip.
2. `bun run lint` — clean; jalankan `bun run format` bila perlu.
3. **next-devtools-mcp** scan — **zero error**, tidak ada layout shift regresi, tidak ada warning baru.
4. Manual visual check di seluruh sub-route turunan template:
   - `/persuratan` (list, detail, toolbar, sidebar folder tree)
   - `/publikasi` (list, detail modal, form, preview)
   - Halaman anak master (bila masih dalam scope group `(main)`)
5. Kontras WCAG AA pass untuk pasangan warna kunci (dokumentasikan hasilnya di PR).
6. Screenshot before/after (light & dark mode) dilampirkan di PR.
7. Jika ditemukan error di langkah manapun, **fix dulu** — jangan merge dalam keadaan merah.

---

## Catatan untuk Implementor

- Fokus pada **strategi dan token**, bukan detail komponen individual. Kalau merasa perlu ubah banyak komponen, kemungkinan scope sudah melebar — diskusikan dulu.
- Gunakan token yang sudah ada sebelum bikin token baru. Token baru hanya bila tidak ada padanan yang cocok.
- Pertahankan karakter *institusional* — hindari warna terlalu jenuh/playful yang tidak cocok untuk sistem korespondensi formal.
- Kalau ragu dengan arah desain, konsultasikan dulu lewat komentar issue sebelum lanjut ke Fase 3.
