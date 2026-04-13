# Fix Error Page Publikasi

## Status: TODO

## Deskripsi Masalah

Halaman `/publikasi` mengalami **2 error runtime** yang terdeteksi di console browser:

### Error 1: Script Tag di React Component
```
Encountered a script tag while rendering React component. Scripts inside React components
are never executed when rendering on the client. Consider using template tag instead.
```
- **Sumber:** `next-themes` ThemeProvider menyuntikkan `<script>` untuk menghindari flash saat load tema
- **Stack trace:** `theme-providers.tsx:23` → `layout.tsx:44`
- **Dampak:** Warning di console, potensi flash tema tidak bekerja optimal

### Error 2: DOMMatrix is not defined
```
DOMMatrix is not defined
```
- **Sumber:** Library `react-pdf` (pdfjs-dist) di-import secara langsung di `publication-preview-dialog.tsx`
- **Stack trace:** `publication-preview-dialog.tsx:11` → `publication-content.tsx:29`
- **Dampak:** Crash saat module evaluation karena `pdfjs` mengakses API browser (`DOMMatrix`) yang belum tersedia saat SSR/initial load

## File yang Perlu Dimodifikasi

1. `src/app/theme-providers.tsx` — Fix script tag warning dari next-themes
2. `src/components/publication/publication-preview-dialog.tsx` — Fix DOMMatrix error dari react-pdf

---

## Langkah Implementasi

### Step 1: Riset Dokumentasi

Sebelum mulai coding, gunakan **Context7 MCP** untuk mencari solusi terkini:

```bash
# Cari dokumentasi next-themes terbaru untuk mengatasi script tag warning
npx ctx7@latest library next-themes "script tag warning React client component"
npx ctx7@latest docs <libraryId> "script tag warning suppressHydrationWarning"

# Cari dokumentasi react-pdf untuk penggunaan di Next.js (dynamic import / SSR)
npx ctx7@latest library react-pdf "Next.js dynamic import SSR DOMMatrix"
npx ctx7@latest docs <libraryId> "Next.js setup dynamic import SSR"
```

### Step 2: Fix Script Tag Warning (next-themes)

**Masalah:** `next-themes` menyuntikkan `<script>` tag ke dalam React tree untuk mencegah theme flash. React memunculkan warning karena `<script>` tidak dieksekusi saat client-side rendering.

**Solusi yang mungkin (pilih berdasarkan hasil riset dokumentasi):**
- Update `next-themes` ke versi terbaru yang sudah handle issue ini
- Gunakan prop `nonce` atau konfigurasi lain yang disediakan `next-themes`
- Pindahkan ThemeProvider ke tempat yang lebih tepat sesuai rekomendasi library

**File:** `src/app/theme-providers.tsx`

### Step 3: Fix DOMMatrix Error (react-pdf)

**Masalah:** `react-pdf` dan `pdfjs-dist` mengakses browser API (`DOMMatrix`) saat module evaluation. Karena Next.js melakukan SSR, module ini dieksekusi di server dimana `DOMMatrix` tidak tersedia.

**Solusi:** Gunakan **dynamic import** dengan `ssr: false` agar `react-pdf` hanya di-load di client side.

**File:** `src/components/publication/publication-preview-dialog.tsx`

**Pendekatan:**
- Gunakan `next/dynamic` dengan `ssr: false` untuk komponen yang menggunakan `react-pdf`
- Atau gunakan lazy import (`React.lazy` + `Suspense`) untuk memisahkan module react-pdf
- Pastikan import CSS (`react-pdf/dist/...`) dan setup worker juga berada di dalam komponen yang di-dynamic-import

### Step 4: Verifikasi & Finalisasi

1. **Gunakan Next DevTools MCP** untuk cek error setelah fix:
   - Jalankan `get_errors` untuk memastikan tidak ada error runtime tersisa di halaman `/publikasi`
   - Jalankan `get_page_metadata` untuk memastikan halaman ter-render dengan benar

2. **Build check:**
   ```bash
   bun run build
   ```
   Pastikan build sukses tanpa error.

3. **Manual testing di browser:**
   - Buka `/publikasi` — pastikan tidak ada error di console
   - Klik preview file PDF — pastikan PDF viewer tampil dan berfungsi
   - Navigasi halaman PDF (next/prev) berfungsi
   - Download file berfungsi
   - Theme switching (light/dark) tetap berfungsi tanpa flash

---

## Catatan

- Jangan ubah fungsionalitas yang sudah ada, hanya fix error
- Semua teks UI tetap dalam Bahasa Indonesia
- Gunakan pattern yang sudah ada di codebase (cek komponen lain sebagai referensi)
