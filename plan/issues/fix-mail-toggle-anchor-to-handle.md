# Fix: Anchor MailListToggle ke ResizableHandle

## 1. Context

Di `PersuratanContent` (`src/components/persuratan/persuratan-content.tsx:86-88`), tombol `MailListToggle` di-render sebagai elemen **absolute-positioned** dengan `top-[45%] left-1/2` relatif ke container `.relative.flex-1`. Saat user men-drag `ResizableHandle` untuk memperkecil panel `MailList` (mis. jadi 25%), tombol tetap nangkring di ~45% tinggi container — yang secara visual masuk ke area `MailDetail`, bukan di garis pemisah dua panel. Tombol jadi mengganggu konten detail surat.

```
SEKARANG (MailList resized jadi ~25%)       SETELAH FIX
┌─────────────────────┐                     ┌─────────────────────┐
│ MailList (25%)      │                     │ MailList (25%)      │
├─────────────────────┤                     ├━━━━━━━(⌃)━━━━━━━━━━━┤ ← toggle di handle
│ MailDetail          │                     │ MailDetail (75%)    │
│    (⌃)  ← nangkring │                     │                     │
│    di area detail   │                     │                     │
└─────────────────────┘                     └─────────────────────┘
```

Branch aktif: `fitur-mail`. Commit terakhir relevan: `8cc1b15 feat: implement toggle functionality for MailList visibility in PersuratanContent`.

## 2. Tujuan

- Tombol `MailListToggle` **mengikuti posisi `ResizableHandle`** saat panel di-resize, sehingga selalu berada di garis pemisah `MailList` ↔ `MailDetail`.
- Tombol terintegrasi ke dalam handle: klik tombol = toggle visibility list, drag area sekitar tombol = resize panel (behavior normal handle tetap berjalan).
- State `hidden` (list tersembunyi) **tidak berubah** — tetap pakai bar tipis `h-7` existing dengan tombol ter-center.
- Tidak ada regresi pada:
  - Drag handle masih smooth (tidak kepatok tombol).
  - Tooltip `TooltipButton` masih muncul.
  - Fokus keyboard handle masih accessible.

## 3. File Change Table

| Path | Perubahan |
|---|---|
| `src/components/ui/resizable.tsx` | Tambahkan dukungan untuk me-render **custom content** di dalam `ResizableHandle` (sebagai alternatif / pelengkap grip `withHandle`). Tetap backward compatible. |
| `src/components/persuratan/persuratan-content.tsx` | Hapus wrapper `div.absolute.top-[45%]...` pembungkus `MailListToggle` (state normal). Pindahkan `MailListToggle` ke dalam `ResizableHandle` via props baru. State hidden (bar `h-7`) tidak diubah. |
| `src/components/persuratan/mail-list-toggle.tsx` | Penyesuaian minor pada styling agar selaras saat di-embed di handle horizontal (orientation `vertical` panel group = handle horizontal). Tidak mengubah public API. |

## 4. Keputusan Arsitektur

Ada dua cara membawa tombol ke dalam handle:

| Opsi | Pendekatan | Trade-off |
|---|---|---|
| **A. Extend `ResizableHandle` dengan prop `children`** (✅ pilih ini) | Tambahkan prop `children` di `ResizableHandle` yang di-render di tengah separator. Grip `withHandle` tetap bisa dipakai sebagai fallback. | Reusable untuk kasus lain (mis. panel master juga butuh). Minim perubahan call-site. |
| B. Absolute overlay di atas handle dengan ref | Simpan ref handle, positioning tombol absolute mengikuti getBoundingClientRect. | Fragile (reflow, resize observer), rawan desync saat drag cepat. Tolak. |

**Executor wajib pilih Opsi A** dan dokumentasikan di komentar JSDoc `ResizableHandle`.

### Detail desain Opsi A

- `ResizableHandle` menerima `children?: ReactNode`.
- Jika `children` ada → render `children` di posisi tengah handle (menggantikan grip default).
- Jika `children` tidak ada & `withHandle` true → render grip bar existing (backward compatible).
- Pastikan `children` wrapper pakai `z-10`, `pointer-events-auto`, dan tidak membatalkan drag di sisa area separator (tombol sudah `stopPropagation` di `onClick`, drag pakai `onPointerDown` di separator — tidak konflik).

## 5. Implementation Steps

### Phase 1 — Preparation
1. Baca `src/components/ui/resizable.tsx` untuk pastikan struktur `Separator` dari `react-resizable-panels`.
2. Cek `src/components/ui/tooltip-button.tsx` dan `src/components/persuratan/mail-list-toggle.tsx` untuk konfirmasi tombol ukuran `size-6` cukup kecil untuk nempel di handle 1px.
3. Gunakan `context7-mcp` untuk ambil dokumentasi terbaru:
   - Query: `react-resizable-panels PanelResizeHandle custom children`
   - Pastikan `children` boleh di-pass ke `Separator` / `PanelResizeHandle` tanpa break drag behavior.

### Phase 2 — Extend ResizableHandle
4. Tambahkan prop opsional `children?: React.ReactNode` di `ResizableHandle`.
5. Ubah body render: jika `children` truthy → render `children` di dalam wrapper positioning (tengah, `z-10`). Kalau tidak → fallback ke logic `withHandle` existing.
6. Styling wrapper children:
   - Posisi absolute center (mengandalkan `Separator` yang flex-center).
   - `pointer-events-auto` pada wrapper, `pointer-events-none` tidak diperlukan karena separator hanya bereaksi ke `onPointerDown` area after-pseudo.
   - Pastikan `bg-border` grip tidak lagi dirender bareng children (prevent overlap) — kecuali desain mau kombinasi; default: children replace grip.
7. Tambahkan JSDoc singkat menjelaskan kapan pakai `children` vs `withHandle`.

### Phase 3 — Integrate di PersuratanContent
8. Di `persuratan-content.tsx` (state `!isListHidden`):
   - Hapus `<div className="absolute top-[45%] ...">` beserta isinya.
   - Pindahkan `<MailListToggle hidden={false} onToggle={toggleList} />` sebagai **children** dari `<ResizableHandle>`.
   - Hapus prop `withHandle` (karena diganti tombol) **atau** pertahankan `withHandle` jika keputusan desain ingin grip + tombol berdampingan. **Default: hapus** `withHandle` — tombol sudah jadi indikator visual yang cukup.
9. Biarkan block `isListHidden === true` apa adanya (bar `h-7` + `MailListToggle hidden`).
10. Verifikasi orientation: `ResizablePanelGroup orientation="vertical"` → handle `aria-orientation=horizontal` → tombol round tetap terbaca sebagai control handle.

### Phase 4 — Styling & Polish
11. Di `mail-list-toggle.tsx`, pastikan tombol tetap `rounded-full size-6 bg-background border shadow-sm` agar "mengambang" di atas garis handle 1px.
12. Tambahkan (jika belum) `shadow-sm` / `ring-1 ring-border/50` kecil supaya tombol terlihat "float" di atas garis separator dan tidak menyatu dengan grip area.
13. Pastikan saat user mendekati handle untuk drag, kursor tetap `cursor-row-resize` (default dari `PanelResizeHandle`). Tombol sendiri boleh `cursor-pointer`.

### Phase 5 — Validation
14. Jalankan dev server, test skenario di "Verification Checklist" di bawah.
15. Pakai `next-devtools-mcp` untuk scan runtime error / hydration mismatch setelah perubahan.

## 6. Constraints

- Clean architecture, **no tech debt**, tidak ada dead code (hapus wrapper absolute lama).
- Indent **tabs** (Biome).
- Semua teks UI, tooltip, aria-label tetap **Bahasa Indonesia** (label sudah ada: "Tampilkan/Sembunyikan daftar surat").
- Path alias `@/*`.
- **Jangan ubah public API** `ResizableHandle` secara breaking — `withHandle` harus tetap bekerja untuk call-site lain. Prop `children` sifatnya **additive**.
- **Jangan memperkenalkan library baru.** `react-resizable-panels` sudah cukup.
- **Jangan menyentuh** `MailList`, `MailDetail`, `MailToolbar`, `MailFolderTree` — di luar scope.
- State `isListHidden` & hook `useMailNavigation/useMailListState/useMailDetailState` tidak diubah.

## 7. Tooling Instructions (CRITICAL)

Executor **wajib** memakai MCP tool berikut:

- **`context7-mcp`** / `npx ctx7@latest`:
  - `library "react-resizable-panels" "PanelResizeHandle custom children"` lalu `docs <id> "custom handle content"` — konfirmasi pola embedding children di handle tidak menabrak pointer event drag.
  - `library "shadcn/ui" "resizable handle customization"` — cek apakah shadcn v4 punya rekomendasi pattern untuk toggle di handle.
- **`next-devtools-mcp`**:
  - Jalankan saat `bun dev`, scan `/persuratan`, pastikan nol error runtime + nol hydration warning setelah perubahan.
  - Cek performance: drag handle harus tetap 60fps (tidak ada re-render `MailList`/`MailDetail` akibat toggle di-hoist ke handle).

## 8. Verification Checklist

- [ ] `bun run build` lolos tanpa error TypeScript.
- [ ] `bun run lint` bersih (Biome).
- [ ] `bun run format` applied (tabs).
- [ ] MCP scan (next-devtools) nol error runtime & hydration.
- [ ] **Manual test matrix:**
  - [ ] State normal, panel default 45/45: tombol tepat di garis handle, klik = hide list.
  - [ ] Resize `MailList` ke minimum (25%): tombol tetap nempel di handle, **tidak** masuk area `MailDetail`.
  - [ ] Resize `MailList` ke maksimum (~80%): tombol tetap nempel di handle.
  - [ ] Drag handle dengan menarik **area sekitar tombol** (bukan tombol): drag jalan normal, tidak nge-trigger toggle.
  - [ ] Klik tombol: toggle ke state hidden, list hilang, bar tipis `h-7` muncul dengan tombol center.
  - [ ] Klik tombol di state hidden: kembali ke state normal dengan panel 45/45.
  - [ ] Tooltip "Tampilkan/Sembunyikan daftar surat" muncul saat hover.
  - [ ] Keyboard: Tab fokus mendarat di tombol; Enter/Space men-toggle. `ResizableHandle` masih bisa di-focus & di-geser dengan arrow keys.
  - [ ] Responsif: sidebar mobile (`use-mobile`) tidak terpengaruh — tombol tetap berperilaku sama.
  - [ ] RBAC: USER/ADMIN/SYSTEM semua bisa memakai toggle (tidak ada permission gating baru).

> ASUMSI: Tombol menggantikan grip `withHandle` di state normal (single source of truth secara visual). Jika desain menginginkan grip **dan** tombol berdampingan, sebutkan secara eksplisit dan executor akan pertahankan `withHandle` + render tombol di atasnya.
