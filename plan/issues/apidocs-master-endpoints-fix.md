# Rencana Perbaikan Endpoint API (Master) Berdasarkan API Docs

## Hasil Analisis (Perbedaan antara Aplikasi dan Dokumentasi)
Setelah melakukan pemeriksaan mendalam antara file-file TypeScript yang berada di `src/lib/` dan dokumentasi API (OpenAPI spec) yang berada di dalam direktori `apidocs/master/`, ditemukan beberapa ketidaksesuaian/perbedaan:

1. **`mail-type-api.ts` vs `apidocs/master/mail-type.json`**:
   - Di aplikasi: `PATCH /api/v1/mail-types/{id}/toggle-status`
   - Di dokumentasi: `PATCH /api/v1/mail-types/{id}/status`
   - **Perbedaan**: URL action untuk mengubah status telah diubah dari `/toggle-status` menjadi `/status`.

2. **`mail-category-api.ts` vs `apidocs/master/mail-category.json`**:
   - Di aplikasi: Terdapat fungsi dengan request `PATCH /api/v1/mail-categories/{id}/toggle-status`.
   - Di dokumentasi: Tidak terdapat sama sekali endpoint `PATCH` (kemungkinan *missing documentation* dari sisi backend).
   - **Keputusan**: Berdasarkan konsistensi pola endpoint (seperti *document-type* dan *mail-type*), endpoint diubah menjadi `/status`.

3. **`quick-message-api.ts` vs `apidocs/master/quick-message.json`**:
   - Di aplikasi: Belum ada endpoint untuk status toggle dan lookup data.
   - Di dokumentasi: Terdapat `PATCH /api/v1/quick-messages/{id}/status` dan `GET /api/v1/quick-messages/lookup`.
   - **Perbedaan**: Aplikasi belum mengimplementasikan semua endpoint yang disediakan oleh backend.

---

## Plan Perbaikan (Langkah-langkah per level file)

Langkah-langkah berikut diterapkan untuk menyesuaikan kode aplikasi:

### 1. `src/lib/mail-type-api.ts`
- **Goal**: Menyesuaikan endpoint API *toggle status*.
- **Aksi**: Mengubah URL di dalam fungsi `toggleMailTypeStatus(id: string)`:
  - Dari: ``fetch(`${BASE}/${id}/toggle-status`, ...)``
  - Menjadi: ``fetch(`${BASE}/${id}/status`, ...)``

### 2. `src/lib/mail-category-api.ts`
- **Goal**: Menyesuaikan pola endpoint API *toggle status*.
- **Aksi**: Mengubah URL di dalam fungsi `toggleMailCategoryStatus(id: string)`:
  - Dari: ``fetch(`${BASE}/${id}/toggle-status`, ...)``
  - Menjadi: ``fetch(`${BASE}/${id}/status`, ...)``

### 3. `src/lib/quick-message-api.ts`
- **Goal**: Melengkapi endpoint yang belum diimplementasikan di aplikasi frontend.
- **Aksi**:
  - Menambahkan fungsi `toggleQuickMessageStatus(id: string)` menggunakan endpoint `PATCH ${BASE}/${id}/status`.
  - Menambahkan fungsi `fetchQuickMessagesLookup()` menggunakan endpoint `GET ${BASE}/lookup`.

---

## Rencana Testing
Setelah semua perubahan di atas diimplementasikan pada kode, lakukan tahapan *testing* berikut:
1. Menjalankan *Linter/Formatter* (`bun run lint` dan `bun run format`) untuk memastikan tidak ada kesalahan *typing* maupun konvensi.
2. Membangun aplikasi (*Build*) menggunakan perintah `bun run build` untuk memvalidasi bahwa tipe data dan integrasi endpoint tidak memiliki masalah kompilasi (*Typescript error/build error*).
3. Melakukan tes aplikasi pada antarmuka *UI/Dashboard Master* (Tipe Surat, Kategori Surat, dsb) untuk memastikan fungsi toggle/pengubahan status dapat beroperasi sesuai respon yang diberikan backend (bukan lagi mereturn error 404 Not Found karena perbedaan route).

## Status Implementasi
- **Kode**: ✅ Semua file target telah diperbarui.
- **Testing**: ✅ `bun run lint` telah dijalankan, kode telah diperbaiki secara otomatis (jika ada formatter error).
- **Testing Build**: ✅ `bun run build` dieksekusi tanpa kompilasi/type error.
