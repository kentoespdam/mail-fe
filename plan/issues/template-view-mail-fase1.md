# Implementasi Template View Mail — Fase 1: Dummy Data & Layout

## Context

Halaman `/persuratan` saat ini masih stub (`<div>View Persuratan</div>`). Perlu dibangun tampilan **mail viewer** layout 3-panel dengan dummy data, sehingga layout dan interaksi bisa di-review sebelum integrasi API (Fase 2).

### Referensi Layout

```
┌──────────────┬─────────────────────────────────────────┐
│              │ [Toolbar]                               │
│  Folder      ├─────────────────────────────────────────┤
│  Sidebar     │ [Mail List Table]                       │
│              │                                         │
│  (±200px)    ├─────────────────────────────────────────┤
│              │ [Mail Detail Panel]                     │
│              │                                         │
└──────────────┴─────────────────────────────────────────┘
```

- **Panel kiri** — Mail Folder tree (Inbox, Draft, Read Items, Sent Items, Deleted Items, Personal Folder, dll)
- **Panel kanan atas** — Toolbar + Tabel surat (Tgl Pengiriman, Pengirim, Perihal, Tipe, Jenis, Sirkulasi, Batas Respon)
- **Panel kanan bawah** — Detail/preview isi mail yang dipilih

### Referensi Pattern

Ikuti pattern dari fitur yang sudah ada:

| Referensi | File |
|-----------|------|
| Komponen utama | `src/components/publication/publication-content.tsx` |
| Page route | `src/app/(main)/publikasi/page.tsx` |
| UI components | `src/components/ui/` (Card, Button, Badge, Input, DataTable, dll) |
| Pagination hook | `src/hooks/use-pagination.ts` |
| Types pattern | `src/types/mail-type.ts`, `src/types/commons.ts` |

### API Schema (untuk referensi dummy data)

Lihat detail lengkap di `plan/ui/template-view-mail.md` bagian **API Endpoints** dan **Key Data Schemas**.

---

## Langkah Implementasi

> **PENTING:** Gunakan skill/MCP tools (context7, next-devtools) untuk referensi API dan dokumentasi library selama implementasi. Contoh:
> - Gunakan **context7** untuk cek docs shadcn, TanStack Table, Tailwind, dll
> - Gunakan **next-devtools** untuk verifikasi route dan komponen

### Langkah 1: Buat Types (`src/types/mail.ts`)

Buat semua interface/type yang diperlukan untuk fitur persuratan:

- `MailFolderDto` — `{ id: string, parentFolderId: string | null, ownerId: string, name: string, iconCls: string, system: boolean, unread: number, total: number }`
- `MailSummaryDto` — Sesuai MailSummaryResponse: `{ id, mailNumber, mailDate, subject, audit: MailAuditInfo, summary: MailSummaryInfo, readStatus: number, folderId, type: MailTypeLookup, category: MailCategoryLookup, circulationName, thread: MailThreadInfo, totalCount }`
- `MailDetailDto` — Sesuai MailResponse: `{ id, mailNumber, mailDate, type, category, subject, content, note, maxResponseDate, status, thread, summary, audit, noSuratMasuk, asalSuratMasuk, tglSuratMasuk, tujuanSuratKeluar, penerimaSuratKeluar }`
- `MailAuditInfo` — `{ createdBy, createdByName, createdDate, updatedDate }`
- `MailSummaryInfo` — `{ attachmentQty: number, toStr: string }`
- `MailTypeLookup`, `MailCategoryLookup` — `{ id: string, name: string }`
- `MailThreadInfo` — `{ rootMailId: string | null, parentMailId: string | null }`
- `FolderCounterDto` — `{ folderId: string, folderName: string, unread: number, total: number }`
- `MailSearchParams` — `{ keyword?, mailTypeId?, mailCategoryId?, startDate?, endDate?, page, size, sortBy?, sortDir? }`

Referensi: `src/types/mail-type.ts` untuk konvensi penamaan.

### Langkah 2: Buat Dummy Data (`src/lib/dummy/mail-dummy.ts`)

Buat file berisi data dummy statis yang merepresentasikan data dari API:

- **`DUMMY_FOLDERS`** — Array `MailFolderDto[]`:
  - System folders: Inbox (unread: 314), Draft (1), Read Items (32), Sent Items (239), Deleted Items (131)
  - Personal folders (parent group): penting (9), finish-project (2), Original Data (0), slip (48), kgb (1), PKS Webservice (1), update tarif (1), perdir (2), PKS Langganan (0), peraturan (1)
  - Gunakan `parentFolderId` untuk relasi parent-child (system folders punya parent "eoffice-mailbox", personal punya parent "personal-folder")
- **`DUMMY_MAILS`** — Array `MailSummaryDto[]`, minimal 10 item:
  - Variasi: beberapa unread (readStatus=0), beberapa read (readStatus=1)
  - Variasi type: Internal
  - Variasi category: Nota Dinas, UMUM, PUBLIKASI
  - Variasi sirkulasi: Disposisi, CC
  - Beberapa dengan `maxResponseDate`, beberapa null
  - Beberapa dengan attachment (`summary.attachmentQty > 0`)
- **`DUMMY_MAIL_DETAIL`** — Object `MailDetailDto` untuk preview, berisi content HTML sederhana
- **`DUMMY_COUNTERS`** — Array `FolderCounterDto[]` matching folder IDs

### Langkah 3: Buat Komponen Folder Sidebar (`src/components/persuratan/mail-folder-tree.tsx`)

Komponen sidebar folder tree:

- Render folder tree secara recursive (parent → children via `parentFolderId`)
- System folders (eOffice Mailbox) di atas, Personal Folder di bawah
- Setiap folder tampilkan: icon, nama, counter badge (unread count) dalam kurung
- **Selected state:** folder aktif di-highlight dengan background color
- **Klik folder:** panggil callback `onSelectFolder(folderId)`
- Sementara terima `DUMMY_FOLDERS` via props
- Gunakan komponen yang sudah ada: `Button`, `Badge`, `ScrollArea` dari `@/components/ui/`

### Langkah 4: Buat Komponen Mail List Table (`src/components/persuratan/mail-list.tsx`)

Komponen tabel daftar surat:

- **Kolom** (sesuai referensi screenshot):

  | Kolom | Field | Sortable |
  |-------|-------|----------|
  | Tgl Pengiriman | `mailDate` atau `audit.createdDate` | Ya |
  | Pengirim | `audit.createdByName` | Ya |
  | Perihal | `subject` | Ya |
  | Tipe | `type.name` | Tidak |
  | Jenis | `category.name` | Tidak |
  | Sirkulasi | `circulationName` | Tidak |
  | Batas Respon | `maxResponseDate` | Ya |

- **Row styling:** Unread rows (`readStatus === 0`) di-bold, read rows normal weight
- **Row click:** Panggil callback `onSelectMail(mailId)`
- **Selected row:** Highlight background biru
- Gunakan komponen `DataTable` dan `DataTablePagination` dari `@/components/ui/` jika cocok, atau buat custom table dengan TanStack Table
- Pagination di bawah tabel: "Page X of Y", prev/next, "Displaying X - Y of Z"
- Sementara terima `DUMMY_MAILS` via props

### Langkah 5: Buat Komponen Toolbar (`src/components/persuratan/mail-toolbar.tsx`)

Toolbar di atas mail list:

- **Tombol aksi (kiri):** Tulis Baru, Tindakan (dropdown placeholder), Edit
- **Filter tanggal:** Label "Surat Dari Tanggal" + date input + "s.d" + date input
- **Search:** Label "Kata Kunci" + text input + tombol "Cari"
- **Tombol kanan:** Hapus, Respon, Kembalikan
- Semua tombol sementara hanya `console.log` atau toast placeholder ("Fitur belum tersedia")
- Callbacks via props: `onSearch`, `onDateFilter`, `onAction`
- Gunakan komponen: `Button`, `Input`, `TooltipButton` dari `@/components/ui/`
- Icon dari `@tabler/icons-react`

### Langkah 6: Buat Komponen Mail Detail Panel (`src/components/persuratan/mail-detail.tsx`)

Panel preview detail surat (bagian bawah):

- **Default state** (tidak ada mail dipilih): Tampilkan pesan centered "Silahkan pilih Mail untuk melihat isi detailnya.."
- **Saat mail dipilih:** Tampilkan:
  - Header: nomor surat, tanggal, pengirim, perihal
  - Body: content (HTML rendered via `dangerouslySetInnerHTML`)
  - Footer: info sirkulasi, jumlah attachment
- Terima `selectedMail: MailDetailDto | null` via props
- Gunakan komponen `Card`, `ScrollArea` dari `@/components/ui/`

### Langkah 7: Buat Komponen Utama (`src/components/persuratan/persuratan-content.tsx`)

Komponen container yang menyusun semua panel:

- **Layout 3-panel** menggunakan CSS grid atau flex:
  - Sidebar lebar fix ±200-250px
  - Panel kanan dibagi 2 vertikal: tabel atas ±60%, detail bawah ±40%
- **State management** (local state):
  - `selectedFolderId` — folder yang aktif (default: Inbox)
  - `selectedMailId` — mail yang dipilih untuk detail (default: null)
  - Filter/search state: `keyword`, `startDate`, `endDate`
  - Pagination state: `page`, `size`
- **Wiring:** Hubungkan state ke semua child components via props/callbacks
- Import dan gunakan semua komponen dari Langkah 3-6
- Import dummy data dari `src/lib/dummy/mail-dummy.ts`
- Gunakan `Card` sebagai wrapper panel jika sesuai

### Langkah 8: Update Route Page (`src/app/(main)/persuratan/page.tsx`)

Update file page yang sudah ada:

- Import dan render `PersuratanContent`
- Export `dynamic = "force-dynamic"`
- Referensi pattern: `src/app/(main)/publikasi/page.tsx`

---

## File Change Summary

| Aksi | File |
|------|------|
| **Baru** | `src/types/mail.ts` |
| **Baru** | `src/lib/dummy/mail-dummy.ts` |
| **Baru** | `src/components/persuratan/mail-folder-tree.tsx` |
| **Baru** | `src/components/persuratan/mail-list.tsx` |
| **Baru** | `src/components/persuratan/mail-toolbar.tsx` |
| **Baru** | `src/components/persuratan/mail-detail.tsx` |
| **Baru** | `src/components/persuratan/persuratan-content.tsx` |
| **Edit** | `src/app/(main)/persuratan/page.tsx` |

---

## Instruksi untuk Implementor

1. **WAJIB** gunakan skill/MCP tools selama implementasi:
   - **context7** — untuk referensi docs library (shadcn, TanStack Table, Tailwind CSS, dll). Contoh: cek API DataTable, cara pakai ScrollArea, dll.
   - **next-devtools** — untuk verifikasi route dan komponen setelah implementasi.
2. Ikuti konvensi project: Biome format (tabs), semua teks UI dalam **Bahasa Indonesia**, import alias `@/*`.
3. Gunakan komponen UI yang sudah ada di `@/components/ui/` — jangan buat ulang dari nol.
4. Referensi file-file yang sudah ada (publication-content, mail-type, dll) untuk pattern dan konvensi.
5. State management: local state (`useState`) untuk selection dan filter. Nanti di Fase 2 akan diganti hooks.
6. Pastikan layout responsive: sidebar bisa collapse di layar kecil, tabel horizontal scroll.

---

## Finalisasi & Verifikasi

Setelah implementasi selesai, **WAJIB** lakukan langkah berikut:

1. **Gunakan MCP next-devtools** untuk verifikasi route `/persuratan` terdaftar dan komponen ter-render
2. **Build:** Jalankan `bun run build` — pastikan **tidak ada error** TypeScript/compile
3. **Lint:** Jalankan `bun run lint` — pastikan tidak ada linting error (gunakan `bun run format` jika perlu fix otomatis)
4. **Visual Check** (manual):
   - Navigasi ke `/persuratan` — layout 3-panel tampil benar
   - Sidebar folder tree tampil dengan counter
   - Klik folder → mail list berubah (filter by folderId)
   - Klik mail row → detail panel menampilkan isi
   - Toolbar tampil dengan tombol dan filter
   - Pagination berfungsi
   - Row unread tampil **bold**, row selected di-highlight
5. **Jika ada error:** fix semua error sebelum menganggap tugas selesai
