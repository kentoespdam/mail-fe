# PATCH Status Actions — Mail-Type, Mail-Category, Publication

## Ringkasan

Menambahkan aksi PATCH status pada tiga fitur: **mail-type**, **mail-category**, dan **publication**. Mail-type dan mail-category sudah memiliki toggle status (Switch) di tabel, namun publication belum memiliki aksi publish/status change di frontend.

## Status Saat Ini

| Fitur | API Endpoint | API Function | Hook | UI Toggle |
|-------|-------------|--------------|------|-----------|
| Mail-Type | `PATCH /mail-types/{id}/toggle-status` | `toggleMailTypeStatus()` | `useToggleMailTypeStatus()` | Switch di tabel |
| Mail-Category | `PATCH /mail-categories/{id}/toggle-status` | `toggleMailCategoryStatus()` | `useToggleMailCategoryStatus()` | Switch di tabel |
| Publication | `PATCH /publications/{id}/publish` | **BELUM ADA** | **BELUM ADA** | **BELUM ADA** (hanya Badge statis) |

## Tujuan

1. **Mail-Type & Mail-Category** — Pastikan toggle status sudah berfungsi end-to-end. Jika sudah, cukup review dan perbaiki edge case.
2. **Publication** — Implementasi lengkap aksi PATCH publish dari API function, hook, sampai UI action button.

---

## Langkah Implementasi

### Fase 1: Review & Validasi Mail-Type dan Mail-Category

> Mail-type dan mail-category sudah punya implementasi toggle status. Fase ini hanya memastikan semuanya konsisten dan benar.

1. **Cek API docs** di `apidocs/master/mail-type.json` dan `apidocs/master/mail-category.json` — pastikan endpoint PATCH status terdokumentasi dan response type-nya sesuai.
2. **Cek API function** di `src/lib/mail-type-api.ts` dan `src/lib/mail-category-api.ts` — pastikan function `toggleMailTypeStatus()` dan `toggleMailCategoryStatus()` sudah sesuai dengan API docs.
3. **Cek hooks** di `src/hooks/mail-type-hooks.tsx` dan `src/hooks/mail-category-hooks.tsx` — pastikan `useToggleMailTypeStatus()` dan `useToggleMailCategoryStatus()` sudah invalidate query yang benar dan tampilkan toast.
4. **Cek UI** di `src/components/mail-type/mail-type-content.tsx` dan `src/components/mail-category/mail-category-content.tsx` — pastikan Switch toggle sudah disable saat pending dan label status tampil benar (Aktif/Nonaktif).
5. **Test manual** — toggle status di browser, pastikan Switch berubah, toast muncul, dan data ter-refresh.

### Fase 2: Implementasi Publication Publish Action

#### Step 1 — API Function

- **File:** `src/lib/publication-api.ts`
- Tambahkan function `publishPublication(id: string)` yang memanggil `PATCH /api/proxy/v1/publications/{id}/publish`
- Ikuti pola yang sama dengan `toggleMailTypeStatus()` di `src/lib/mail-type-api.ts`
- Referensi endpoint ada di `apidocs/core/publication.json`

#### Step 2 — Hook Mutation

- **File:** `src/hooks/publication-hooks.tsx`
- Tambahkan hook `usePublishPublication()` menggunakan `useMutation`
- Pola: ikuti `useToggleMailTypeStatus()` atau `useToggleMailCategoryStatus()` sebagai referensi
- Pastikan:
  - `onSuccess`: invalidate query `["publications"]`, tampilkan toast sukses
  - `onError`: tampilkan toast error
  - Semua teks toast dalam **Bahasa Indonesia**

#### Step 3 — UI Action Button di Tabel

- **File:** `src/components/publication/publication-content.tsx`
- Di kolom **Actions**, tambahkan tombol Publish (hanya tampil jika `status === "DRAFT"`)
- Gunakan pattern `TooltipButton` dengan icon yang sesuai (misalnya `IconSend` atau `IconCloudUpload`)
- Saat diklik:
  - Tampilkan **confirmation dialog** (seperti `DeleteConfirmDialog` pattern) untuk konfirmasi publish
  - Jika dikonfirmasi, panggil `publishMutation.mutate(id)`
  - Disable tombol saat `isPending`

#### Step 4 — (Opsional) Ubah Badge Menjadi Interaktif

- Di kolom Status, pertimbangkan apakah Badge perlu diubah menjadi clickable atau tetap statis
- Jika tetap statis (rekomendasi), biarkan Badge seperti sekarang — aksi publish cukup dari tombol di kolom Actions

---

## Pattern & Referensi Kode

Gunakan file-file berikut sebagai contoh implementasi:

| Layer | Referensi File | Yang Perlu Ditiru |
|-------|---------------|-------------------|
| API function | `src/lib/mail-type-api.ts` → `toggleMailTypeStatus()` | Pola fetch PATCH |
| Hook mutation | `src/hooks/mail-type-hooks.tsx` → `useToggleMailTypeStatus()` | Pola useMutation + toast + invalidate |
| UI action | `src/components/mail-type/mail-type-content.tsx` | Pola Switch/TooltipButton + pending state |
| Confirm dialog | `src/components/publication/publication-delete-dialog.tsx` | Pola dialog konfirmasi |

---

## Instruksi untuk Developer / AI

### Wajib Dilakukan

1. **Gunakan Context7 MCP** untuk referensi dokumentasi library:
   - `npx ctx7@latest library tanstack-query "<pertanyaan>"` — untuk pola `useMutation`, `useQueryClient`, invalidation
   - `npx ctx7@latest library next.js "<pertanyaan>"` — jika perlu referensi App Router / fetch pattern
   - Jangan mengandalkan pengetahuan lama, selalu fetch docs terbaru via Context7

2. **Ikuti konvensi yang sudah ada** — baca dulu file referensi di tabel atas sebelum menulis kode baru. Jangan buat pola baru, ikuti yang sudah established.

3. **Semua teks UI dalam Bahasa Indonesia** — toast, label, placeholder, dialog text.

4. **Jangan ubah file yang tidak relevan** — scope hanya 3 fitur ini.

### Finalisasi & Quality Check

Setelah implementasi selesai, **wajib jalankan:**

```bash
# 1. Lint check
bun run lint

# 2. Build check — pastikan ZERO error
bun run build

# 3. Format
bun run format
```

Jika ada error dari lint atau build, **perbaiki sebelum submit**. Jangan submit kode yang gagal build.

### Checklist Selesai

- [ ] Mail-Type: toggle status berfungsi (review)
- [ ] Mail-Category: toggle status berfungsi (review)
- [ ] Publication: `publishPublication()` API function dibuat
- [ ] Publication: `usePublishPublication()` hook dibuat
- [ ] Publication: tombol Publish di tabel (hanya untuk DRAFT)
- [ ] Publication: confirmation dialog sebelum publish
- [ ] Semua toast & label dalam Bahasa Indonesia
- [ ] `bun run lint` — pass
- [ ] `bun run build` — pass (zero error)
- [ ] Test manual di browser — publish flow berfungsi
