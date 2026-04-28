# Detail Pembaruan API Core Persuratan (Migration Plan)

## 1. Tujuan
Menyediakan panduan **DETAIL** untuk mengeksekusi migrasi tipe data dan integrasi API berdasarkan pembaruan dari `apidocs/core`. Rencana ini memecah pekerjaan ke dalam tingkatan *file*, mendefinisikan apa yang berubah, apa yang ditambah, dan langkah implementasi teknis.

---

## 2. Rincian File yang Diubah

### A. Pondasi Data (TypeScript Types)
File-file di bawah ini akan diubah agar antarmukanya (*interface*) persis sesuai dengan struktur JSON di `apidocs/core/`.
- **`src/types/mail.ts`**: Menyelaraskan struktur `Mail`, `MailSummaryDto`, dan DTO terkait dengan `apidocs/core/mail.json`.
- **`src/types/attachment.ts`**: Menyesuaikan tipe untuk lampiran dengan `apidocs/core/attachment.json` dan `mail-attachment.json`.
- **`src/types/commons.ts`**: Memperbarui struktur *pagination*, *sorting*, dan respon dasar yang mungkin berubah akibat pembaruan API core.

### B. Pipa Data (API Clients & Hooks)
Penyesuaian untuk menjamin aliran data yang dikonsumsi oleh aplikasi menggunakan *endpoint* yang baru dan tipe *request* / *response* yang ketat.
- **`src/lib/mail-api.ts` & `src/lib/mail-folder-api.ts`**: 
  - Mengubah *endpoint paths* (jika ada).
  - Menyesuaikan parameter *request* dan *return type* dari setiap fungsi fetch API agar menggunakan tipe dari `src/types`.
- **`src/hooks/persuratan/use-mail-list-state.ts` & `use-mail-detail-state.ts`**:
  - Mengimplementasikan `useQuery` atau `useSuspenseQuery` (TanStack Query v5) dengan `queryKey` yang terstruktur.
  - Menangani parameter *state* dari URL.
- **`src/hooks/persuratan/use-mail-folder-tree.ts` & `use-mail-toolbar.ts`**:
  - Memperbarui *mutations* (`useMutation`) untuk operasi seperti *move*, *delete*, *archive* sesuai struktur *request* yang baru.

### C. Alat Masak (Komponen UI)
Penyesuaian komponen presentasional. Jika komponen melebihi 200 baris setelah di-update, wajib dipecah (*split*).
- **`src/components/persuratan/*` (seperti `MailList`, `MailTable`, `MailDetail` dll)**:
  - Mengganti pemanggilan atribut objek data yang lama dengan yang baru.
  - Menambahkan komponen baru (seperti `MailListHeader`, `MailListRow`, `MailFilter`) jika komponen utama melampaui 200 baris.

### D. Penyajian (Halaman)
- **`src/app/(main)/persuratan/page.tsx`**:
  - Menyesuaikan impor dan integrasi komponen serta hooks.
  - Memastikan *Server-Side Rendering* (SSR) atau transisi React 19 berfungsi dengan lancar dengan data yang baru.

---

## 3. Rincian yang Ditambahkan

1. **Sub-Komponen Baru (Pemisahan)**: Jika `MailTable` atau `MailList` lebih dari 200 baris kode, akan ditambahkan *file* baru, contoh:
   - `src/components/persuratan/mail-table-columns.tsx`
   - `src/components/persuratan/mail-pagination.tsx`
2. **DTO / Types Baru**: Jika di dalam file JSON `apidocs/core/` ditemukan *entity* baru seperti `MailArchiveDto`, maka akan ditambahkan *interface* baru di `src/types/mail.ts` atau membuat file `src/types/mail-archive.ts`.

---

## 4. Cara Mengimplementasikan (Step-by-Step Teknis)

1. **Audit Kontrak (Types)**
   - Buka file JSON di `apidocs/core/*.json`.
   - Konversikan setiap definisi entitas menjadi TypeScript `interface` di `src/types/`. Pastikan penamaan selaras (contoh: *snake_case* dari JSON bisa otomatis dimapping ke *camelCase* jika di-handle di API layer, atau sesuaikan kontrak dengan ekspektasi backend).
2. **Refactor API Layer**
   - Buka `src/lib/mail-api.ts`.
   - Update `axios` atau `fetch` *calls*. Beri tipe kembalian eksplisit (contoh: `Promise<ApiResponse<MailSummaryDto>>`).
3. **Refactor Hooks (TanStack v5 & React 19)**
   - Pindah ke `src/hooks/persuratan/`.
   - Gunakan fitur v5: Pastikan tidak menggunakan *overload* yang di-*deprecate* (misal penggunaan `{ onSuccess }` pada `useMutation` di-handle dengan baik).
   - Manfaatkan `context7` CLI atau skill untuk mencari best practice TanStack Query v5 jika ragu.
4. **Refactor UI Components**
   - Buka komponen di `src/components/persuratan/`. Gunakan TypeScript compiler (`bun run lint` / `tsc`) untuk melihat error pada *props*.
   - Ubah atribut yang memicu error.
   - Lakukan inspeksi panjang *file*. Jika baris kode > 200, lakukan ekstraksi logika (*custom hook*) atau UI (*sub-component*).
5. **Testing & Wiring**
   - Jalankan `bun dev`.
   - Akses `/persuratan`.
   - Uji navigasi, *pagination*, dan aksi (*mutations*).

---

## 5. Checklist Verifikasi

- [ ] **1. Validasi Tipe**: Seluruh file di `src/types/` (terutama yang berkaitan dengan surat) sudah diperbarui dan diekspor dengan benar tanpa *type errors*.
- [ ] **2. Validasi API**: Semua *endpoint* di `src/lib/` untuk modul persuratan sudah di-update dan mengembalikan `Promise` dengan *type* yang sesuai.
- [ ] **3. Validasi Hooks**: Hooks di `src/hooks/persuratan/` berhasil melakukan *fetch* tanpa error *type mismatch* di `useQuery` / `useMutation`.
- [ ] **4. Validasi Komponen UI**:
  - [ ] Tidak ada komponen UI di modul persuratan yang lebih dari 200 baris.
  - [ ] Props pada komponen sudah menggunakan tipe terbaru dari `src/types/`.
- [ ] **5. Validasi Page (Integrasi)**: Halaman `src/app/(main)/persuratan/page.tsx` dapat dirender sepenuhnya tanpa melempar *runtime error*.
- [ ] **6. Kualitas Kode**: Perintah `bun run lint` dan `bun run format` (Biome) sukses dieksekusi dengan *0 errors* / *0 warnings*.
- [ ] **7. Fungsionalitas Browser**: Uji klik, *sorting*, *pagination*, dan perpindahan folder berjalan normal di antarmuka web.