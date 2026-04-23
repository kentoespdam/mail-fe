# PR 3b — Recipients Management + Send

## Tujuan

Lengkapi flow compose dengan **recipients** dan aksi **send**.

## Ruang Lingkup

- Sheet recipients: list + add single + add batch + delete single + delete batch + update notif flags.
- Tombol aksi: Copy dari thread (`/recipients/copy-thread/{refId}`), Copy dari surat lain (`/copy-from/{refId}`).
- Kirim dari draft (`POST /api/v1/mails/{id}/send`).
- Kirim langsung (tanpa draft) dengan recipients bundled (`POST /api/v1/mails/send`).

> **Prasyarat:** PR 3a merged. `mail-recipient-api.ts` tersedia dari shared foundation (PR 1).

## File Change Table

### Hooks (baru)

| Path | Description |
|---|---|
| `src/hooks/persuratan/use-mail-recipients.ts` | `useRecipients(mailId, enabled)` + mutations: `useAddRecipient`, `useAddRecipientsBatch`, `useDeleteRecipient`, `useDeleteRecipientsBatch`, `useUpdateNotifFlags`, `useCopyThread`, `useCopyFrom`. |

### Hooks (update)

| Path | Change |
|---|---|
| `src/hooks/persuratan/use-mail-mutations.ts` | Tambah `useSendFromDraft` (`POST /mails/{id}/send`) + `useSendMailDirect` (`POST /mails/send`). |

### Components (baru)

| Path | Description |
|---|---|
| `src/components/persuratan/mail-recipient-sheet.tsx` | Sheet (right side, desktop) / full-screen (mobile). Tabs: **Daftar Penerima** + **Tambah Manual** + **Salin dari surat referensi**. List recipient dengan checkbox untuk batch delete; inline notif flag (email/sms/push). |
| `src/components/persuratan/recipient-picker.tsx` | Subcomponent: input `empIds[]` + `circulation` + optional note. Field `empId` = input manual sementara (ASUMSI D di index — backend employee lookup belum pasti). |

### Components (update)

| Path | Change |
|---|---|
| `src/components/persuratan/mail-compose-dialog.tsx` | Tambah tombol ketiga: **Kirim** (muncul bila mode=edit + recipients.count > 0). Klik Kirim = sendFromDraft. Tombol **Kirim Langsung** (mode=create) → bundle recipients inline via `MailSendRequest`. |
| `src/components/persuratan/mail-detail.tsx` | Aktifkan tab **Penerima** → render `MailRecipientSheet` inline di panel atau buka Sheet via tombol "Kelola Penerima". Tombol gating: `canEditMail()`. Bila `mail.status==="DRAFT"` tambah tombol **Kirim** di header detail. |

## Decisions

### D1. Recipient Data Entry (manual vs lookup)

**Keputusan:** PR 3b pakai input `empId` manual (user ketik ID employee). Picker employee dari backend tidak di-scope di sini.

**Rasional:** ASUMSI D plan awal — endpoint employee lookup belum terkonfirmasi di `apidocs/core/`.

**UX:** Input `empId` + bantuan teks "Masukkan ID pegawai (contoh: EMP001)". Setelah add, tampil nama dari response backend (bila ada) atau `empId` saja.

**Follow-up (post-PR 3b):** Bila endpoint employee lookup tersedia, ganti input dengan Combobox + async search. Tracked sebagai TODO terpisah.

### D2. Circulation Types

Field `circulation` sesuai backend (enum: `TO`, `CC`, `BCC` atau variasinya). Confirm dari `apidocs/core/mail-recipient.json` saat implementasi. Dropdown di form.

### D3. Send Flow

**Kirim dari draft (mode=edit):**
1. User isi field → Simpan Draft → Kelola Penerima → tambah recipients → Kirim.
2. Validasi saat klik Kirim: `recipients.length > 0`.
3. POST `/mails/{id}/send` → invalidate list (Drafts + Sent), folder-counters, thread.

**Kirim langsung (mode=create):**
1. User isi field → Kelola Penerima (state lokal, belum persist) → Kirim Langsung.
2. POST `/mails/send` dengan body `MailSendRequest` (field mail + recipients array).
3. Setelah sukses: close dialog, invalidate list + counters, navigate ke folder Sent + mail baru.

### D4. Copy Thread & Copy From

- **Copy dari thread:** tombol di Sheet header bila `mail.thread.rootMailId !== null`. Klik → `POST /recipients/copy-thread/{refId}` (refId = `rootMailId`). Konfirmasi dialog.
- **Copy dari surat lain:** dialog pilih mail source (combobox + search di list). Klik → `POST /recipients/copy-from/{refId}`.
- Keduanya hanya aktif bila `mail.status==="DRAFT"` dan `canEditMail(mail, user)`.

### D5. Notif Flags UI

Setiap recipient row punya 3 toggle (Email / SMS / Push). Mutate via `PATCH /recipients/{rid}` dengan debounce 500ms (agar tidak kirim per-click). Optimistic update.

### D6. Batch Delete UX

- Checkbox per row + "Pilih semua".
- Tombol "Hapus pilihan" muncul saat ≥1 terselek.
- Konfirmasi dialog bila ≥5 recipient akan dihapus.

## Implementation Steps

### Scaffolding
1. Buat `use-mail-recipients.ts` (query + 7 mutations).
2. Tambah `useSendFromDraft` + `useSendMailDirect` di `use-mail-mutations.ts`.
3. Buat `recipient-picker.tsx` + `mail-recipient-sheet.tsx`.

### Logic
1. Sheet recipients: tabs navigation (Daftar/Tambah/Salin).
2. Compose dialog: tambah tombol Kirim (edit mode) + Kirim Langsung (create mode).
3. Detail panel: tab Penerima render list + tombol "Kelola Penerima" buka Sheet.

### Validation
- Zod: `recipients: z.array(z.object({ empId: z.string().min(1), circulation: z.enum([...]) })).min(1, "Minimal 1 penerima")`.
- Block send bila recipients kosong.

## Verification Checklist

**Build & Quality**
- [ ] `bun run build` + lint + format bersih.

**Manual Test Matrix**

_Add Recipient_
- [ ] Add single: empId + circulation → list ter-update.
- [ ] Add batch: multiple empIds → semua tersimpan.
- [ ] Validasi empId kosong → error.

_Delete Recipient_
- [ ] Delete single → list ter-update.
- [ ] Delete batch (≥5) → konfirmasi muncul.

_Notif Flags_
- [ ] Toggle email/sms/push → optimistic + persist setelah debounce.

_Copy Actions_
- [ ] Copy from thread (root ada) → recipients ter-populate.
- [ ] Copy from thread (root null) → tombol hidden.
- [ ] Copy from surat lain → dialog picker → sukses populate.

_Send_
- [ ] Kirim dari draft tanpa recipients → error "Minimal 1 penerima".
- [ ] Kirim dari draft sukses → mail pindah ke Sent.
- [ ] Kirim langsung (create mode + recipients inline) → sukses, mail langsung di Sent.

_RBAC_
- [ ] Owner + draft: semua aksi recipients + Kirim aktif.
- [ ] Owner + sent: aksi recipients hidden/disabled.
- [ ] Non-owner non-admin: semua hidden.

**Regression**
- [ ] PR 3a (draft create/edit/delete) tetap utuh.
- [ ] Tab Tracking/Read-Status PR 3a tetap lazy-load.
