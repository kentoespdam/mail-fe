# Toggle Show/Hide MailList untuk Fullscreen MailDetail

## Context

Di route `/persuratan` layout saat ini (`PersuratanContent`, `src/components/persuratan/persuratan-content.tsx`) memakai `ResizablePanelGroup` vertikal dengan dua panel:

- **Atas:** `MailList` (`defaultSize={45}`, `minSize={25}`)
- **Bawah:** `MailDetail` (`defaultSize={45}`, `minSize={20}`)
- Dipisah oleh `<ResizableHandle withHandle />` di tengah.

User ingin menambahkan **toggle button** di handle/area tengah antara `MailList` dan `MailDetail` yang bisa **menyembunyikan** panel `MailList` sehingga `MailDetail` memakai seluruh area yang tersedia. Tombol yang sama juga mengembalikan tampilan ke dua panel (show `MailList`).

### ASCII mockup

**State A — default (list + detail):**
```
┌─────────────────────────────────────┐
│ MailToolbar                         │
├─────────────────────────────────────┤
│ MailList (45%)                      │
│                                     │
├───────────── ▲ ──── ═══ ────────────┤  ← handle + tombol toggle (ikon: ChevronUp)
│ MailDetail (45%)                    │
│                                     │
└─────────────────────────────────────┘
```

**State B — list hidden (detail fullscreen):**
```
┌─────────────────────────────────────┐
│ MailToolbar                         │
├───────────── ▼ ──────────────── ────┤  ← tombol toggle (ikon: ChevronDown) menempel di atas
│ MailDetail (100%)                   │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

Branch: `fitur-mail`.

## Tujuan

- User dapat menyembunyikan `MailList` dengan satu klik untuk memperluas `MailDetail`.
- User dapat menampilkan kembali `MailList` ke ukuran sebelumnya (atau default 45%).
- Posisi tombol intuitif: di tengah (perbatasan list/detail) saat keduanya tampil; di atas `MailDetail` saat list disembunyikan.
- Ikon tombol berubah kontekstual (chevron up saat list tampil → "hide list"; chevron down saat list hidden → "show list") + tooltip Bahasa Indonesia.
- Tidak ada layout shift/jank; transisi halus.
- `MailToolbar` tetap terlihat di kedua state.

## File Change Table

| Path | Perubahan |
|---|---|
| `src/components/persuratan/persuratan-content.tsx` | Tambah state `isListHidden` (boolean, default `false`); kondisional render `ResizablePanel` list + `ResizableHandle`; sematkan tombol toggle di area handle atau tepat di atas panel detail saat list hidden. |
| `src/components/persuratan/mail-list-toggle.tsx` *(baru)* | Komponen kecil `MailListToggle` — tombol `Button` size `icon` variant `ghost` dengan ikon `ChevronUp` / `ChevronDown` (lucide) + `TooltipButton` wrapper, props: `hidden: boolean`, `onToggle: () => void`. |

> ASUMSI: Ukuran panel tidak perlu di-persist ke URL / localStorage — cukup in-memory state. Jika user ingin persist, tambahkan ke `useMailNavigation` atau `useQueryState('listHidden', booleanParser)`.

## Keputusan Arsitektur

Tombol perlu ditempatkan **tepat di perbatasan** list/detail. Ada 3 opsi:

| Opsi | Cara | Kapan cocok |
|---|---|---|
| **A. Tombol overlay di `ResizableHandle`** | Render tombol `absolute` di dalam handle (child `ResizableHandle`). | Saat kedua panel tampil, tombol pas di tengah garis pembatas. Tetapi saat `MailList` di-unmount, handle juga hilang → tombol hilang. |
| **B. Conditional render tombol di luar ResizableHandle** | Saat `isListHidden=false`: tombol absolute positioned di atas `ResizableHandle`. Saat `isListHidden=true`: tombol di-render sebagai baris tipis (sticky/relative) tepat di atas `MailDetail`. | **Recommended** — selalu terlihat di kedua state, posisi semantik jelas. |
| **C. Tombol di `MailToolbar`** | Tambah action icon di kanan toolbar existing. | Simple, tapi kurang intuitif — user harus asosiasikan icon di toolbar dengan panel list di bawahnya. Tidak di "tengah" sesuai permintaan. |

**Pilih Opsi B.** Executor wajib dokumentasikan alasan singkat di komentar atas komponen `MailListToggle`.

### ⚠️ Root Cause — Ikon Chevron Tidak Terlihat (lesson learned)

Bug yang muncul saat pertama implement: tombol ter-render tapi **ikon chevron tidak tampak**. Penyebab terletak pada interaksi dengan `ResizableHandle` di `src/components/ui/resizable.tsx`:

1. `ResizableHandle` untuk orientasi horizontal **hanya setinggi 1px** (`aria-[orientation=horizontal]:h-px`). Jika tombol di-render sebagai **child** handle, container parent terlalu tipis → tombol bisa ter-clip secara visual.
2. Grip internal `withHandle` (`h-6 w-1 ... bg-border`) dirotasi 90° untuk handle horizontal → jadi `w-6 h-1`. Grip ini **berada di atas** tombol (z-index default) dan berwarna `bg-border` — kalau tombol tidak punya background solid + z-index > grip, chevron ketutup garis grip.
3. Warna background tombol yang mengandalkan `bg-background` bisa **menyatu dengan `bg-border`** handle di theme tertentu, terutama karena handle memiliki `after:` pseudo-element (`w-full h-1 bg-border`) yang melintang.
4. Ikon chevron dari `lucide-react` default **tidak punya warna** (inherit `currentColor`). Jika tombol memakai `variant="ghost"` tanpa eksplisit `text-foreground`, dan parent absolute positioning membuat cascade warna hilang, ikon bisa render transparan atau sewarna border.

**Mitigasi wajib pada implementasi:**

- **Jangan** render `MailListToggle` sebagai child `ResizableHandle`. Render sebagai **sibling absolute** di wrapper `relative` yang membungkus `ResizablePanelGroup`, **bukan** di dalam handle.
- Posisi tombol: `absolute left-1/2 -translate-x-1/2`, `top` dihitung dari ukuran panel atas (atau pakai pendekatan **baris toggle eksplisit** — lihat revisi Steps di bawah).
- Tombol **wajib** punya background solid (`bg-background`), border (`border border-border`), shadow (`shadow-sm`), dan `z-20` (di atas grip `z-10` milik handle).
- Ikon chevron **wajib** eksplisit `text-foreground` (atau `text-muted-foreground` kalau tone-down) — jangan mengandalkan inherit.
- Ukuran tombol minimal **24×24px** (`size-6`) untuk area klik, tapi chevron di dalamnya `size-4` agar proporsional.
- Tambahkan `aria-label` Bahasa Indonesia + `onClick` dengan `e.stopPropagation()` agar tidak memicu drag handle.

## Implementation Steps

### 1. Scaffolding `MailListToggle`

1. Buat file `src/components/persuratan/mail-list-toggle.tsx` (parent `PersuratanContent` sudah `"use client"` — komponen ini cukup fungsi biasa).
2. Props: `hidden: boolean`, `onToggle: () => void`, `className?: string`.
3. Root element: `Button` dari `@/components/ui/button`, props wajib:
   - `variant="outline"` (bukan `ghost`) — supaya border & background solid langsung dari CVA, kontras di atas handle.
   - `size="icon"` + override `className="size-6 rounded-full bg-background border border-border shadow-sm z-20"`.
   - `onClick={(e) => { e.stopPropagation(); onToggle(); }}` — cegah drag handle.
   - `aria-label` dinamis Bahasa Indonesia.
4. Ikon di dalam Button:
   - `ChevronUp` saat `hidden=false` (aksi = sembunyikan list).
   - `ChevronDown` saat `hidden=true` (aksi = tampilkan list).
   - **Wajib** kelas `className="size-4 text-foreground"` — jangan andalkan inherit, ini root cause chevron tidak terlihat.
5. Bungkus dengan `Tooltip` (`@/components/ui/tooltip`) atau `TooltipButton` — pastikan `TooltipContent` pakai teks Bahasa Indonesia:
   - `hidden=false` → `"Sembunyikan daftar surat"`
   - `hidden=true` → `"Tampilkan daftar surat"`
6. Tambahkan komentar singkat di atas komponen: alasan pakai Opsi B + catatan "chevron butuh `text-foreground` + bg solid karena handle `ResizableHandle` punya grip `bg-border` yang menutupi".

### 2. Integrasi di `PersuratanContent`

1. Tambah `const [isListHidden, setIsListHidden] = useState(false);` di atas return.
2. Handler: `const toggleList = useCallback(() => setIsListHidden((v) => !v), []);`.
3. Ubah wrapper `<div className="flex-1 flex flex-col overflow-hidden">` menjadi `<div className="relative flex-1 flex flex-col overflow-hidden">` (perlu `relative` untuk anchor absolute tombol).
4. **Saat `!isListHidden`** (list tampil):
   - Render `ResizablePanelGroup` seperti sekarang.
   - Render `MailListToggle` sebagai **sibling absolute** setelah `ResizablePanelGroup` di wrapper `relative`, dengan posisi dihitung dari ukuran panel atas. Gunakan class: `absolute left-1/2 -translate-x-1/2 z-20` + inline style atau kelas dinamis untuk `top` (approx `top-[45%]` mengikuti `defaultSize={45}`, atau pakai `ImperativePanelHandle` untuk posisi akurat saat user drag handle).
   - **Alternatif lebih robust**: gunakan layout tanpa absolute — wrap `ResizableHandle` di `div relative` dan render `MailListToggle` di dalam div tersebut (bukan di dalam `ResizableHandle`!) dengan `absolute top-1/2 left-1/2 -translate-1/2 z-20`. Handle tetap draggable karena handle primitive tidak di-nest dengan tombol.
5. **Saat `isListHidden`** (list hidden):
   - Render **baris toggle non-overlay** sebagai *flex row sibling* — BUKAN absolute/floating — sehingga tombol **tidak menutupi** `CardHeader` / `CardTitle` / nomor surat di `MailDetail`.
   - Struktur:
     ```
     <div className="flex flex-col h-full">
       <div className="flex h-7 shrink-0 items-center justify-center border-b border-border bg-background">
         <MailListToggle hidden onToggle={...} />
       </div>
       <div className="flex-1 overflow-auto p-1 bg-muted/5">
         <MailDetail mail={...} />
       </div>
     </div>
     ```
   - `shrink-0` pada baris toggle wajib agar tidak ter-compress saat konten panjang.
   - Tinggi `h-7` (28px) cukup untuk tombol `size-6` + padding vertikal 2px — **tidak memotong** detail di bawahnya karena pakai flex layout (bukan absolute).
6. `MailToolbar` tetap dirender di luar branch kondisi (selalu tampil).
7. Pastikan `MailDetail` dan `MailList` props tidak berubah.

### 2a. Aturan Posisi Tombol (WAJIB — anti-overlap)

| State | Metode Positioning | Kenapa |
|---|---|---|
| `!isListHidden` (list tampil) | **Absolute** di wrapper `relative`, anchor di garis `ResizableHandle` | Tombol harus "mengapung" di atas garis pembatas — tidak mengambil ruang layout. |
| `isListHidden` (list hidden) | **Flex row sibling** (bukan absolute) di atas `MailDetail` | Tombol mengambil ruang vertikal sendiri (`h-7`) sehingga `MailDetail` shift ke bawah. `CardHeader`, judul surat, badge kategori, dan konten body **tidak tertindih**. |

> ❌ JANGAN pakai `absolute top-0 left-1/2` saat list hidden — itu akan overlay di atas `CardHeader` `MailDetail` dan menutupi badge kategori / tanggal.
> ❌ JANGAN render tombol di dalam wrapper `<div className="h-full bg-muted/5 p-1 overflow-auto">` `MailDetail` — nanti ikut scroll bersama konten.
> ✅ Tombol saat hidden = baris toolbar-mini yang independent dari MailDetail container.

### 3. Styling (checklist anti-invisible)

- Tombol: `bg-background` (SOLID, bukan transparan) + `border border-border` + `shadow-sm` + `rounded-full`. Ini memastikan terlihat menempel di atas garis handle.
- Ikon: `text-foreground` eksplisit. Jika ingin tone-down, pakai `text-muted-foreground` + `hover:text-foreground` — tapi **hindari** warna yang sama dengan `border` (`text-border` = invisible).
- Z-index: tombol `z-20`, grip handle bawaan `z-10`, `after:` pseudo grip juga < 20. Jangan set `z-0` pada tombol.
- Ukuran minimal 24×24 (`size-6`) agar tap target memadai di mobile.
- Saat hover: `hover:bg-accent hover:text-accent-foreground` (sudah default di `variant="outline"` via CVA).
- Transisi: cukup swap ikon (unmount/mount `ChevronUp`/`ChevronDown`) — tidak perlu animasi kompleks.

### 4. Validation

- Saat list hidden, `MailDetail` memakai full height (dikurangi tinggi toolbar + toggle bar h-7).
- Saat list di-show kembali, ukuran panel kembali ke default 45/45 (karena `ResizablePanelGroup` di-mount ulang). Persist ukuran terakhir → pakai `ImperativePanelHandle` + `collapse()/expand()` dari `react-resizable-panels` (opsional, **skip** untuk versi ini).
- Klik tombol tidak memicu resize drag (test: klik tombol lalu geser mouse → panel tidak boleh resize).
- **Inspeksi DOM devtools**: element `<svg>` chevron ter-render dengan `stroke="currentColor"` dan parent `color: ...` bukan transparan/sewarna background.

## Constraints

- Clean architecture, no tech debt, tidak ada dead code.
- Indent **tabs** (Biome).
- Semua teks UI (tooltip, aria-label) **Bahasa Indonesia**.
- Path alias `@/*`.
- Tidak mengubah public API `MailList`, `MailDetail`, `MailToolbar`.
- Tidak memperkenalkan library baru. `react-resizable-panels` sudah tersedia.
- Tidak menambahkan state global — cukup `useState` lokal di `PersuratanContent`.
- Komponen toggle wajib pakai primitif UI existing (`Button` + `Tooltip`/`TooltipButton`), bukan `<button>` mentah.

## Tooling Instructions (CRITICAL)

- **`context7-mcp`** / `npx ctx7@latest`:
  - Resolve `react-resizable-panels` → fetch docs untuk cara collapse/expand panel secara programatik (opsional, jika executor memilih approach imperative alih-alih conditional render).
  - Resolve `lucide-react` kalau butuh memastikan nama ikon chevron untuk React 19.
- **`next-devtools-mcp`** — jalankan saat dev server hidup untuk memastikan tidak ada warning runtime (hydration, console errors) pasca-perubahan conditional render.

## Verification Checklist

- [ ] `bun run build` lolos
- [ ] `bun run lint` bersih (Biome)
- [ ] `bun run format` applied
- [ ] MCP scan (next-devtools) nol error runtime di route `/persuratan`
- [ ] Manual test:
  - [ ] **Ikon chevron TERLIHAT** (bukan kotak kosong) di kedua state — buka devtools → inspect `<svg>` → pastikan `currentColor` resolve ke warna kontras (bukan `border` atau `transparent`)
  - [ ] Tombol punya background solid (tidak blend dengan garis `ResizableHandle`)
  - [ ] Klik toggle saat list tampil → list hilang, detail fullscreen, ikon berubah ke `ChevronDown`
  - [ ] Klik toggle saat list hidden → list muncul kembali di 45%, ikon berubah ke `ChevronUp`
  - [ ] Tooltip Bahasa Indonesia muncul on hover
  - [ ] Drag `ResizableHandle` tetap berfungsi (klik tombol tidak memicu drag — `stopPropagation` bekerja)
  - [ ] Mobile viewport (< 768px) — tombol tetap terjangkau (tap target ≥ 24×24)
  - [ ] Dark mode (jika ada) — ikon tetap kontras terhadap background
  - [ ] RBAC: buka sebagai role `USER` dan `ADMIN` — perilaku toggle identik (tidak ada gating khusus)
  - [ ] Selected mail state tetap saat toggle bolak-balik (detail tidak reset)
  - [ ] **Tombol tidak menutupi `MailDetail`** saat list hidden:
    - [ ] `CardHeader` (badge kategori + tanggal + judul + nomor surat) sepenuhnya terlihat, tidak ketutup tombol
    - [ ] Scroll `MailDetail` bekerja normal — tombol toggle tetap fixed di atas, tidak ikut scroll
    - [ ] Tidak ada overlap visual antara tombol dan konten body surat
    - [ ] Area klik `MailDetail` (link, attachment) tidak terganggu oleh hit area tombol
