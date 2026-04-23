# PR 3c — Attachments (Upload / Download / Delete)

## Tujuan

Aktifkan tab **Lampiran** di detail panel untuk manage file attachment terkait mail.

## Ruang Lingkup

- List attachment per mail.
- Upload file (multipart) dengan `refType=1` + `refId=<mailId>`.
- Download file (blob trigger).
- Delete attachment dengan konfirmasi.

> **Prasyarat:** PR 1 merged (`attachment-api.ts` + `src/types/attachment.ts`). Independen dari PR 3a/3b — bisa dikerjakan pararel bila tim >1.

## File Change Table

### Hooks (baru)

| Path | Description |
|---|---|
| `src/hooks/persuratan/use-mail-attachments.ts` | `useAttachments(mailId, enabled)` — key `["attachments", 1, mailId]`. Mutations: `useUploadAttachment`, `useDeleteAttachment`. Optional: `useDownloadAttachment` (atau panggil `triggerAttachmentDownload` langsung dari component). |

### Components (baru)

| Path | Description |
|---|---|
| `src/components/persuratan/mail-attachment-list.tsx` | List attachment: nama file + ukuran + tanggal upload + tombol Download / Hapus. Empty state: "Belum ada lampiran." |
| `src/components/persuratan/mail-attachment-uploader.tsx` | Dropzone + file input manual. Validasi: ekstensi + ukuran (reuse rule dari `src/lib/file-rule-api.ts` bila sudah ada). Field opsional `docNotes`. |

### Components (update)

| Path | Change |
|---|---|
| `src/components/persuratan/mail-detail.tsx` | Aktifkan tab **Lampiran** → render `MailAttachmentList` + uploader conditional bila `canManageAttachment(mail, user)`. Counter badge di tab header: `summary.attachmentQty`. |

## Decisions

### D1. `refType` Value

**Keputusan:** `refType = 1` untuk mail attachment.

**ASUMSI:** Konvensi `refType=1` (mail) vs `refType=2` (archive) diambil dari pola umum. Konfirmasi dengan backend / `apidocs/core/attachment.json` saat implementasi. Bila beda, update type `AttachmentRefType` enum di `src/types/attachment.ts`.

### D2. Upload Method

- `FormData`: field `file` (binary) + optional `docNotes` (string).
- Endpoint: `POST /api/proxy/v1/attachments?refType=1&refId=<mailId>`.
- Progress indicator: optional (pakai `XMLHttpRequest.upload` bila butuh, atau skip untuk PR ini).

**Rasional:** Fetch API tidak expose upload progress. Untuk PR 3c, skip progress bar — cukup loading indicator.

### D3. Validasi Client-side

- Reuse `src/lib/file-rule-api.ts` untuk fetch rules (context: "mail-attachment" atau serupa).
- Validasi ekstensi + max size di client **sebelum** upload.
- Bila rule belum tersedia: fallback whitelist default (`pdf, doc, docx, xls, xlsx, jpg, png`) max 10MB + ASUMSI.

### D4. Download UX

Pakai pola `triggerDownload` dari `publication-api.ts`:
1. Fetch blob dari `GET /attachments/{id}/download` (Bearer auto via proxy).
2. Create object URL → anchor click → revoke URL.
3. Loading indicator per-row saat download.

### D5. Delete Konfirmasi

Dialog konfirmasi wajib: "Hapus lampiran [namaFile]?". Setelah sukses: invalidate `["attachments", 1, mailId]` + update `summary.attachmentQty` di list cache (optimistic).

### D6. RBAC

- Tab Lampiran visible untuk **semua** yang bisa baca mail.
- Upload + Delete: `canManageAttachment(mail, user)` (sama dengan `canEditMail` — ownership + status DRAFT; SuperUser override).
- Download: semua pembaca (tidak ada gating khusus).

## Implementation Steps

### Scaffolding
1. Buat `use-mail-attachments.ts`.
2. Buat `mail-attachment-list.tsx` + `mail-attachment-uploader.tsx`.

### Logic
1. Tab Lampiran: `enabled: !!mailId && isTabActive` untuk fetch.
2. Uploader: drag-drop + click-to-select; pre-validate ekstensi/size.
3. Download: `triggerAttachmentDownload` dari `attachment-api.ts`.
4. Delete: konfirmasi dialog + invalidate.

### Styling
- List: row dengan icon file (berdasar ekstensi), nama, ukuran (formatted), tombol aksi di kanan.
- Uploader: dashed border, hover highlight, drag-active state.

### Validation
- Zod: `docNotes: z.string().max(500).optional()`.
- Pre-upload: validasi ekstensi/size; toast error Indonesian bila gagal.

## Verification Checklist

**Build & Quality**
- [ ] `bun run build` + lint + format bersih.

**Manual Test Matrix**

_List_
- [ ] Tab Lampiran → lazy fetch.
- [ ] Badge `summary.attachmentQty` akurat.
- [ ] Empty state tampil bila tidak ada lampiran.

_Upload_
- [ ] Drag-drop valid file → upload sukses + list ter-update.
- [ ] Click-to-select valid file → upload sukses.
- [ ] File ekstensi invalid → toast error + tidak upload.
- [ ] File terlalu besar → toast error.
- [ ] Multiple files drag-drop → semua upload (atau disabled untuk PR 3c — sebutkan batasan di UI).
- [ ] `docNotes` terkirim.

_Download_
- [ ] Klik Download → file terunduh dengan nama asli.
- [ ] Loading indicator tampil saat download.

_Delete_
- [ ] Klik Hapus → konfirmasi → sukses + list ter-update.
- [ ] `summary.attachmentQty` turun di list cache.

_RBAC_
- [ ] Owner + draft: upload/delete aktif.
- [ ] Owner + sent: upload/delete hidden; download tetap aktif.
- [ ] Non-owner: upload/delete hidden; download tetap aktif.
- [ ] Admin/System: upload/delete aktif di semua state.

**Regression**
- [ ] PR 3a (draft) & PR 3b (recipients/send) tetap utuh.
- [ ] Publikasi attachment tidak terdampak (meski pakai API module yang sama, refType beda).
