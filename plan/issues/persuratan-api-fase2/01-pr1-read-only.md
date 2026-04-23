# PR 1 — Read-only Foundation

## Tujuan

Halaman `/persuratan` berfungsi **tanpa dummy data**, read-only (folder tree + list + detail + markRead). Semua tombol write disembunyikan via RBAC helper (akan diaktifkan di PR 2/3).

## Ruang Lingkup

- Folder tree (hierarchical) + badge counter, auto-refetch tiap 60 detik.
- Mail list **per-folder** dengan pagination, keyword, date range, sort.
- **Search global dalam konteks folder aktif** (bukan lintas folder) — satu input `keyword` di toolbar yang di-pass sebagai query param ke endpoint folder.
- Mail detail dari `GET /api/v1/mails/{id}/thread`.
- `markRead` optimistic update saat mail unread di-klik.
- Hapus `src/lib/dummy/mail-dummy.ts`.

> **Prasyarat:** File `00-shared-foundation.md` (types + API clients + RBAC) ikut di-PR ini.

## File Change Table

### Hooks (baru)

| Path | Description |
|---|---|
| `src/hooks/persuratan/use-folder-tree.ts` | `useFolderTree()` + `useFolderCounters({ refetchInterval: 60_000 })`. Merge counter ke node tree di level hook (bukan di component). |
| `src/hooks/persuratan/use-mail-list.ts` | `useMailList({ folderId, page, size, keyword, startDate, endDate, sortBy, sortDir })`. Wrap `usePagination()`. **Hanya memakai endpoint per-folder**; keyword/date/sort dikirim sebagai query param. |
| `src/hooks/persuratan/use-mail-detail.ts` | `useMailDetail(mailId)` — pakai query key `["mail","thread", mailId]`. Select function: pick item yang `id === mailId` sebagai detail. Sisanya diexpose sebagai `thread: ThreadMailDto[]` untuk tab Thread. |
| `src/hooks/persuratan/use-mail-mutations.ts` | Di PR 1 hanya `useMarkReadMutation()` dengan optimistic update terhadap list cache + invalidate counters. |

### Hooks (update)

| Path | Change |
|---|---|
| `src/hooks/persuratan/use-mail-navigation.ts` | Pakai `useQueryStates()` untuk `folderId`, `mailId`. Deep-link ready. Mode "search" **dihapus** (search sekarang inline per-folder). |
| `src/hooks/persuratan/use-mail-list-state.ts` | Refactor untuk pakai `use-mail-list.ts`. Hapus dependency ke dummy. |
| `src/hooks/persuratan/use-mail-folder-tree.ts` | Konsumsi `useFolderTree` + `useFolderCounters`, expose tree + expand/collapse state. |
| `src/hooks/persuratan/use-mail-toolbar.ts` | Input: keyword, startDate, endDate. Disinkronkan dengan `use-mail-list-state`. |
| `src/hooks/persuratan/use-mail-detail-state.ts` | **Hapus** (diganti `use-mail-detail.ts`). |

### Components

| Path | Change |
|---|---|
| `src/components/persuratan/persuratan-content.tsx` | Wire hooks baru. Tambah loading state (skeleton) + error boundary pada panel list & detail. |
| `src/components/persuratan/mail-folder-tree.tsx` | Konsumsi tree + counters dari hook. PR 1: tombol "+" (new folder) & menu konteks di-hide via `canManageFolder()`. |
| `src/components/persuratan/mail-toolbar.tsx` | Satu input `keyword` (debounced 300ms) + date range picker. **Tidak ada toggle "Cari semua folder"**. Placeholder input: `"Cari di folder [namaFolder]..."` agar user paham konteksnya. |
| `src/components/persuratan/mail-list.tsx` | Kolom tetap. Row unread = `font-semibold` + dot indicator. Row click → `setMailId` + `markRead` optimistic (guard: hanya bila `readStatus===0`). PR 1: **tanpa row selection** (ditambahkan di PR 2). |
| `src/components/persuratan/mail-detail.tsx` | Konsumsi `useMailDetail`. Tampilkan full content/note dari thread-item. Tab Thread sudah aktif (data sudah ada dari query yang sama). Tab Tracking/Recipients/Lampiran → stub "akan tersedia di rilis berikutnya". |

### Cleanup

| Path | Change |
|---|---|
| `src/lib/dummy/mail-dummy.ts` | **Delete.** |
| Verifikasi import | `grep -r "mail-dummy" src/` harus kosong. |

## Decisions

### D1. Query Keys (inherit dari shared)
Lihat `00-shared-foundation.md §Query Key Hierarchy`.

### D2. Search Per-Folder (bukan Global Lintas Folder)

**Keputusan:** Endpoint list utama = `GET /mail/folders/{id}/mails` **selalu** — bahkan ketika user mengetik keyword. Parameter `keyword`, `sdate`, `edate`, `sortBy`, `sortDir` dikirim bersama `folderId`.

**Rasional:**
- User revisi meminta search global dibuat per-folder. Konteks folder tidak hilang saat mencari.
- Menghindari kompleksitas switch state (`mode=folder|search`) dan pembuatan query key terpisah.
- Endpoint `/mails/search` tetap ada di API client untuk **keperluan advanced/report di masa depan** (bukan list utama).

**Alternatif ditolak:** Dual-mode dengan toggle "Cari semua" — membingungkan user dan menimbulkan deep-link ambiguous.

**UX:** Saat folder aktif = Inbox, placeholder: `"Cari di Inbox..."`. Saat folder Custom = `"Cari di [namaFolder]..."`.

### D3. Detail Source = `GET /api/v1/mails/{id}/thread`

**Keputusan:** Endpoint `GET /api/v1/mails/{id}/thread` return `MailSummaryResponse[]`. Pakai response ini untuk:
1. **Detail mail aktif** = `thread.find(m => m.id === mailId)` → subject/content/note/audit/dll lengkap.
2. **Thread siblings** = `thread.filter(m => m.id !== mailId)` → list thread (parent/child/root chain).

**Rasional:**
- Tidak perlu endpoint `GET /mails/{id}` yang belum ada di backend.
- Satu request melayani dua kebutuhan (detail + tab Thread).
- `MailSummaryResponse` sudah berisi `content`/`note` (konfirmasi di schema `apidocs/core/mail.json#MailSummaryResponse` saat implementasi).

**ASUMSI:** `MailSummaryResponse` memang menyertakan `content` & `note`. Bila tidak, tambah fetch sekunder ke `/mails/search?senderId=...&id=...` atau fallback ke summary dari list cache. Tracked sebagai ASUMSI plan.

**Banner placeholder "konten belum tersedia" dari plan lama → DIHAPUS.**

### D4. RBAC Read-side
PR 1 tidak menampilkan tombol write. `canEditMail/canDeleteMail/canSendMail` dipanggil **hanya untuk menyembunyikan tombol** yang akan muncul di PR 2/3. Implementasi helper ada di `00-shared-foundation.md §RBAC`.

### D5. Pagination Adapter
Implemen di level `mail-api.ts` saat fetch selesai — map `{content, page, size, totalElements, totalPages, first, last}` ke bentuk yang dipakai `DataTablePagination`. Tidak menyentuh type global `PagedResponse`.

### D6. Loading/Error UX
- `DataTable isLoading={true}` saat list loading pertama kali.
- Skeleton di panel detail saat `useMailDetail.isLoading`.
- Toast error: `detail` dari backend (pattern `publication-api.ts`). Bahasa Indonesia.
- Folder tree fallback: tombol "Coba lagi" + pesan "Gagal memuat folder. Periksa koneksi Anda."

## Implementation Steps

### Prep
1. Baca `src/lib/publication-api.ts` & `src/hooks/publication-hooks.tsx` sebagai referensi pattern.
2. Baca `src/hooks/use-pagination.ts` untuk memastikan kompatibilitas params.
3. Konfirmasi `MailSummaryResponse` berisi `content`+`note` di `apidocs/core/mail.json`. Bila tidak, update D3 dengan fallback strategy.

### Scaffolding
1. Implementasikan `00-shared-foundation.md` (types + 4 API clients + RBAC helper).
2. Buat 4 file hook baru (`use-folder-tree`, `use-mail-list`, `use-mail-detail`, `use-mail-mutations`).
3. Update 4 hook yang sudah ada + hapus `use-mail-detail-state.ts`.

### Logic
1. `mail-folder-tree.tsx`: render dari hook; badge unread/total; aktif state terhubung ke `folderId` di URL.
2. `mail-list.tsx`: pass props dari `use-mail-list`; row click set `mailId`; markRead optimistic.
3. `mail-detail.tsx`: konsumsi `useMailDetail`; render detail + tab Thread (data siap dari query yang sama); tab lain = stub.
4. Hapus `mail-dummy.ts`.

### Styling
- Reuse token OKLch, tidak ada perubahan design system.
- Mobile: sidebar sheet + layout tidak regresi (existing behavior).
- Semua label/tombol/toast Bahasa Indonesia.

### Validation
- PR 1 tidak punya form tersendiri (belum ada write flow). Zod schema akan di PR 2/3.

## Verification Checklist

**Build & Quality**
- [ ] `bun run build` sukses tanpa warning TS.
- [ ] `bun run lint` bersih.
- [ ] `bun run format` tidak mengubah file.

**Manual Test Matrix**
- [ ] Folder tree muncul dengan badge unread/total akurat.
- [ ] Counter ter-refetch tiap 60 detik (verifikasi via Network tab).
- [ ] Klik folder → list ter-update; pagination/sort bekerja; page reset saat keyword berubah.
- [ ] Input keyword dalam folder → list ter-filter (per-folder, bukan lintas folder).
- [ ] Date range filter bekerja; `sdate`/`edate` terkirim ke backend (verifikasi Network).
- [ ] Placeholder input menampilkan nama folder aktif.
- [ ] Klik mail → detail render dari `/thread` endpoint. Subject/content/note tampil.
- [ ] Tab Thread aktif dengan data thread siblings.
- [ ] Tab Tracking/Recipients/Lampiran menampilkan stub "akan tersedia".
- [ ] Mail unread → klik → `markRead` optimistic; counter tree ter-update setelah invalidate.
- [ ] Deep-link `?folderId=X&mailId=Y` langsung buka state yang benar.
- [ ] Error network → toast Indonesian + retry.
- [ ] Mobile: tidak ada regresi layout.
- [ ] RBAC: tombol write tidak muncul (disembunyikan semua di PR 1).

**Regression**
- [ ] Publikasi & master pages tidak terdampak.
- [ ] `grep -r "mail-dummy" src/` kosong.
