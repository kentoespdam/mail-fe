# Fix: Sidebar Mail Folder Tree Overlap dengan TopBar di Desktop

## Context

Pada tampilan desktop, sidebar `MailFolderTree` di halaman `/persuratan` **overlap (menimpa) area TopBar**. Sidebar muncul dari atas viewport padahal seharusnya dimulai di bawah TopBar (80px).

### Akar Masalah

Komponen `Sidebar` (`src/components/ui/sidebar.tsx`) menggunakan **CSS `fixed inset-y-0 h-svh`** pada container-nya (sidebar-container). Artinya sidebar diposisikan fixed dari **top: 0** viewport, mengabaikan posisi parent.

Meskipun `SidebarProvider` di `persuratan-content.tsx` sudah di-set `h-[calc(100vh-80px)]`, inner sidebar container tetap fixed ke seluruh viewport karena `inset-y-0` = `top: 0; bottom: 0`.

Sementara TopBar menggunakan `sticky top-0 z-50 h-20` — keduanya bertabrakan di area 80px teratas.

### Visualisasi Masalah

```
┌──────────────────────────────────┐
│ TopBar (sticky, z-50, h-20)      │ ← z-50
├──────────────────────────────────┤
│ ┌───────┐                        │
│ │Sidebar│  Main Content          │
│ │(fixed │                        │
│ │inset- │                        │
│ │y-0)   │                        │
│ │       │                        │
│ └───────┘                        │
└──────────────────────────────────┘

Sidebar starts from top:0, overlapping TopBar!
```

### Target

```
┌──────────────────────────────────┐
│ TopBar (sticky, z-50, h-20)      │
├──────────────────────────────────┤
│ ┌───────┐                        │
│ │Sidebar│  Main Content          │
│ │starts │                        │
│ │below  │                        │
│ │topbar │                        │
│ │       │                        │
│ └───────┘                        │
└──────────────────────────────────┘

Sidebar starts at top:80px, no overlap.
```

## Referensi

- **shadcn Sidebar docs** — Cek bagaimana sidebar bekerja dengan header/topbar yang sudah ada
  - Gunakan ctx7: `npx ctx7@latest docs /shadcn-ui/ui "sidebar with header inset-y-0 top offset"`
- **Next.js devtools** — Gunakan MCP `get_errors` dan `get_page_metadata` untuk cek error dan render state

## Dependensi

| File | Status |
|---|---|
| `src/components/ui/sidebar.tsx` | **JANGAN DIUBAH** — ini komponen library shadcn |
| `src/components/ui/sheet.tsx` | **JANGAN DIUBAH** — ini komponen library shadcn |
| `src/components/dashboard/topbar.tsx` | Referensi — TopBar sticky h-20 (80px) |
| `src/app/(main)/template.tsx` | Referensi — Template layout (TopBar + main) |

## File yang Perlu Diubah

| File | Aksi | Keterangan |
|---|---|---|
| `src/components/persuratan/persuratan-content.tsx` | **EDIT** | Override posisi sidebar agar tidak overlap TopBar |

> **PENTING:** Jangan ubah file `src/components/ui/sidebar.tsx`. Perbaikan dilakukan melalui **className override** atau **CSS variable** di level konsumer (persuratan-content).

## Strategi Perbaikan

Sidebar container menggunakan class `fixed inset-y-0 h-svh`. Kita perlu override agar:
- **top** dimulai dari 80px (tinggi TopBar), bukan 0
- **height** menjadi `calc(100vh - 80px)` atau `calc(100svh - 80px)`, bukan full viewport

Ini bisa dicapai dengan menambahkan className pada komponen `<Sidebar>` yang override positioning bawaan.

## Langkah Implementasi

### Langkah 1: Pahami Struktur Layout

1. Baca file `src/app/(main)/template.tsx` — perhatikan TopBar `sticky top-0 z-50 h-20`
2. Baca file `src/components/persuratan/persuratan-content.tsx` — perhatikan `SidebarProvider` dengan `h-[calc(100vh-80px)]`
3. Baca file `src/components/ui/sidebar.tsx` — perhatikan sidebar-container menggunakan `fixed inset-y-0 h-svh`
4. **Gunakan MCP** `get_page_metadata` untuk melihat komponen yang aktif di halaman `/persuratan`

### Langkah 2: Fetch Dokumentasi Terbaru

Gunakan **context7** untuk mendapatkan referensi terbaru:

```bash
npx ctx7@latest library shadcn "sidebar fixed positioning with sticky header"
npx ctx7@latest docs <library-id> "sidebar offset top with header navbar sticky"
```

Cari apakah ada **pattern resmi** dari shadcn untuk sidebar yang berdampingan dengan header/topbar. Jika tidak ada, lanjut dengan override className.

### Langkah 3: Terapkan Fix pada `persuratan-content.tsx`

Override positioning sidebar-container agar dimulai di bawah TopBar. Pendekatan yang direkomendasikan:

- Tambahkan className pada komponen `<Sidebar>` yang meng-override `inset-y-0` dan `h-svh` bawaan
- Gunakan Tailwind utility untuk set `top-20` (80px) dan `h-[calc(100svh-80px)]` atau `h-[calc(100vh-5rem)]`
- Pastikan sidebar-gap (spacer div) juga mengikuti tinggi yang benar
- Perhatikan bahwa className pada `<Sidebar>` diteruskan ke `sidebar-container` div — cek di source `sidebar.tsx`

**Tips penting:**
- `inset-y-0` di Tailwind setara `top: 0; bottom: 0` — untuk override, gunakan `top-20` (yang akan override `top: 0` dari `inset-y-0`)
- Jika `top-20` tidak cukup karena specificity, pertimbangkan `!top-20` (important modifier)
- Height sidebar perlu disesuaikan: dari `h-svh` menjadi `h-[calc(100svh-80px)]` atau `!h-[calc(100svh-5rem)]`

### Langkah 4: Verifikasi Sidebar-Gap Spacer

Komponen `Sidebar` juga render sebuah div `sidebar-gap` sebagai spacer. Pastikan:
- Spacer div tingginya juga mengikuti (`h-[calc(100vh-80px)]` atau otomatis mengikuti parent)
- Tidak ada visual gap atau mismatch antara sidebar dan konten

### Langkah 5: Test Semua State Sidebar

Verifikasi di browser (`http://localhost:3000/persuratan`):

- [ ] **Expanded state**: Sidebar tidak overlap dengan TopBar — ada jarak 80px dari atas
- [ ] **Collapsed state** (icon-only): Sidebar tetap di bawah TopBar
- [ ] **Toggle sidebar** (klik SidebarRail atau Ctrl+B): Transisi smooth, tidak ada jump/flicker
- [ ] **Scroll konten**: Sidebar tetap fixed di posisinya, tidak ikut scroll
- [ ] **Responsive mobile**: Sidebar menjadi Sheet/drawer — tidak terpengaruh fix ini (Sheet punya z-index sendiri)
- [ ] **SidebarInset**: Area konten utama (mail list + detail) tetap berfungsi normal, tidak ada layout shift

### Langkah 6: Finalisasi & Error Check

Lakukan pengecekan berikut **secara berurutan**:

1. **MCP next-devtools** — cek error:
   ```
   Panggil MCP tool: get_errors
   ```
2. **Build check** — pastikan tidak ada TypeScript/compile error:
   ```bash
   bun run build
   ```
3. **Lint check**:
   ```bash
   bun run lint
   ```
4. Jika ada error, **fix semua sebelum menganggap tugas selesai**

## Catatan Penting

- **JANGAN** ubah file `src/components/ui/sidebar.tsx` atau `src/components/ui/sheet.tsx` — itu library component
- **JANGAN** ubah `src/app/(main)/template.tsx` atau `topbar.tsx` — masalah ada di sisi konsumer sidebar
- **Gunakan skill/MCP** (ctx7 untuk docs, next-devtools untuk error check) selama implementasi
- **Perubahan minimal** — hanya fix overlap, jangan refactor atau ubah fitur lain
- Fix ini hanya berupa penambahan/override className — tidak ada perubahan logic atau struktur komponen
- Jika perlu, cek juga halaman lain yang menggunakan Sidebar untuk memastikan fix tidak menimbulkan side-effect (kemungkinan besar hanya `/persuratan` yang pakai Sidebar saat ini)
