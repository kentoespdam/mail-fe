# 00 — Shared Foundation (Types, API Clients, RBAC Ownership)

> **Status PR:** dikerjakan sebagai bagian **PR 1** (lihat `01-pr1-read-only.md`). File ini terpisah karena direferensikan oleh PR 2/3a/3b/3c.

## Tujuan

1. Semua DTO backend ter-map ke `src/types/*`.
2. API client module siap dipakai (`mail-folder-api.ts`, `mail-api.ts`, `mail-recipient-api.ts`, `attachment-api.ts`).
3. Query key hierarchy konsisten.
4. RBAC helper `canEditMail(mail, user)` ter-register di `src/lib/rbac.ts`.

## File Change Table

### Types

| Path | Change |
|---|---|
| `src/types/mail.ts` | **Update.** Tambah: `MailTrackingDto`, `RecipientReadStatusDto`, `RecipientDto`, `MailFolderRequest`, `MoveMailRequest`, `MailCreateRequest`, `MailUpdateRequest`, `MailSendRequest`, `MailResponse`, `RecipientBatchRequest`, `ThreadMailDto` (= `MailSummaryDto` dgn `content`/`note` opsional sesuai backend). Selaraskan `MailSummaryDto.readStatus` (number) & `status` (string enum backend: DRAFT/SENT/RECEIVED). |
| `src/types/attachment.ts` | **Baru.** `AttachmentDto`, `AttachmentRefType` (`1` mail, `2` archive). |
| `src/types/commons.ts` | Verifikasi `PagedResponse<T>` kompatibel dengan `PagedResponseMailSummaryResponse` backend (flat: `content/page/size/totalElements/totalPages/first/last`). Bila beda bentuk dari master, **jangan ubah type global** — sediakan adapter di API client layer. |

### API Clients (baru)

Semua mengikuti pattern `src/lib/publication-api.ts` (proxy base, error handling dengan `detail` Indonesian, blob download trigger).

| Path | Exports |
|---|---|
| `src/lib/mail-folder-api.ts` | `fetchFolderTree`, `fetchFolderCounters`, `createFolder`, `renameFolder`, `deleteFolder`, `moveMails`, `restoreMailToFolder`, `deleteMailFromFolder`, `emptyTrash` |
| `src/lib/mail-api.ts` | `fetchMailsInFolder`, `searchMailsReport` (reporting-only, bukan list utama), `fetchThread`, `fetchTracking`, `fetchReadStatus`, `createDraft`, `updateDraft`, `sendFromDraft`, `sendMailDirect`, `markRead`, `deleteMail`, `restoreMailRoot` |
| `src/lib/mail-recipient-api.ts` | `fetchRecipients`, `addRecipient`, `addRecipientsBatch`, `deleteRecipient`, `deleteRecipientsBatch`, `updateNotifFlags`, `copyThread`, `copyFrom` |
| `src/lib/attachment-api.ts` | `fetchAttachments(refType, refId)`, `uploadAttachment(refType, refId, file, docNotes?)`, `deleteAttachment(id)`, `triggerAttachmentDownload(id, filename)` |

### Query Key Hierarchy

```
["mail","folder-tree"]
["mail","folder-counters"]
["mail","list","folder", { folderId, page, size, keyword, sdate, edate, sortBy, sortDir }]
["mail","thread", mailId]            // dipakai untuk detail (item id===mailId) + thread siblings
["mail","tracking", mailId]
["mail","read-status", mailId]
["mail","recipients", mailId]
["attachments", refType, refId]
```

**Rasional:** key `["mail","thread", mailId]` dipakai ganda — sebagai data source detail **dan** tab Thread. Hindari duplikasi request.

### RBAC (Ownership-based)

| Path | Change |
|---|---|
| `src/lib/rbac.ts` | **Update.** Tambah helper ownership-based untuk persuratan. |

**Helper baru:**

- `canEditMail(mail: Pick<MailSummaryDto,'audit'|'status'>, user: SessionUser): boolean`
- `canDeleteMail(mail, user): boolean`
- `canSendMail(mail, user): boolean`
- `canManageFolder(folder, user): boolean`
- `canManageAttachment(mail, user): boolean`

**Aturan (Indonesian rule, implement via helper body):**

```
Owner = mail.audit.createdBy === user.id
SuperUser = user.role ∈ {SYSTEM, ADMIN}

canEditMail        = SuperUser || (Owner && mail.status === "DRAFT")
canSendMail        = SuperUser || (Owner && mail.status === "DRAFT")
canDeleteMail      = SuperUser || (Owner && mail.status === "DRAFT")
canManageAttachment = canEditMail   // attachment terikat ke draft
canManageFolder    = SuperUser || folder.ownerId === user.id
```

**Catatan:**
- Mail yang sudah `SENT` tidak bisa diedit/dihapus oleh owner (hanya SuperUser via audit/admin workflow).
- Folder `system: true` tidak bisa diubah siapapun (guard ada di helper).
- Kirim (recipient-side) = baca saja + mark read; tidak ada gating write dari sisi penerima.

**Feature flag sementara (bila belum ada `user.id` di session):** fallback `SuperUser = user.role==="ADMIN"` saja; tambah ASUMSI di PR 1.

### Implementation Notes

1. `src/lib/publication-api.ts` adalah referensi pola: baca dulu sebelum menulis client baru.
2. Folder endpoint memakai `sdate`/`edate` (bukan `startDate`/`endDate`) — map di level API client:
   ```
   fetchMailsInFolder({ folderId, startDate, endDate, ... })
     → GET /api/proxy/v1/mail/folders/{folderId}/mails?sdate=...&edate=...
   ```
   Level hook & UI tetap pakai `startDate`/`endDate` konsisten dengan master pages.
3. `PagedResponse` adapter: bila bentuk backend `{content, page, size, totalElements, ...}` tidak cocok dengan shape yang diharapkan `DataTablePagination`, lakukan map di function return API client (bukan di hook).

## Verifikasi

- [ ] `bun run build` sukses setelah type update (semua import lama tetap kompatibel).
- [ ] Unit test (bila ada) untuk `canEditMail` / `canManageFolder` dengan matrix owner vs non-owner × draft vs sent.
- [ ] `src/lib/rbac.ts` diverifikasi: helper baru teruji pada `persuratan-content.tsx` melalui import.
