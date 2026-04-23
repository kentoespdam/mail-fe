# PR 2 — Folder Management & Move

## Tujuan

Aktifkan aksi write yang tidak melibatkan compose/recipient/upload: folder management + mail movement.

## Ruang Lingkup

- Create/rename/delete folder (dengan validasi nama 1–45 char).
- Move mails (single + bulk) ke folder lain.
- Restore mail dari Trash.
- Delete mail dari folder (soft-delete → pindah ke Trash).
- Empty trash.
- Row selection di `mail-list.tsx` + bulk toolbar conditional (Trash vs non-Trash).

> **Prasyarat:** PR 1 merged. API client `mail-folder-api.ts` dan `mail-api.ts` sudah tersedia dari PR 1.

## File Change Table

### Hooks (baru)

| Path | Description |
|---|---|
| `src/hooks/persuratan/use-folder-mutations.ts` | `useCreateFolder`, `useRenameFolder`, `useDeleteFolder`. Invalidate `["mail","folder-tree"]` + `["mail","folder-counters"]`. |
| `src/hooks/persuratan/use-mail-selection.ts` | Row selection state untuk `mail-list.tsx` (Set<mailId>). Toggle single + select-all per-page. Reset saat `folderId` berubah. |

### Hooks (update)

| Path | Change |
|---|---|
| `src/hooks/persuratan/use-mail-mutations.ts` | Tambah: `useMoveMails`, `useRestoreMail` (root), `useDeleteMailFromFolder`, `useEmptyTrash`. Semua invalidate list + counters. |

### Components (baru)

| Path | Description |
|---|---|
| `src/components/persuratan/folder-form-dialog.tsx` | Dialog create + rename folder. RHF + Zod. Field: `name` (1–45), `parentFolderId` (dari tree picker / auto saat "new subfolder"). |
| `src/components/persuratan/mail-move-dialog.tsx` | Dialog pilih target folder untuk move. Tree picker sederhana (reuse `MailFolderTree` read-only mode). Validasi: `fromFolderId !== toFolderId`. |
| `src/components/persuratan/folder-context-menu.tsx` | Menu konteks (base-ui Menu) untuk node tree: "Subfolder baru", "Ubah nama", "Hapus folder". Gating: `canManageFolder()`. |

### Components (update)

| Path | Change |
|---|---|
| `src/components/persuratan/mail-folder-tree.tsx` | Integrasi context menu + tombol "+" root (new top-level folder). Folder `system:true` otomatis tidak mendapat menu konteks. |
| `src/components/persuratan/mail-toolbar.tsx` | Tambah bulk action bar (muncul saat `selection.size > 0`): **Trash folder** → `[Restore, Hapus permanen, Kosongkan Trash]`; **Non-Trash** → `[Pindah ke folder..., Hapus]`. Gating bulk delete: `selection.every(canDeleteMail)`. |
| `src/components/persuratan/mail-list.tsx` | Tambah kolom checkbox (row selection). Konsumsi `use-mail-selection`. Header checkbox = toggle-all per-page. |

## Decisions

### D1. Validasi Folder
- `name`: `z.string().min(1, "Nama folder wajib diisi").max(45, "Maksimal 45 karakter")`.
- Duplikasi nama di parent yang sama: biarkan backend me-reject → toast `detail` error.
- Folder `system:true` tidak boleh di-rename/delete (guard UI + guard helper).

### D2. Move Validasi
- `fromFolderId !== toFolderId` (block submit).
- Minimal 1 `mailId`.
- Konfirmasi dialog bila >10 mail dipindah.

### D3. Delete vs Empty Trash
- Dari folder non-Trash: "Hapus" → `POST /mail/mails/{id}/delete` (soft-delete, pindah ke Trash).
- Dari folder Trash: "Hapus permanen" → `DELETE /api/v1/mails/{id}` (hard delete).
- "Kosongkan Trash" → `DELETE /mail/trash`, confirm dialog wajib.

### D4. Restore UX
- Hanya muncul di folder Trash.
- Single restore dari row: `POST /mail/mails/{id}/restore` (kembali ke folder asal).
- Bulk restore: loop mutation (atau batch endpoint bila tersedia — cek ulang saat implementasi).

### D5. RBAC Check Bulk
Saat user select N mail dengan campuran kepemilikan, tombol "Hapus" tetap tampil tapi disabled bila `selection.some(m => !canDeleteMail(m, user))`. Tooltip: "Ada surat yang bukan milik Anda."

## Implementation Steps

### Scaffolding
1. Buat `use-folder-mutations.ts` + `use-mail-selection.ts`.
2. Buat 3 komponen baru (folder-form-dialog, mail-move-dialog, folder-context-menu).

### Logic
1. `mail-folder-tree.tsx`: wire context menu + tombol "+" root. State dialog (new/rename) dikontrol oleh tree component.
2. `use-mail-mutations.ts`: tambah 4 mutation + invalidate patterns.
3. `mail-list.tsx`: tambah kolom checkbox (leading); header toggle-all-per-page.
4. `mail-toolbar.tsx`: bulk action bar conditional berdasar folder aktif.

### Styling
- Checkbox kolom: lebar fixed (40px), sticky left.
- Bulk bar: muncul smooth (tidak ada layout shift).

### Validation
- Zod schema folder (lihat D1).
- Zod schema move (lihat D2).

## Verification Checklist

**Build & Quality**
- [ ] `bun run build` + `bun run lint` + `bun run format` bersih.

**Manual Test Matrix**

_Folder CRUD_
- [ ] Create root folder: nama valid → sukses + tree ter-update.
- [ ] Create subfolder dari context menu parent.
- [ ] Validasi nama: kosong, >45 char, nama duplikat (dari backend).
- [ ] Rename: dialog pre-fill nama lama.
- [ ] Delete folder kosong: sukses.
- [ ] Delete folder berisi mail: backend reject → toast error Indonesian.
- [ ] Folder `system:true` tidak punya menu konteks.

_Row Selection & Bulk_
- [ ] Select single → bulk bar muncul dengan tombol konteks folder.
- [ ] Select-all per-page: header checkbox berfungsi.
- [ ] Switch folder → selection reset.

_Move_
- [ ] Move 1 mail → berhasil + counter kedua folder ter-update.
- [ ] Move N mail → berhasil.
- [ ] Move ke folder asal → tombol disabled + pesan.
- [ ] Move >10 → konfirmasi dialog muncul.

_Trash/Delete/Restore_
- [ ] Delete dari Inbox → mail pindah ke Trash.
- [ ] Restore dari Trash → mail kembali ke folder asal.
- [ ] Hapus permanen dari Trash → hilang.
- [ ] Empty trash → konfirmasi + semua mail trash hilang.

_RBAC Ownership_
- [ ] User owner + draft → tombol Hapus muncul aktif.
- [ ] User owner + sent → tombol Hapus disabled/hidden.
- [ ] User non-owner + non-admin → tombol Hapus hidden.
- [ ] SuperUser (ADMIN) → semua tombol aktif.
- [ ] Bulk selection campuran → tombol disabled dengan tooltip.

**Regression**
- [ ] PR 1 functionalitas (read, markRead, folder tree) tetap utuh.
