# Implementasi Template View Mail — Halaman `/persuratan`

## Context

Halaman `/persuratan` saat ini masih stub. Perlu dibuat tampilan **mail viewer** mirip eOffice Mail (lihat screenshot referensi) yang terdiri dari:
- **Sidebar folder** (tree): Inbox, Draft, Read Items, Sent Items, Deleted Items, Personal Folder, dll
- **Mail list** (tabel): daftar surat dalam folder yang dipilih, dengan pagination
- **Mail detail panel** (bawah): preview isi surat saat dipilih dari daftar

Karena API backend sudah tersedia tetapi belum bisa langsung ditest secara lengkap, **gunakan dummy data terlebih dahulu** untuk semua komponen agar bisa di-develop dan di-review tampilan UI-nya.

### Referensi Screenshot

Screenshot menunjukkan layout 3-panel:
1. **Panel kiri** — Mail Folder tree (eOffice Mailbox → Inbox, Draft, Read Items, Sent Items, Deleted Items; Personal Folder → penting, finish-project, dll)
2. **Panel kanan atas** — Tabel surat (kolom: Tgl Pengiriman, Pengirim, Perihal, Tipe, Jenis, Sirkulasi, Batas Respon) + toolbar (Tulis Baru, Tindakan, Edit, filter tanggal, kata kunci, cari)
3. **Panel kanan bawah** — Detail/preview isi mail yang dipilih ("Silahkan pilih Mail untuk melihat isi detailnya..")

---

## API Endpoints (Referensi)

Lihat file API docs di `apidocs/core/`:

### Mail (`apidocs/core/mail.json`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/v1/mails` | Create draft |
| POST | `/api/v1/mails/send` | Send mail (with recipients) |
| PUT | `/api/v1/mails/{id}` | Update draft |
| DELETE | `/api/v1/mails/{id}` | Delete mail |
| POST | `/api/v1/mails/{id}/send` | Send existing draft |
| POST | `/api/v1/mails/{id}/read` | Mark as read |
| POST | `/api/v1/mails/{id}/restore` | Restore from trash |
| GET | `/api/v1/mails/{id}/tracking` | Get tracking info |
| GET | `/api/v1/mails/{id}/thread` | Get thread |
| GET | `/api/v1/mails/{id}/read-status` | Get read status per recipient |
| GET | `/api/v1/mails/search` | Search mails (keyword, type, category, date range, dll) |
| GET | `/api/v1/mails/report` | Report/statistik |

### Mail Folder (`apidocs/core/mail-folder.json`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/mail/folders` | Get folder tree |
| POST | `/api/v1/mail/folders` | Create folder |
| PUT | `/api/v1/mail/folders/{id}` | Rename folder |
| DELETE | `/api/v1/mail/folders/{id}` | Delete folder |
| GET | `/api/v1/mail/folders/{id}/mails` | Get mails in folder (paginated, keyword, sdate, edate, sortBy, sortDir) |
| GET | `/api/v1/mail/folders/counters` | Get unread/total counters per folder |
| PUT | `/api/v1/mail/folders/move` | Move mails between folders |
| DELETE | `/api/v1/mail/trash` | Empty trash |

### Attachment (`apidocs/core/attachment.json`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/attachments?refType=1&refId={mailId}` | Get attachments |
| POST | `/api/v1/attachments?refType=1&refId={mailId}` | Upload attachment (multipart) |
| GET | `/api/v1/attachments/{id}/download` | Download attachment |
| DELETE | `/api/v1/attachments/{id}` | Delete attachment |

### Mail Recipient (`apidocs/core/mail-recipient.json`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/mails/{mailId}/recipients` | Get recipients |
| POST | `/api/v1/mails/{mailId}/recipients` | Add recipient |
| POST | `/api/v1/mails/{mailId}/recipients/batch` | Add batch recipients |
| DELETE | `/api/v1/mails/{mailId}/recipients/{rid}` | Delete recipient |

### Key Data Schemas

**MailSummaryResponse** (list item):
```
id, mailNumber, mailDate, subject, audit{createdBy, createdByName, createdDate},
summary{attachmentQty, toStr}, readStatus, folderId, type{id,name},
category{id,name}, circulationName, thread{rootMailId, parentMailId}, totalCount
```

**MailResponse** (detail):
```
id, mailNumber, mailDate, type{id,name}, category{id,name}, subject, content,
note, maxResponseDate, status, thread{}, summary{}, audit{},
noSuratMasuk, asalSuratMasuk, tglSuratMasuk, tujuanSuratKeluar, penerimaSuratKeluar
```

**MailFolderResponse** (folder tree):
```
id, parentFolderId, ownerId, name, iconCls, system (boolean), unread, total
```

---

## Fase 1: Dummy Data & Layout View (Prioritas)

> **Tujuan:** Buat tampilan lengkap 3-panel dengan dummy data, sehingga layout dan interaksi bisa di-review sebelum integrasi API.

### Langkah 1: Buat Dummy Data (`src/lib/dummy/mail-dummy.ts`)

Buat file berisi data dummy statis yang merepresentasikan data dari API:

- **`DUMMY_FOLDERS`** — Array `MailFolderDto[]`, minimal:
  - System folders: Inbox (unread: 314), Draft (1), Read Items (32), Sent Items (239), Deleted Items (131)
  - Personal folders (parent): penting (9), finish-project (2), Original Data (0), slip (48), kgb (1), PKS Webservice (1), update tarif (1), perdir (2), PKS Langganan (0), peraturan (1)
- **`DUMMY_MAILS`** — Array `MailSummaryDto[]`, minimal 10 item dengan variasi:
  - Field: id, mailDate, subject, pengirim (audit.createdByName), type.name (Internal), category.name (Nota Dinas/UMUM/PUBLIKASI), circulationName (Disposisi/CC), maxResponseDate (nullable), readStatus (0=unread, 1=read), summary.attachmentQty
  - Data harus mirip dengan screenshot: surat internal, berbagai jenis dan sirkulasi
- **`DUMMY_MAIL_DETAIL`** — Object `MailDetailDto` untuk preview, berisi content HTML sederhana
- **`DUMMY_COUNTERS`** — Array `FolderCounterDto[]` matching folder IDs

### Langkah 2: Buat Types (`src/types/mail.ts`)

Definisikan semua interface/type yang diperlukan:

- `MailFolderDto` — `{ id, parentFolderId, ownerId, name, iconCls, system, unread, total }`
- `MailSummaryDto` — Sesuai MailSummaryResponse dari API
- `MailDetailDto` — Sesuai MailResponse dari API
- `MailAuditInfo` — `{ createdBy, createdByName, createdDate, updatedDate }`
- `MailSummaryInfo` — `{ attachmentQty, toStr }`
- `MailTypeLookup`, `MailCategoryLookup` — `{ id, name }`
- `MailThreadInfo` — `{ rootMailId, parentMailId }`
- `FolderCounterDto` — `{ folderId, folderName, unread, total }`
- `MailSearchParams` — `{ keyword?, mailTypeId?, mailCategoryId?, startDate?, endDate?, page, size, sortBy?, sortDir? }`

### Langkah 3: Buat Komponen Folder Sidebar (`src/components/persuratan/mail-folder-tree.tsx`)

Komponen sidebar folder tree:

- Render folder tree recursive (parent → children via parentFolderId)
- System folders di atas, Personal Folder di bawah
- Setiap folder tampilkan: icon (mail icon), nama, counter badge (unread count)
- **Selected state:** folder aktif di-highlight
- **Klik folder:** set selected folder → trigger refresh mail list
- Sementara pakai `DUMMY_FOLDERS` langsung

**Referensi UI:** Lihat screenshot panel kiri — tree dengan indentasi, icon mail, counter dalam kurung

### Langkah 4: Buat Komponen Mail List Table (`src/components/persuratan/mail-list.tsx`)

Komponen tabel daftar surat:

- **Kolom** (sesuai screenshot):
  | Kolom | Field | Sortable |
  |-------|-------|----------|
  | Tgl Pengiriman | `audit.createdDate` atau `mailDate` | Ya |
  | Pengirim | `audit.createdByName` | Ya |
  | Perihal | `subject` | Ya |
  | Tipe | `type.name` | Tidak |
  | Jenis | `category.name` | Tidak |
  | Sirkulasi | `circulationName` | Tidak |
  | Batas Respon | `maxResponseDate` | Ya |

- **Row styling:** Unread rows (readStatus=0) di-bold, read rows normal
- **Row click:** Set selected mail → tampilkan detail di panel bawah
- **Selected row:** Highlight biru (lihat screenshot)
- Pagination di bawah tabel: "Page X of Y", prev/next buttons, "Displaying X - Y of Z"
- Sementara pakai `DUMMY_MAILS`

### Langkah 5: Buat Komponen Toolbar (`src/components/persuratan/mail-toolbar.tsx`)

Toolbar di atas mail list:

- **Tombol aksi:** Tulis Baru, Tindakan (dropdown), Edit
- **Filter tanggal:** "Surat Dari Tanggal" + date input + "s.d" + date input
- **Search:** "Kata Kunci" + text input + tombol "Cari"
- **Tombol kanan:** Hapus, Respon, Kembalikan (sesuai screenshot)
- Semua tombol sementara hanya console.log atau toast placeholder

### Langkah 6: Buat Komponen Mail Detail Panel (`src/components/persuratan/mail-detail.tsx`)

Panel preview detail surat (bagian bawah):

- **Default state:** Tampilkan pesan "Silahkan pilih Mail untuk melihat isi detailnya.."
- **Saat mail dipilih:** Tampilkan detail surat:
  - Header: nomor surat, tanggal, pengirim, perihal
  - Body: content (HTML rendered)
  - Footer: info sirkulasi, attachment list (jika ada)
- Sementara pakai `DUMMY_MAIL_DETAIL`

### Langkah 7: Buat Komponen Utama (`src/components/persuratan/persuratan-content.tsx`)

Komponen container yang menyusun semua panel:

- **Layout 3-panel** menggunakan CSS grid atau flex:
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
- Sidebar lebar fix ±200-250px, resizable jika memungkinkan
- Panel kanan dibagi 2 secara vertikal: tabel atas ± 60%, detail bawah ± 40%
- Gunakan komponen `Card` dari UI library jika sesuai
- **State management:**
  - `selectedFolderId` — folder yang aktif
  - `selectedMailId` — mail yang dipilih untuk detail
  - Filter/search state (keyword, dateRange)
  - Pagination state (page, size)

### Langkah 8: Update Route Page (`src/app/(main)/persuratan/page.tsx`)

Update file page yang sudah ada:

- Import dan render `PersuratanContent`
- Export `dynamic = "force-dynamic"`
- Ikuti pattern dari `src/app/(main)/publikasi/page.tsx`

---

## Fase 2: Integrasi API (Setelah Fase 1 di-review)

> **Catatan:** Fase ini dikerjakan SETELAH layout Fase 1 selesai dan di-approve.

### Langkah 9: Buat API Service (`src/lib/mail-api.ts`)

Buat fungsi-fungsi fetch ke backend:

- `fetchFolders()` → GET `/api/proxy/v1/mail/folders`
- `fetchFolderMails(folderId, params)` → GET `/api/proxy/v1/mail/folders/{id}/mails`
- `fetchFolderCounters()` → GET `/api/proxy/v1/mail/folders/counters`
- `fetchMail(id)` → detail surat (perlu cek endpoint, kemungkinan dari search/thread)
- `searchMails(params)` → GET `/api/proxy/v1/mails/search`
- `markAsRead(id)` → POST `/api/proxy/v1/mails/{id}/read`
- `deleteMail(id)` → DELETE `/api/proxy/v1/mails/{id}`
- `restoreMail(id)` → POST `/api/proxy/v1/mails/{id}/restore`
- `moveMails(payload)` → PUT `/api/proxy/v1/mail/folders/move`

Ikuti pattern dari `src/lib/publication-api.ts` — error messages dalam Bahasa Indonesia.

### Langkah 10: Buat Hooks (`src/hooks/mail-hooks.tsx`)

Buat TanStack Query hooks:

- `useFolders()` — useQuery folder tree
- `useFolderMails(folderId, params)` — useQuery mails dalam folder
- `useFolderCounters()` — useQuery counters
- `useMailDetail(mailId)` — useQuery detail surat
- `useMarkAsRead()` — useMutation
- `useDeleteMail()` — useMutation
- `useMailContent()` — Orchestrator hook (gabungkan semua state & data)

Ikuti pattern dari `src/hooks/publication-hooks.tsx`.

### Langkah 11: Ganti Dummy Data dengan Hooks

- Replace `DUMMY_FOLDERS` → `useFolders()`
- Replace `DUMMY_MAILS` → `useFolderMails(selectedFolderId)`
- Replace `DUMMY_MAIL_DETAIL` → `useMailDetail(selectedMailId)`
- Replace `DUMMY_COUNTERS` → `useFolderCounters()`

---

## File Change Summary

### Fase 1 (Dummy)
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
| **Hapus/Replace** | `src/components/persuratan/topbar.tsx` (tidak dipakai lagi) |

### Fase 2 (Integrasi API)
| Aksi | File |
|------|------|
| **Baru** | `src/lib/mail-api.ts` |
| **Baru** | `src/hooks/mail-hooks.tsx` |
| **Edit** | `src/components/persuratan/persuratan-content.tsx` (ganti dummy → hooks) |
| **Edit** | Semua komponen child (ganti props dari dummy → live data) |
| **Hapus** | `src/lib/dummy/mail-dummy.ts` (setelah tidak dipakai) |

---

## Instruksi untuk Implementor

1. **PENTING:** Gunakan skill/MCP tools (context7, next-devtools) untuk referensi API dan dokumentasi library selama implementasi.
2. Ikuti konvensi project: Biome format (tabs), semua teks UI dalam **Bahasa Indonesia**, import alias `@/*`.
3. Gunakan komponen UI yang sudah ada: `Card`, `Button`, `Badge`, `Input`, `DataTable`, `DataTablePagination`, `TooltipButton` dari `@/components/ui/`.
4. State management: URL query state untuk pagination/filter (pakai `usePagination` dari `src/hooks/use-pagination.ts`), local state untuk selection (selectedFolder, selectedMail).
5. Referensi pattern: lihat `src/components/publication/publication-content.tsx` untuk struktur komponen utama.
6. Pastikan responsive: sidebar bisa collapse di mobile, tabel horizontal scroll.
7. **Finalisasi:** Setelah implementasi, jalankan `bun run build` dan `bun run lint` untuk memastikan tidak ada error.

---

## Verifikasi

1. **Build:** `bun run build` — tidak ada error TypeScript
2. **Lint:** `bun run lint` — tidak ada linting error
3. **Visual Check:**
   - Navigasi ke `/persuratan` — layout 3-panel tampil benar
   - Sidebar folder tree tampil dengan counter
   - Klik folder → mail list berubah
   - Klik mail row → detail panel menampilkan isi
   - Toolbar tampil dengan tombol dan filter
   - Pagination berfungsi
   - Row unread tampil bold, row selected di-highlight
4. **Responsiveness:** Tampilan tidak rusak di berbagai ukuran layar
