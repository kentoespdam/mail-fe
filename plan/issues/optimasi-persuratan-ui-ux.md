# Optimasi Tampilan PersuratanContent — User Friendly & Compact

## Context

Halaman `/persuratan` sudah selesai Fase 1 (layout 3-panel, dummy data, DataTable, resizable panels). Sekarang perlu **optimasi tampilan** agar lebih mirip referensi eOffice (lihat screenshot) — lebih **user friendly, rapi, compact, dan menarik**.

### Referensi Visual (eOffice Screenshot)

```
+------------------+---------------------------------------------------------------+
| Mail Folder      | [Tulis Baru] [Tindakan v] [Edit]   Surat Dari Tanggal:       |
|                  |  [ __/__/____ ] s.d [ __/__/____ ] Kata Kunci: [____] [Cari]  |
| eOffice Mailbox  |   [Hapus] [Respon] [Kembalikan]                               |
|   Inbox (0/314)  +---------------------------------------------------------------+
|   Draft (1)      | Tgl Pengiriman | Pengirim      | Perihal       | Tipe | Jenis |
|   Read Items(32) | Nov 04, 2021   | PURNAWAN S.   | Fwd: Perm...  | Int  | Nota  |
|   Sent Items(239)| Nov 12, 2021   | Administrator | Publikasi baru| Int  | PUBLI |
|   Deleted (131)  | Dec 07, 2021   | ABDUL AZIZ M. | Fwd: Data M.. | Int  | UMUM  |
|                  | ...            | ...           | ...           | ...  | ...   |
| Personal Folder  |-------[ Page 1 of 4 ] [>] [>>]------- Displaying 1-100 of 313|
|   penting (9)    +---------------------------------------------------------------+
|   finish-proj(2) | Silahkan pilih Mail untuk melihat isi detailnya..             |
|   Original (0)   |                                                               |
|   slip (48)      |                                                               |
|   kgb (1)        |                                                               |
|   PKS Webserv(1) |                                                               |
|   update tarif(1)|                                                               |
|   perdir (2)     |                                                               |
|   PKS Langg (0)  |                                                               |
|   peraturan (1)  |                                                               |
+------------------+---------------------------------------------------------------+
```

**Poin penting dari referensi:**
1. **Mail list sangat compact** — row height kecil, data padat, banyak item terlihat sekaligus
2. **Kolom terstruktur jelas** — Tgl Pengiriman, Pengirim, Perihal, Tipe, Jenis, Sirkulasi, Batas Respon
3. **Folder tree sederhana** — flat list dengan counter, icon kecil, tanpa excessive padding
4. **Toolbar satu/dua baris** — tombol aksi dan filter date+keyword dalam area compact
5. **Detail panel minimalis** — hanya tampil saat dipilih, pesan placeholder singkat saat kosong
6. **Paginasi ringkas** — "Page X of Y" + navigasi + "Displaying X-Y of Z"

### File yang Sudah Ada

| File | Deskripsi |
|------|-----------|
| `src/components/persuratan/persuratan-content.tsx` | Container utama 3-panel |
| `src/components/persuratan/mail-toolbar.tsx` | Toolbar aksi & filter |
| `src/components/persuratan/mail-list.tsx` | DataTable daftar surat |
| `src/components/persuratan/mail-detail.tsx` | Panel preview detail surat |
| `src/components/persuratan/mail-folder-tree.tsx` | Sidebar folder tree |
| `src/components/ui/data-table.tsx` | DataTable reusable component |
| `src/types/mail.ts` | Type definitions |
| `src/lib/dummy/mail-dummy.ts` | Dummy data |

---

## Langkah Implementasi

> **WAJIB:** Gunakan skill/MCP tools selama implementasi:
> - **context7** — untuk referensi docs library (Tailwind CSS, shadcn, TanStack Table, dll). Contoh: `npx ctx7@latest library "tailwind css" "compact table spacing"` lalu `npx ctx7@latest docs <id> "query"`
> - **next-devtools** — untuk verifikasi route, error, dan render setelah implementasi. Gunakan `get_errors`, `get_routes`, `get_page_metadata`

### Langkah 1: Compact Folder Tree Sidebar

**File:** `src/components/persuratan/mail-folder-tree.tsx`

**Tujuan:** Buat folder tree lebih compact dan mirip referensi — flat, ringkas, counter jelas.

- Kurangi padding item folder: target `py-1 px-2` (bukan `py-2 px-3`)
- Kurangi ukuran icon folder: `size={14}` atau `size={12}` (sesuaikan dengan kompaktnya row)
- Kurangi font size: `text-xs` untuk nama folder
- Counter (unread) lebih kecil: `text-[10px]`, tampilkan format `(unread/total)` jika data tersedia, atau `(count)` saja
- Kurangi indentasi child folder: `ml-3` bukan `ml-4`
- Pastikan hover effect tetap smooth tapi area hover lebih slim
- Header "Folders" lebih compact: kurangi padding `p-2` bukan `p-3`

### Langkah 2: Compact Toolbar

**File:** `src/components/persuratan/mail-toolbar.tsx`

**Tujuan:** Buat toolbar lebih compact — tombol aksi dan filter dalam area seminimal mungkin.

- **Baris 1 (Aksi + Filter):** Gabungkan tombol aksi dan filter date+keyword dalam **satu baris** jika memungkinkan
  - Kiri: `[Tulis Baru] [Tindakan v] [Edit]`
  - Tengah/Kanan: `Surat Dari Tanggal: [__] s.d [__] | Kata Kunci: [__] [Cari]`
  - Paling kanan: `[Hapus] [Respon] [Kembalikan]`
- Jika tidak muat satu baris, maksimal **dua baris** yang compact
- Kurangi tinggi tombol: gunakan `h-7` atau `size="xs"`
- Kurangi gap: `gap-1` antar tombol, `gap-1.5` antar grup
- Kurangi padding container: `px-2 py-1.5`
- Font input dan label: `text-[11px]` untuk label, `text-xs` untuk input
- Hilangkan label yang redundant jika sudah ada placeholder
- Pastikan semua tombol tetap accessible dan readable meskipun compact

### Langkah 3: Compact Mail List (DataTable)

**File:** `src/components/persuratan/mail-list.tsx`

**Tujuan:** Buat tabel daftar surat lebih padat sehingga banyak item terlihat sekaligus (mirip referensi yang menampilkan ~10 item di area kecil).

- Kurangi padding cell: target `py-1` atau `py-1.5` (bukan default padding)
- Font size cell: `text-[11px]` atau `text-xs` untuk semua kolom
- Header kolom: `text-[10px]` uppercase, compact height
- Kurangi max-width kolom Perihal agar kolom lain punya ruang: sesuaikan proporsi
- Badge (Jenis/Kategori): `text-[9px] px-1 py-0`  — sangat kecil tapi readable
- Unread dot indicator: lebih kecil `w-1.5 h-1.5`
- Selected row: highlight subtle (jangan terlalu kontras) — `bg-primary/5` cukup
- Hapus excessive wrapper padding: `p-2` pada wrapper div bisa dikurangi ke `p-1` atau dihapus
- Pastikan column widths proporsional mengikuti referensi: Tgl Pengiriman (medium), Pengirim (medium), Perihal (wide), Tipe (narrow), Jenis (narrow), Sirkulasi (narrow), Batas Respon (medium)

### Langkah 4: Compact Mail Detail Panel

**File:** `src/components/persuratan/mail-detail.tsx`

**Tujuan:** Buat detail panel lebih compact — header metadata ringkas, content area memaksimalkan ruang.

- **Empty state:** Lebih sederhana dan singkat — cukup teks "Silahkan pilih Mail untuk melihat isi detailnya.." (seperti referensi), tanpa icon besar atau box berlebihan
- **Header metadata:** Compact satu-dua baris — Subject + nomor surat + tanggal dalam area kecil
- Kurangi font size judul: `text-lg` bukan `text-2xl`
- Badge kategori dan date: inline dalam satu baris, `text-[10px]`
- **Sender info:** Compact — avatar lebih kecil atau dihilangkan, cukup nama pengirim dalam satu baris
- **Content area:** Kurangi padding prose: `p-3` bukan `p-6`
- **Footer (sirkulasi/lampiran/deadline):** Inline compact, `text-[11px]`
- Kurangi spacing antar section — hapus gap/separator yang berlebihan
- Scroll area tetap smooth untuk content panjang

### Langkah 5: Optimasi Panel Proportions

**File:** `src/components/persuratan/persuratan-content.tsx`

**Tujuan:** Sesuaikan proporsi default panel agar mirip referensi.

- **Sidebar:** Pertahankan `defaultSize={15}` — cukup untuk folder tree
- **Horizontal split:** Pertahankan `defaultSize={85}` untuk main content
- **Vertical split (MailList vs MailDetail):**
  - Mail List: naikkan ke `defaultSize={45}` atau `50%` (referensi menampilkan list lebih besar)
  - Mail Detail: turunkan ke `defaultSize={35}` atau `30%`
  - Ini membuat lebih banyak email terlihat sekaligus
- Kurangi `minSize` mail list ke `25%` agar detail bisa diperbesar jika user mau
- Hapus padding wrapper yang tidak perlu: `p-2` di wrapper MailList dan MailDetail bisa dikurangi ke `p-1` atau `p-0`
- Pastikan resize handle tetap visible dan mudah digunakan

### Langkah 6: Tambah Dummy Data

**File:** `src/lib/dummy/mail-dummy.ts`

**Tujuan:** Tambah lebih banyak dummy mail agar tampilan list terlihat realistis (referensi menampilkan ~10+ item).

- Tambah minimal **10-15 dummy mails** di `DUMMY_MAILS` untuk folder inbox
- Variasikan data: berbagai pengirim, subject, tanggal, tipe, kategori
- Beberapa mail unread (`status: "SENT"`), beberapa read (`status: "READ"`)
- Beberapa dengan `maxResponseDate`, beberapa tanpa
- Pastikan data cukup untuk menunjukkan pagination (lebih dari 10 item)
- Tambah dummy mails untuk folder lain (draft, sent) agar folder tree counter realistis

---

## File Change Summary

| Aksi | File | Perubahan |
|------|------|-----------|
| **Edit** | `src/components/persuratan/mail-folder-tree.tsx` | Compact padding, font, icon, counter |
| **Edit** | `src/components/persuratan/mail-toolbar.tsx` | Gabung baris, compact buttons, compact filter |
| **Edit** | `src/components/persuratan/mail-list.tsx` | Compact cell padding, font size, column width |
| **Edit** | `src/components/persuratan/mail-detail.tsx` | Compact header, simple empty state, less spacing |
| **Edit** | `src/components/persuratan/persuratan-content.tsx` | Panel proportions, reduce wrapper padding |
| **Edit** | `src/lib/dummy/mail-dummy.ts` | Tambah 10-15 dummy mails |

---

## Instruksi untuk Implementor

1. **WAJIB** gunakan skill/MCP tools selama implementasi:
   - **context7** — untuk referensi docs Tailwind CSS spacing/sizing, shadcn component API, TanStack Table customization
   - **next-devtools** — untuk verifikasi route, error check, dan page metadata setelah implementasi
2. Ikuti konvensi project: Biome format (tabs), semua teks UI dalam **Bahasa Indonesia**, import alias `@/*`
3. Gunakan komponen UI yang sudah ada di `@/components/ui/` — jangan buat komponen baru
4. **Jangan ubah logic/fungsionalitas** yang sudah berjalan — fokus hanya pada visual/spacing/sizing
5. Referensi screenshot eOffice sebagai target visual — compact, clean, informasi padat
6. Perhatikan readability — compact bukan berarti tidak terbaca. Pastikan teks minimal `text-[10px]` dan ada contrast yang cukup
7. Test resize panel setelah perubahan proporsi — pastikan tidak ada overflow atau layout break

---

## Finalisasi & Verifikasi

Setelah implementasi selesai, **WAJIB** lakukan:

1. **MCP next-devtools:**
   - `get_errors` — pastikan tidak ada runtime/build error
   - `get_routes` — verifikasi route `/persuratan` masih terdaftar
   - `get_page_metadata` — verifikasi komponen ter-render dengan benar
2. **Build:** `bun run build` — pastikan **tidak ada error** TypeScript/compile
3. **Lint:** `bun run lint` — fix dengan `bun run format` jika perlu
4. **Visual Check:**
   - [ ] Folder tree lebih compact — item lebih slim, counter terlihat
   - [ ] Toolbar lebih compact — maksimal 2 baris, tombol lebih kecil
   - [ ] Mail list lebih padat — banyak row terlihat sekaligus, row height kecil
   - [ ] Mail detail compact — header ringkas, empty state sederhana
   - [ ] Panel proporsi: mail list lebih besar dari detail (mirip referensi)
   - [ ] Resize panels tetap berfungsi smooth
   - [ ] Sorting, pagination, search tetap berfungsi normal
   - [ ] Unread/selected row styling tetap terlihat
   - [ ] Semua teks readable meskipun compact
   - [ ] Tidak ada overflow, scroll break, atau layout rusak
5. **Jika ada error:** fix semua error sebelum menganggap tugas selesai
