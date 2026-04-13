# Tambah Tombol Download/Preview File di Detail Dialog Publikasi

## Latar Belakang

Pada `publication-detail-dialog.tsx`, bagian file attachment (baris 88-108) saat ini hanya menampilkan **nama file dan ukuran** secara statis menggunakan `IconFileText`. Tidak ada aksi apapun yang bisa dilakukan user terhadap file tersebut.

Sementara itu, di **tabel publikasi** (kolom actions di `publication-hooks.tsx` baris 334-355) sudah ada tombol yang bisa:
- **Preview** file PDF/image → membuka `PublicationPreviewDialog`
- **Download** file non-PDF/image → langsung trigger download

**Tujuan:** Tambahkan fungsi download/preview file yang sama ke dalam detail dialog, agar user bisa langsung preview atau download file dari modal detail tanpa harus menutup dialog terlebih dahulu.

---

## File yang Perlu Dimodifikasi

| File | Perubahan |
|---|---|
| `src/components/publication/publication-detail-dialog.tsx` | Tambah tombol aksi pada section file attachment |

## File Referensi (Read-Only)

| File | Fungsi |
|---|---|
| `src/components/publication/publication-preview-dialog.tsx` | Referensi cara membuka preview dialog |
| `src/hooks/publication-hooks.tsx` (baris 334-355) | Referensi logika preview vs download berdasarkan tipe file |
| `src/lib/publication-api.ts` | Fungsi `triggerDownload()` dan `getPublicationDownloadUrl()` |
| `src/hooks/publication-hooks.tsx` (fungsi `getFileType()`) | Helper untuk deteksi tipe file |

---

## Langkah Implementasi

### 1. Pahami Logika yang Sudah Ada

Baca dan pahami bagaimana tombol preview/download bekerja di tabel:
- `getFileType(pub.fileName)` mengembalikan `"pdf" | "image" | "other"`
- Jika `"pdf"` atau `"image"` → buka preview dialog (`setPreviewPub(pub)`)
- Jika `"other"` → langsung download (`triggerDownload(pub.id, pub.fileName)`)

> **Gunakan skill/MCP (Context7, next-devtools)** untuk memahami API komponen yang dipakai (Dialog, Button, dll) jika diperlukan.

### 2. Tambah Import yang Diperlukan

Di `publication-detail-dialog.tsx`, tambahkan import:
- `IconDownload` dan/atau `IconEye` dari `@tabler/icons-react`
- `getFileType` dari `@/hooks/publication-hooks`
- `triggerDownload` dari `@/lib/publication-api`
- `useState` dari `react` (jika menggunakan state untuk preview)

### 3. Tambah State untuk Preview (Opsional)

Ada 2 pendekatan:
- **Pendekatan A (Rekomendasi):** Tambah state `showPreview` di dalam detail dialog, lalu render `PublicationPreviewDialog` di dalamnya. Import komponen preview dialog.
- **Pendekatan B:** Gunakan callback prop `onPreview` dari parent untuk membuka preview dialog di level parent.

Pilih pendekatan yang paling sesuai. Pendekatan A lebih self-contained.

### 4. Update Section File Attachment

Ubah section file (yang saat ini hanya menampilkan info statis) agar memiliki **tombol aksi**:
- Tambahkan tombol di sisi kanan section file attachment
- Tombol menampilkan icon `IconDownload` atau `IconEye` tergantung tipe file
- Gunakan logika yang sama dengan tabel: cek `getFileType()` untuk menentukan aksi

### 5. Handle Aksi Tombol

- Jika tipe file `"pdf"` atau `"image"`:
  - Set state preview → buka `PublicationPreviewDialog`
  - ATAU tampilkan preview inline di dalam dialog
- Jika tipe file `"other"`:
  - Panggil `triggerDownload(pub.id, pub.fileName)` langsung

### 6. Styling

- Gunakan pattern yang konsisten dengan tombol di tabel (ghost variant, icon-sm size)
- Tambahkan tooltip yang jelas: "Preview file" atau "Download file"
- Pastikan tombol memiliki warna yang sesuai (misal: `text-primary` untuk preview/download)

---

## Catatan Penting

- **Gunakan skill/MCP tools:**
  - Gunakan **Context7** (`ctx7`) untuk cek dokumentasi komponen shadcn/base-ui jika ragu tentang prop API
  - Gunakan **next-devtools MCP** (`get_errors`, `get_logs`) untuk debugging saat development
- **Jangan buat komponen/helper baru** — semua fungsi yang dibutuhkan sudah tersedia (`getFileType`, `triggerDownload`, `PublicationPreviewDialog`)
- **Semua teks UI harus dalam Bahasa Indonesia** (tooltip, label, dll)
- **Jangan ubah file lain** selain `publication-detail-dialog.tsx` kecuali benar-benar diperlukan

---

## Verifikasi & Finalisasi

1. Jalankan `bun run build` untuk memastikan tidak ada error TypeScript/build
2. Jalankan `bun run lint` untuk memastikan kode sesuai standar Biome
3. Gunakan **next-devtools MCP**:
   - `get_errors` → pastikan tidak ada runtime error
   - `get_logs` → cek log development server
4. Test manual:
   - Buka detail dialog publikasi yang memiliki file PDF → tombol harus bisa membuka preview
   - Buka detail dialog publikasi yang memiliki file image → tombol harus bisa membuka preview
   - Buka detail dialog publikasi yang memiliki file non-PDF/image → tombol harus langsung download
   - Buka detail dialog publikasi tanpa file → section file tidak muncul (behavior existing)
