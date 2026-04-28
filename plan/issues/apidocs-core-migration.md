# Pembaruan API Core Persuratan (Migration Plan)

## Tujuan
Memperbarui "pondasi data" (TypeScript types), "pipa data" (API & Hooks TanStack Query), "alat masak" (komponen UI), dan "penyajian" (halaman aplikasi) agar sesuai dengan struktur terbaru dari `apidocs/core`. Rencana ini akan memastikan aplikasi `mail-fe` dapat mengonsumsi dan menampilkan data surat dari backend Perumdam Tirta Satria dengan benar tanpa error.

## File Change Table

| File | Perubahan (High-Level) | Mengapa? |
| :--- | :--- | :--- |
| `src/types/*.ts` | Update antarmuka (`interface`) TypeScript (contoh: menyesuaikan `MailSummaryDto` dengan `MailSummaryResponse`). | Mengamankan kontrak baru agar saat kita membuat komponen, data yang dikirim dan diterima sudah sesuai ekspektasi. |
| `src/hooks/*` & `src/lib/*.ts` | Mengubah *endpoint* dan cara pengambilan data menggunakan TanStack Query v5. | Supaya aplikasi mengambil data dari jalur komunikasi yang benar sesuai API spesifikasi baru. |
| `src/components/persuratan/*` | Menyesuaikan *prop types* yang diterima oleh komponen UI seperti tabel dan form. | Tabel tidak akan error saat merender kolom data yang sebelumnya bernama berbeda. |
| `src/app/(main)/persuratan/page.tsx` | Memastikan data disalurkan dengan benar dari hook ke komponen penyajian. | Untuk menjamin halaman bisa dimuat dan tidak mengalami blank screen karena perubahan arsitektur data. |

## Langkah Pembaruan (Step-by-Step)

### Step 1: Kontrak Baru (Pondasi Data)
Pekerjaan dimulai dengan merevisi antarmuka TypeScript di dalam folder `src/types/` agar sesuai dengan struktur JSON dari `apidocs/core` (seperti `mail.json`, `mail-folder.json`, dll).
-   **Mengapa:** Ibarat membuat denah rumah sebelum memasang batu bata. Kontrak data yang benar mencegah error menjalar ke *file* lain.

### Step 2: Pipa Data (Jalur Komunikasi API & Hooks)
Sesuaikan *fetching* data di dalam file `src/hooks/` atau `src/lib/` yang digunakan oleh TanStack Query v5.
-   **Mengapa:** Jalur komunikasi lama mungkin meminta/menerima struktur yang berbeda atau *endpoint* yang berubah. Kita butuh pipa data yang tepat agar data mengalir lancar dari server ke aplikasi.

### Step 3: Alat Masak (Komponen & Logika UI)
Perbaiki *components* di dalam `src/components/` yang terdampak oleh perombakan kontrak data. Pastikan nama *property* yang di-render dalam tabel/form di-update ke penamaan yang baru.
-   **Mengapa:** Jika struktur data berubah (misal properti lama dihapus atau diganti), maka komponen UI akan menampilkan error atau data kosong jika tidak ikut disesuaikan.

### Step 4: Penyajian (Views / Pages)
Uji coba dan revisi di dalam folder halaman utama `src/app/` (contohnya `page.tsx` untuk modul persuratan).
-   **Mengapa:** Ini adalah hasil masakan yang disajikan ke user. Pastikan hasil rakitan tipe data, *hooks*, dan *components* berfungsi dengan baik sebagai sebuah *page* utuh.

## Constraints & Tooling
-   Gunakan indentasi **tabs** untuk seluruh file.
-   Ikuti standar **Biome** yang berlaku di proyek (jangan abaikan peringatan *linter*).
-   **Instruksi Penting untuk Developer Junior / AI Agent:** 
	-   Silakan gunakan **`context7`** (melalui utilitas CLI atau MCP) untuk mendapatkan *best practices* dalam penulisan dan implementasi kode menggunakan React 19, Next.js App Router, dan TanStack Query v5 selama tahap pengerjaan.
	-   Untuk menjaga keterbacaan dan *maintainability* kode, batasi setiap *file* komponen atau logika **tidak lebih dari 200 baris kode**. Lakukan *split file* (pemisahan ke beberapa *file*) jika ukuran *file* mendekati batas tersebut.

## Checklist (Daftar Tugas)
- [ ] 1. Audit dan sesuaikan seluruh tipe TypeScript di `src/types/` terhadap spesifikasi di `apidocs/core/`.
- [ ] 2. Update struktur *request* dan *response* fungsi API pada `src/lib/`.
- [ ] 3. Gunakan `context7` untuk meninjau pola penulisan *data fetching* terbaik (React 19 / TanStack Query v5).
- [ ] 4. Perbarui implementasi *query* dan *mutation* pada seluruh *hooks* di `src/hooks/`.
- [ ] 5. Refactor komponen di `src/components/persuratan/` yang terdampak perubahan struktur data, pastikan di-split jika lebih dari 200 baris per file.
- [ ] 6. Perbaiki halaman `src/app/(main)/persuratan/page.tsx` agar menyajikan data secara normal.
- [ ] 7. Jalankan perintah `bun run lint` dan format kode dengan `bun run format`.
- [ ] 8. Uji coba UI di browser untuk memastikan perbaikan fungsionalitas berjalan lancar.