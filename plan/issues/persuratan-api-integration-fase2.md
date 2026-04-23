# Plan: Integrasi API Persuratan (Fase 2) — Index

Dokumen ini adalah **indeks** yang merujuk pada plan per-PR yang lebih granular. Plan awal yang monolit sudah dipecah berdasarkan scope PR dan sub-case agar reviewable dan mudah dieksekusi satu per satu.

## Konteks Singkat

Halaman `/persuratan` (branch `fitur-mail`) — **Fase 1 complete** (layout + UI + dummy data). Fase 2 = ganti seluruh dummy dengan API backend + tambah kapabilitas write.

- **Scope:** Full (Read + Write)
- **Strategi mail list:** per-folder **+** search global **per-folder** (bukan lintas folder) — mengikuti arahan user revisi.
- **Strategi detail:** lazy per-tab, sumber detail = `GET /api/v1/mails/{id}/thread` (ambil item dengan `id === mailId` untuk konten lengkap; sisa array adalah thread).
- **Strategi write:** RBAC feature-flag berdasarkan **kepemilikan surat** (ownership) — bukan role flat.

## Struktur Split

Plan dibagi menjadi **3 PR utama**. PR 3 (Compose/Send) terlalu besar → di-split lagi menjadi **3 sub-PR (3a/3b/3c)**. Total: **5 plan file**.

| File | PR | Scope |
|---|---|---|
| [persuratan-api-fase2/00-shared-foundation.md](persuratan-api-fase2/00-shared-foundation.md) | — (shared prep) | Types, API clients, query keys, RBAC keys. **Dikerjakan sebagai bagian PR 1** (bukan PR terpisah), tapi didokumentasikan terpisah karena direferensikan oleh semua PR berikutnya. |
| [persuratan-api-fase2/01-pr1-read-only.md](persuratan-api-fase2/01-pr1-read-only.md) | **PR 1** | Read-only: folder tree, counters, mail list (per-folder + search per-folder), mail detail (thread-based), markRead. Hapus dummy. |
| [persuratan-api-fase2/02-pr2-folder-move.md](persuratan-api-fase2/02-pr2-folder-move.md) | **PR 2** | Folder management (create/rename/delete), move mails, restore, deleteFromFolder, emptyTrash, context menu, bulk toolbar. |
| [persuratan-api-fase2/03-pr3a-compose-draft.md](persuratan-api-fase2/03-pr3a-compose-draft.md) | **PR 3a** | Compose dialog + draft (create/update/delete draft). Tab Thread & Tracking & Read-Status aktif (read-only side). |
| [persuratan-api-fase2/04-pr3b-recipients-send.md](persuratan-api-fase2/04-pr3b-recipients-send.md) | **PR 3b** | Recipients sheet (add/batch/delete/notif/copy-thread/copy-from) + send (dari draft + direct send). |
| [persuratan-api-fase2/05-pr3c-attachments.md](persuratan-api-fase2/05-pr3c-attachments.md) | **PR 3c** | Attachment list: upload (multipart), download (blob trigger), delete. `refType=1` untuk mail. |

## Rekomendasi Urutan Merge

1. **00 (shared)** + **01 (PR 1)** → 1 PR, halaman berfungsi full read-only tanpa dummy.
2. **02 (PR 2)** → write path paling ringan (tidak ada upload/multipart, tidak ada RHF compleks).
3. **03 (PR 3a)** → kunci kapabilitas compose/draft sebelum recipients. Tab Thread/Tracking sudah cukup bernilai sendiri.
4. **04 (PR 3b)** → recipients + send (butuh compose sudah ada).
5. **05 (PR 3c)** → attachments (independen dari recipients, bisa dipararel dengan 3b bila tim >1).

## Revisi dari Plan Monolit Awal

| # | Arahan User | Perubahan |
|---|---|---|
| 1 | Search global dibuat **per-folder** | Mode "search" dihapus sebagai switch lintas folder. Search (`keyword` + `sdate`/`edate`) sekarang **selalu dalam konteks folder aktif** via `GET /mail/folders/{id}/mails`. Endpoint `GET /mails/search` hanya dipakai untuk **reporting/advanced search di level terpisah** (tidak untuk list utama). Detail di file [01-pr1-read-only.md §D2](persuratan-api-fase2/01-pr1-read-only.md). |
| 2 | Split plan per PR | Plan dipecah menjadi 6 file (1 index + 1 shared + 4 PR files). PR 3 di-split lagi menjadi 3a/3b/3c. |
| 3 | D3 Detail Source gunakan `/mails/{id}/thread` | Mengganti strategi "derive dari list cache + banner placeholder". Detail sekarang di-fetch dari `GET /api/v1/mails/{id}/thread` → item dengan `id === mailId` adalah subject mail (lengkap), sisanya thread siblings. Tidak perlu banner placeholder lagi. Detail di [01-pr1-read-only.md §D3](persuratan-api-fase2/01-pr1-read-only.md). |
| 4 | D4 RBAC CRUD berdasarkan kepemilikan | Feature-flag tidak lagi flat per-role. Gating write berdasar `mail.audit.createdBy === currentUserId` (owner) untuk update/delete/compose. ADMIN/SYSTEM override. Detail di [00-shared-foundation.md §RBAC](persuratan-api-fase2/00-shared-foundation.md). |

## Constraints Global (berlaku semua PR)

- Tabs (Biome), `@/*` alias, tidak menambah library baru.
- Semua UI text, label, toast, error message: **Bahasa Indonesia**.
- API call via `/api/proxy/v1/...` (Bearer auto-injected oleh NextProxy).
- Semua hook di `src/hooks/persuratan/` (memory lama yang menyebut "colocated" sudah usang).
- Tidak menyentuh master pages atau publikasi.

## MCP Tools

- `context7-mcp`:
  - `/tanstack/query` — `invalidateQueries` patterns, `enabled` flag untuk lazy tab.
  - `/colinhacks/zod` — `z.coerce.date`, cross-field refinement (mailDate vs maxResponseDate).
- `next-devtools-mcp`: profil render saat paging/search, deteksi waterfall saat switch folder.

## Memory Update Post-Fase 2

Setelah semua PR merged:
- Update `features/mail-viewer.md` — status: Fase 2 complete, hapus "dummy data", tambah list endpoint + RBAC ownership rule.
- Update `layers/auth.md` bila ada permission key baru yang di-register di `src/lib/rbac.ts`.
