# Preview & Download File Publikasi

## Latar Belakang

Halaman publikasi (`/publikasi`) sudah memiliki fitur CRUD lengkap dan modal detail, namun belum ada cara untuk **melihat preview** maupun **mendownload** file dokumen publikasi. API sudah menyediakan endpoint download di `GET /api/v1/publications/{id}/download` (response: binary). Perlu ditambahkan:

1. **Tombol download** di setiap baris tabel publikasi.
2. **Modal preview** untuk file PDF dan image, dengan fallback langsung download untuk tipe file lainnya.

## Tujuan

- User dapat melihat preview file PDF/image langsung di browser tanpa harus mendownload.
- User dapat mendownload file publikasi dengan satu klik.
- File selain PDF/image langsung ter-download tanpa modal preview.

---

## Referensi Visual

### Tombol di tabel (baris actions)

```
[eye] [cloud] [download] [pencil] [trash]
                  ^-- tombol baru
```

### Modal preview

```
+-----------------------------------------------+
|  Preview: nama-file.pdf                   [X]  |
+-----------------------------------------------+
|                                               |
|   ┌─────────────────────────────────────┐     |
|   │                                     │     |
|   │        PDF / Image Preview          │     |
|   │                                     │     |
|   └─────────────────────────────────────┘     |
|                                               |
+-----------------------------------------------+
|                        [Download]   [Tutup]    |
+-----------------------------------------------+
```

---

## Informasi Teknis

### API Endpoint Download

- **Endpoint:** `GET /api/v1/publications/{id}/download`
- **Response:** Binary file (`application/octet-stream` atau sesuai MIME type)
- **Auth:** Bearer Token (sudah di-handle oleh API proxy)
- **Proxy path:** `/api/proxy/v1/publications/{id}/download`

### Tipe File dari `PublicationDto`

- Field `fileName` berisi nama file dengan ekstensi (contoh: `laporan.pdf`, `foto.jpg`)
- Deteksi tipe file berdasarkan **ekstensi** dari `fileName`:
  - **PDF:** `.pdf`
  - **Image:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
  - **Lainnya:** download langsung

### Library untuk PDF Preview

Gunakan **`react-pdf`** (`react-pdf` package dari npm):
- Wrapper React untuk `pdfjs-dist` (PDF.js)
- Simple API: `<Document>` + `<Page>` components
- Widely used, well-maintained

> **Penting:** Gunakan skill `context7-mcp` untuk fetch dokumentasi terbaru `react-pdf`:
> ```bash
> npx ctx7@latest library react-pdf "react component display pdf"
> npx ctx7@latest docs <libraryId> "how to display pdf document page"
> ```

---

## Langkah Implementasi

### Langkah 1: Install Library `react-pdf`

```bash
bun add react-pdf
```

- Pastikan juga install types jika belum tersedia: `bun add -D @types/react-pdf` (cek apakah types sudah bundled).
- **Penting:** `react-pdf` membutuhkan **PDF.js worker**. Ikuti petunjuk setup worker dari dokumentasi resmi (gunakan `context7-mcp` untuk mendapatkan instruksi terbaru).
- Pastikan worker di-configure untuk environment **Next.js App Router** (kemungkinan perlu setup di `next.config.ts` untuk webpack/turbopack alias atau copy worker file).

> **Petunjuk:** Gunakan `context7-mcp` untuk cari setup `react-pdf` dengan Next.js:
> ```bash
> npx ctx7@latest library react-pdf "nextjs app router setup worker"
> ```

### Langkah 2: Tambah Fungsi Download di API Layer

**File:** `src/lib/publication-api.ts`

- Tambahkan fungsi `downloadPublication(id: string)` yang memanggil endpoint `/api/proxy/v1/publications/{id}/download`.
- Fungsi ini harus return **Blob** (bukan JSON), karena response-nya binary.
- Gunakan `fetch` langsung (bukan helper yang auto-parse JSON).
- Tambahkan juga fungsi `getPublicationDownloadUrl(id: string)` yang return URL string untuk digunakan sebagai `src` pada preview (PDF/image).

### Langkah 3: Buat Helper Deteksi Tipe File

**File:** `src/hooks/publication-hooks.tsx` (atau utility terpisah)

- Buat fungsi helper `getFileType(fileName: string | null): "pdf" | "image" | "other"`
- Logic:
  - Ambil ekstensi dari `fileName` (lowercase)
  - `.pdf` -> `"pdf"`
  - `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg` -> `"image"`
  - Sisanya atau `null` -> `"other"`

### Langkah 4: Tambah Tombol Download di Kolom Actions Tabel

**File:** `src/hooks/publication-hooks.tsx`

- Import `IconDownload` dari `@tabler/icons-react`.
- Di array `columns`, cari kolom dengan `id: "actions"`.
- Tambahkan `TooltipButton` baru dengan `IconDownload` **setelah** tombol publish dan **sebelum** tombol edit.
- Logic `onClick`:
  - Jika `getFileType(pub.fileName)` adalah `"pdf"` atau `"image"` -> buka modal preview (set state).
  - Jika `"other"` -> langsung trigger download file.
- Tombol hanya tampil jika `pub.fileName` ada (ada file yang di-upload).
- Props tombol:
  - `variant="ghost"`
  - `size="icon-sm"`
  - `tooltip="Download/Preview file"`
  - `className` dengan warna yang sesuai (misal warna netral atau `text-secondary`)
- Tambahkan state `previewPub` di `usePublicationContent()` untuk mengontrol modal preview.

### Langkah 5: Buat Komponen Modal Preview

**File baru:** `src/components/publication/publication-preview-dialog.tsx`

- Ikuti pattern dialog yang sudah ada di folder `publication/` (lihat `publication-detail-dialog.tsx` sebagai referensi).
- **Props:** `{ pub: PublicationDto | null; onClose: () => void }`
- **Behavior berdasarkan tipe file:**

  **PDF Preview:**
  - Gunakan komponen `<Document>` dan `<Page>` dari `react-pdf`.
  - Load PDF dari URL: `/api/proxy/v1/publications/{id}/download`.
  - Tampilkan loading state saat PDF sedang dimuat.
  - Tampilkan navigasi halaman jika PDF multi-page (prev/next + nomor halaman).
  - Handle error loading (tampilkan pesan error + tombol download sebagai fallback).

  **Image Preview:**
  - Gunakan tag `<img>` standar.
  - `src` mengarah ke URL: `/api/proxy/v1/publications/{id}/download`.
  - Tambahkan `alt` text dari `pub.title`.
  - Gunakan `object-fit: contain` agar gambar tidak terdistorsi.
  - Handle loading state dan error.

- **Footer dialog:**
  - Tombol "Download" — trigger download file (save as).
  - Tombol "Tutup" — menutup modal.
- **Semua teks dalam Bahasa Indonesia.**

> **Petunjuk:** Gunakan `context7-mcp` untuk referensi API `react-pdf` (`Document`, `Page` props). Cek juga setup worker yang benar untuk Next.js.

### Langkah 6: Implementasi Fungsi Download (Save As)

**File:** `src/lib/publication-api.ts` atau langsung di komponen

- Buat fungsi utility `triggerDownload(id: string, fileName: string)`:
  - Fetch blob dari endpoint download.
  - Buat temporary `<a>` element dengan `URL.createObjectURL(blob)`.
  - Set `download` attribute dengan `fileName`.
  - Trigger click dan cleanup (revoke object URL).
- Fungsi ini digunakan baik di tombol tabel (untuk file "other") maupun di modal preview (tombol Download).

### Langkah 7: Pasang Dialog Preview di Halaman Publikasi

**File:** `src/components/publication/publication-content.tsx`

- Import `PublicationPreviewDialog` dari `./publication-preview-dialog`.
- Destructure `previewPub` dan `setPreviewPub` dari `usePublicationContent()`.
- Tambahkan komponen dialog di bawah dialog-dialog lainnya:
  ```
  <PublicationPreviewDialog
    pub={previewPub}
    onClose={() => setPreviewPub(null)}
  />
  ```

### Langkah 8: Verifikasi & Finalisasi

1. **Build check:** Jalankan `bun run build` — pastikan tidak ada error TypeScript atau build.
2. **Lint:** Jalankan `bun run lint` dan `bun run format` — perbaiki jika ada warning/error.
3. **MCP check:** Gunakan MCP `next-devtools`:
   - `get_errors` — cek tidak ada runtime error di browser.
   - `get_routes` — pastikan route `/publikasi` masih terdaftar.
4. **Manual test:**
   - Buka halaman `/publikasi`.
   - Klik tombol download pada publikasi yang memiliki file PDF -> modal preview muncul dengan render PDF.
   - Klik tombol download pada publikasi yang memiliki file image -> modal preview muncul dengan gambar.
   - Klik tombol download pada publikasi dengan file lainnya (misal `.docx`) -> file langsung ter-download.
   - Test tombol "Download" di modal preview -> file tersimpan dengan nama asli.
   - Test navigasi halaman PDF (jika multi-page).
   - Test tutup modal (tombol Tutup, klik backdrop, tombol X).

---

## File yang Diubah

| File | Aksi |
|---|---|
| `package.json` | Tambah dependency `react-pdf` |
| `src/lib/publication-api.ts` | Tambah fungsi `downloadPublication()`, `getPublicationDownloadUrl()`, `triggerDownload()` |
| `src/hooks/publication-hooks.tsx` | Tambah state `previewPub`, helper `getFileType()`, tombol download di kolom actions |
| `src/components/publication/publication-preview-dialog.tsx` | **File baru** — komponen modal preview PDF/image |
| `src/components/publication/publication-content.tsx` | Import & pasang dialog preview |
| `next.config.ts` | Kemungkinan perlu config untuk PDF.js worker (cek dokumentasi) |

## Referensi File Existing

| File | Kegunaan |
|---|---|
| `src/components/publication/publication-detail-dialog.tsx` | Pattern referensi untuk dialog |
| `src/hooks/publication-hooks.tsx` | Hook utama, kolom tabel, state management |
| `src/lib/publication-api.ts` | API layer untuk publikasi |
| `src/types/publication.ts` | Tipe `PublicationDto` (field `fileName`, `fileSize`) |
| `apidocs/core/publication.json` | OpenAPI spec, endpoint `/{id}/download` |

## Checklist

- [ ] Library `react-pdf` terinstall dan worker ter-configure
- [ ] Fungsi download API tersedia dan return Blob
- [ ] Helper `getFileType()` bekerja dengan benar
- [ ] Tombol download muncul di setiap baris yang memiliki file
- [ ] Modal preview PDF berfungsi (render + navigasi halaman)
- [ ] Modal preview image berfungsi
- [ ] File non-PDF/image langsung ter-download
- [ ] Tombol Download di modal menyimpan file dengan nama asli
- [ ] Semua teks dalam Bahasa Indonesia
- [ ] `bun run build` sukses tanpa error
- [ ] `bun run lint` sukses tanpa error
- [ ] MCP `get_errors` tidak menunjukkan error
- [ ] Manual test semua skenario berhasil
