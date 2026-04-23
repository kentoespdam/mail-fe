# Enhance Persuratan UI — Full Width, Resizable Panels, Action Buttons

## Context

Halaman `/persuratan` sudah memiliki layout 3-panel dasar (Fase 1 selesai). Sekarang perlu:
1. **Percantik tampilan** — manfaatkan seluruh space yang tersedia (full width), buat UI lebih menarik
2. **Resizable panels** — `MailList` dan `MailDetail` bisa di-resize agar user nyaman melihat detail surat
3. **Tombol aksi** — `Tindakan`, `Hapus`, `Respon`, `Kembalikan` berfungsi sesuai konteks
4. **Tombol Edit** — hanya muncul ketika status surat = `draft` atau `revisi`

### File yang Sudah Ada

| File | Deskripsi |
|------|-----------|
| `src/components/persuratan/persuratan-content.tsx` | Container utama 3-panel |
| `src/components/persuratan/mail-toolbar.tsx` | Toolbar aksi & filter |
| `src/components/persuratan/mail-list.tsx` | Tabel daftar surat |
| `src/components/persuratan/mail-detail.tsx` | Panel preview detail surat |
| `src/components/persuratan/mail-folder-tree.tsx` | Sidebar folder tree |
| `src/types/mail.ts` | Type definitions |
| `src/lib/dummy/mail-dummy.ts` | Dummy data |

---

## Langkah Implementasi

> **WAJIB:** Gunakan skill/MCP tools selama implementasi:
> - **context7** — untuk referensi docs library (shadcn resizable, Tailwind CSS, dll). Contoh: `npx ctx7@latest library shadcn "resizable panel"` lalu `npx ctx7@latest docs <id> "resizable panel component"`
> - **next-devtools** — untuk verifikasi route dan komponen setelah implementasi

### Langkah 1: Full Width Layout & Visual Upgrade

**File:** `src/components/persuratan/persuratan-content.tsx`

**Tujuan:** Hilangkan pembatasan width, manfaatkan seluruh layar, perbaiki visual agar lebih modern.

- Hapus padding/gap yang berlebihan sehingga layout mengisi seluruh viewport width
- Pastikan `h-[calc(100vh-...)]` dihitung dengan benar (sesuaikan dengan tinggi header/navbar)
- Tambahkan subtle border, background contrast, dan spacing yang lebih rapi antar panel
- Sidebar: beri background sedikit lebih gelap/berbeda dari content area untuk visual separation
- Gunakan Tailwind utility class yang sudah ada — **jangan buat custom CSS file**

### Langkah 2: Resizable Panels — Mail List & Mail Detail

**File:** `src/components/persuratan/persuratan-content.tsx`

**Tujuan:** Ganti pembagian fixed `h-[60%]`/`h-[40%]` menjadi resizable agar user bisa drag untuk memperbesar area list atau detail.

- Gunakan **shadcn `ResizablePanelGroup`** (cek docs via context7: `npx ctx7@latest library shadcn "resizable"`)
- Install jika belum ada: `bunx shadcn@latest add resizable`
- Buat `ResizablePanelGroup` dengan `direction="vertical"`:
  - Panel atas: `MailList` (default 60%, min 30%)
  - `ResizableHandle` dengan visual grip indicator
  - Panel bawah: `MailDetail` (default 40%, min 20%)
- Opsional: buat sidebar juga resizable (horizontal `ResizablePanelGroup` untuk sidebar vs content)
- Pastikan overflow scroll tetap bekerja di masing-masing panel

### Langkah 3: Tombol Aksi — Tindakan, Hapus, Respon, Kembalikan

**File:** `src/components/persuratan/mail-toolbar.tsx`

**Tujuan:** Buat tombol-tombol aksi punya behavior yang benar berdasarkan konteks surat yang dipilih.

- **Tindakan** — Jadikan dropdown menu (gunakan shadcn `DropdownMenu`):
  - Menu item contoh: "Disposisi", "Teruskan", "Pindah Folder", dll
  - Sementara setiap item tampilkan toast placeholder
- **Hapus** — Tombol aktif hanya jika ada surat yang dipilih (`selectedMailId !== null`)
  - Tampilkan konfirmasi dialog sebelum hapus (gunakan `DeleteConfirmDialog` yang sudah ada di `@/components/ui/`)
  - Setelah konfirmasi, tampilkan toast sukses dan reset selection
- **Respon** — Tombol aktif hanya jika ada surat yang dipilih
  - Sementara toast placeholder "Fitur Respon dalam pengembangan"
- **Kembalikan** — Tombol aktif hanya jika surat berada di folder Deleted Items
  - Sementara toast placeholder "Fitur Kembalikan dalam pengembangan"
- Semua tombol disabled state (grayed out) ketika kondisi tidak terpenuhi
- Toolbar perlu menerima props tambahan: `selectedMailId`, `selectedFolderId`, dan `mailStatus` (atau mail object langsung)

### Langkah 4: Tombol Edit — Conditional Visibility

**File:** `src/components/persuratan/mail-toolbar.tsx`, `src/types/mail.ts`

**Tujuan:** Tombol Edit hanya ditampilkan jika surat yang dipilih berstatus `draft` atau `revisi`.

- Pastikan `MailDetailDto.status` sudah ada di type (sudah ada: `status: string`)
- Update dummy data: tambahkan beberapa surat dengan `status: "draft"` dan `status: "revisi"` di `DUMMY_MAILS` / `DUMMY_MAIL_DETAIL`
- Di toolbar, tombol Edit di-render secara conditional:
  ```
  status === "draft" || status === "revisi" → tampilkan tombol Edit
  status lainnya → sembunyikan tombol Edit (jangan disabled, tapi benar-benar hidden)
  ```
- Toolbar perlu tahu status surat yang dipilih — pass via props dari `persuratan-content.tsx`

### Langkah 5: Visual Polish & Konsistensi

**File:** Semua komponen persuratan

**Tujuan:** Pastikan tampilan konsisten dan menarik.

- Folder sidebar: ikon folder lebih berwarna, hover effect yang smooth
- Mail list table: hover row effect, transisi warna saat select/deselect
- Mail detail panel: typography yang lebih baik untuk content surat, spacing header yang rapi
- Toolbar: grouping visual yang jelas antara aksi utama (kiri) dan aksi kontekstual (kanan)
- Badge/status indicator yang lebih jelas (warna berbeda untuk unread, draft, dll)
- Empty state yang lebih menarik (icon + text centered) untuk mail detail jika belum dipilih

---

## File Change Summary

| Aksi | File |
|------|------|
| **Edit** | `src/components/persuratan/persuratan-content.tsx` — full width layout + resizable panels |
| **Edit** | `src/components/persuratan/mail-toolbar.tsx` — action buttons logic + conditional edit |
| **Edit** | `src/components/persuratan/mail-detail.tsx` — visual polish |
| **Edit** | `src/components/persuratan/mail-list.tsx` — visual polish |
| **Edit** | `src/components/persuratan/mail-folder-tree.tsx` — visual polish |
| **Edit** | `src/lib/dummy/mail-dummy.ts` — tambah data dengan status draft/revisi |
| **Edit** | `src/types/mail.ts` — pastikan status field ada di MailSummaryDto |
| **Baru** | `src/components/ui/resizable.tsx` — jika belum ada (dari shadcn) |

---

## Instruksi untuk Implementor

1. **WAJIB** gunakan skill/MCP tools:
   - **context7** — untuk cek docs shadcn resizable, DropdownMenu, Tailwind spacing, dll
   - **next-devtools** — untuk verifikasi setelah implementasi
2. Ikuti konvensi project: Biome format (tabs), semua teks UI dalam **Bahasa Indonesia**, import alias `@/*`
3. Gunakan komponen UI yang sudah ada di `@/components/ui/` — jangan buat ulang dari nol
4. Referensi komponen yang sudah ada di codebase untuk pattern dan konvensi
5. Jangan ubah logic filtering/pagination yang sudah berjalan — fokus pada UI/UX improvement
6. Test di berbagai ukuran layar untuk memastikan resizable panels bekerja baik

---

## Finalisasi & Verifikasi

Setelah implementasi selesai, **WAJIB** lakukan:

1. **MCP next-devtools** — verifikasi route `/persuratan` dan komponen ter-render dengan benar
2. **Build:** `bun run build` — pastikan **tidak ada error** TypeScript/compile
3. **Lint:** `bun run lint` — fix dengan `bun run format` jika perlu
4. **Visual Check:**
   - Layout full width — tidak ada wasted space kiri/kanan
   - Drag handle antara MailList dan MailDetail berfungsi (resize smooth)
   - Tombol Edit muncul hanya saat pilih surat draft/revisi
   - Tombol Hapus disabled saat tidak ada surat dipilih
   - Tombol Kembalikan disabled saat bukan di folder Deleted Items
   - Dropdown Tindakan terbuka dan menampilkan menu items
   - Semua toast notification tampil dalam Bahasa Indonesia
5. **Jika ada error:** fix semua error sebelum menganggap tugas selesai
