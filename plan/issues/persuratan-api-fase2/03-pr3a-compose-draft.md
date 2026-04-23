# PR 3a — Compose Dialog + Draft Management

## Tujuan

Aktifkan kapabilitas **draft** dan tab supporting di detail panel: Thread (sudah dari PR 1), Tracking, Read-Status.

## Ruang Lingkup

- Dialog compose untuk create draft + update draft.
- Delete draft dari detail panel.
- Tab Tracking (`GET /mails/{id}/tracking`) aktif dengan `enabled` flag.
- Tab Read-Status (`GET /mails/{id}/read-status`) aktif dengan `enabled` flag.
- Belum ada: send, recipients, attachments (PR 3b/3c).

> **Prasyarat:** PR 1 + PR 2 merged. API client `mail-api.ts` sudah tersedia.

## File Change Table

### Hooks (baru)

| Path | Description |
|---|---|
| `src/hooks/persuratan/use-mail-tracking.ts` | `useMailTracking(mailId, enabled)` + `useMailReadStatus(mailId, enabled)`. Lazy fetch saat tab aktif. |

### Hooks (update)

| Path | Change |
|---|---|
| `src/hooks/persuratan/use-mail-mutations.ts` | Tambah `useCreateDraft`, `useUpdateDraft`, `useDeleteDraft` (alias `deleteMail` untuk status DRAFT). Invalidate list + thread (mailId) + folder-counters. |

### Components (baru)

| Path | Description |
|---|---|
| `src/components/persuratan/mail-compose-dialog.tsx` | Dialog compose RHF + Zod. Field: `mailTypeId`, `mailCategoryId`, `subject`, `content` (rich textarea atau contentEditable sederhana), `note`, `mailDate`, `maxResponseDate`, `circulationName`, plus field custom surat masuk/keluar (`noSuratMasuk`, `asalSuratMasuk`, `tglSuratMasuk`, `tujuanSuratKeluar`, `penerimaSuratKeluar`). Dua tombol: **Simpan Draft** / **Batal**. (Tombol "Kirim" ditambahkan di PR 3b.) |

### Components (update)

| Path | Change |
|---|---|
| `src/components/persuratan/mail-detail.tsx` | Aktifkan tab **Tracking** + **Read-Status**. Tombol "Ubah draft" muncul bila `canEditMail(mail, user)` dan `mail.status === "DRAFT"` → buka `mail-compose-dialog` mode edit. Tombol "Hapus draft" bila `canDeleteMail`. |
| `src/components/persuratan/mail-toolbar.tsx` | Tombol "Surat Baru" (muncul bila `canComposeNew(user)` — helper di `rbac.ts`, dasarnya: semua user ter-otentikasi dapat compose draft baru). Tombol buka `mail-compose-dialog` mode create. |

## Decisions

### D1. Form Schema (Zod)

```
mailTypeId: z.string().uuid("Tipe surat wajib dipilih")
mailCategoryId: z.string().uuid("Kategori surat wajib dipilih")
subject: z.string().min(1, "Perihal wajib diisi").max(500)
content: z.string().min(1, "Isi surat wajib diisi")
note: z.string().max(1000).optional().default("")
mailDate: z.coerce.date({ required_error: "Tanggal surat wajib diisi" })
maxResponseDate: z.coerce.date().optional().nullable()
  .refine(v => !v || v >= mailDate, "Batas respon harus >= tanggal surat")  // cross-field via superRefine
circulationName: z.string().max(100).optional().default("")
// + field surat masuk/keluar (opsional kecuali tipe khusus)
```

### D2. Create vs Edit Mode

Satu dialog komponen dengan prop `mode: "create" | "edit"` dan `initialData?: MailSummaryDto`.
- Create: POST `/api/v1/mails` → `createDraft`.
- Edit: PUT `/api/v1/mails/{id}` → `updateDraft`.
- Setelah sukses: `invalidateQueries(["mail","list","folder"])` + `invalidateQueries(["mail","thread", id])` + `invalidateQueries(["mail","folder-counters"])` + toast sukses + close dialog.

### D3. Lookup `mailTypeId` & `mailCategoryId`

Pakai API lookup yang sudah ada di `src/lib/mail-type-api.ts` dan `src/lib/mail-category-api.ts`. Komponen `Combobox` / `Select` shadcn sesuai pattern master pages.

### D4. Delete Draft

"Hapus draft" = `DELETE /api/v1/mails/{id}` langsung (hard delete), bukan soft-delete via folder endpoint. Konfirmasi dialog wajib. Setelah sukses: clear `mailId` dari URL + invalidate list.

### D5. Tab Tracking & Read-Status

- Keduanya pakai `enabled: !!mailId && isTabActive`. Tab state lokal di `mail-detail.tsx` (atau URL state `tab` bila ingin deep-link; **pilih lokal** untuk simplicity, tidak perlu deep-link ke tab).
- Tracking rendering: timeline sederhana (baca dari response DTO; confirm schema `TrackingEntry` dari `apidocs/core/mail.json`).
- Read-Status rendering: tabel recipient + indicator baca/belum + tanggal.

### D6. RBAC Compose
`canComposeNew(user): boolean` = `!!user` (semua user ter-otentikasi boleh buat draft). Tambahkan di `rbac.ts`.

## Implementation Steps

### Scaffolding
1. Tambah mutation di `use-mail-mutations.ts`.
2. Buat `use-mail-tracking.ts`.
3. Buat `mail-compose-dialog.tsx` (draft only).

### Logic
1. Dialog compose: RHF + Zod, lookup async untuk tipe/kategori.
2. `mail-detail.tsx`: wire tab Tracking/Read-Status + tombol "Ubah/Hapus draft" ter-gate RBAC.
3. `mail-toolbar.tsx`: tombol "Surat Baru".

### Styling
- Dialog: responsive, max-width 720px, scrollable content.
- Tab active indicator konsisten dengan shadcn Tabs.

### Validation
- Cross-field refinement: `maxResponseDate >= mailDate` saat keduanya terisi.
- Custom error path di Zod agar error attach ke `maxResponseDate`.

## Verification Checklist

**Build & Quality**
- [ ] `bun run build` + lint + format bersih.

**Manual Test Matrix**

_Create Draft_
- [ ] Buka dialog via "Surat Baru".
- [ ] Submit kosong → error Indonesian di semua field required.
- [ ] Submit valid → draft tersimpan, muncul di folder Drafts.
- [ ] Cross-field: mailDate > maxResponseDate → error.

_Edit Draft_
- [ ] Pilih draft → klik "Ubah draft" → dialog pre-fill data.
- [ ] Submit → data ter-update.
- [ ] User non-owner → tombol "Ubah draft" hidden.
- [ ] Mail status SENT → tombol "Ubah draft" hidden.

_Delete Draft_
- [ ] Klik "Hapus draft" → konfirmasi.
- [ ] Setelah hapus: `mailId` hilang dari URL, list ter-update.

_Tab Tracking & Read-Status_
- [ ] Pindah tab → request terkirim (lazy).
- [ ] Pindah ke tab lain → request cached, tidak terulang.
- [ ] Switch mail aktif → tab state reset atau refetch sesuai `mailId` baru.

_RBAC_
- [ ] Owner + draft: Ubah/Hapus aktif.
- [ ] Owner + sent: Ubah/Hapus hidden.
- [ ] Non-owner: semua hidden (kecuali ADMIN/SYSTEM).

**Regression**
- [ ] PR 1 & PR 2 functionalitas tetap utuh.
