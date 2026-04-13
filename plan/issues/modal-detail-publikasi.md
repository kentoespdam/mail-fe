# Modal Detail Publikasi

## Latar Belakang

Halaman publikasi (`/publikasi`) sudah memiliki fitur CRUD (create, edit, delete, publish), namun belum ada cara untuk melihat detail lengkap publikasi tanpa masuk ke mode edit. Perlu ditambahkan modal detail **read-only** yang menampilkan informasi publikasi, mengikuti format referensi (jenis dokumen, judul, tanggal, deskripsi).

## Tujuan

Menambahkan tombol **lihat detail** (icon mata) di setiap baris tabel publikasi, yang membuka modal berisi informasi lengkap publikasi secara read-only.

---

## Referensi Visual

Modal menampilkan informasi dengan layout label-value:

```
┌─────────────────────────────────────────────┐
│  Detail Publikasi                        [X] │
├─────────────────────────────────────────────┤
│  Jenis Dokumen :  Pengumuman                 │
│  Judul         :  Pengumuman Pemberian ...   │
│  Tanggal       :  7 Mei 2025 09:28:25        │
│  Status        :  [Badge Terbit/Draf]        │
├─────────────────────────────────────────────┤
│                                              │
│  Pengumuman Pemberian Sanksi Pelanggaran ... │
│  (deskripsi lengkap)                         │
│                                              │
├─────────────────────────────────────────────┤
│  📎 nama-file.pdf (1.2 MB)   [Tutup]        │
└─────────────────────────────────────────────┘
```

---

## Langkah Implementasi

### Langkah 1: Tambah State Detail di Hook

**File:** `src/hooks/publication-hooks.tsx`

- Tambahkan state baru `detailPub` bertipe `PublicationDto | null` di dalam fungsi `usePublicationContent()`.
- Letakkan sejajar dengan state `deletePub`, `publishPub`, dll.
- Return `detailPub` dan `setDetailPub` dari hook.

> **Petunjuk:** Gunakan skill `context7-mcp` atau `find-docs` jika perlu referensi API React `useState`.

### Langkah 2: Tambah Tombol Icon Mata di Kolom Actions

**File:** `src/hooks/publication-hooks.tsx`

- Import `IconEye` dari `@tabler/icons-react`.
- Di array `columns`, cari kolom dengan `id: "actions"`.
- Tambahkan `TooltipButton` baru dengan `IconEye` **sebelum** tombol edit (paling kiri di grup aksi).
- Props tombol:
  - `variant="ghost"`
  - `size="icon-sm"`
  - `onClick={() => setDetailPub(pub)}`
  - `tooltip="Lihat detail publikasi"`
  - `className="h-8 w-8 text-info hover:bg-info/10 hover:text-info"` (atau warna netral yang sesuai)
- Tambahkan `aria-hidden="true"` pada icon.

### Langkah 3: Buat Komponen Dialog Detail

**File baru:** `src/components/publication/publication-detail-dialog.tsx`

- Ikuti pattern dialog yang sudah ada di folder `publication/`:
  - Gunakan `"use client"` directive.
  - Bungkus komponen dengan `memo()`.
  - Set `displayName`.
- **Props:** `{ pub: PublicationDto | null; onClose: () => void }`
- **Import komponen dialog** dari `@/components/ui/dialog`:
  - `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **Import** `Badge` dari `@/components/ui/badge` dan `Button` dari `@/components/ui/button`.
- **Kontrol open/close:** `open={!!pub}`, `onOpenChange` → panggil `onClose`.
- **Konten modal:**
  - **Header:** Judul "Detail Publikasi"
  - **Body** — tampilkan informasi dalam format label-value:
    - **Jenis Dokumen** → `pub.documentType?.name ?? "—"`
    - **Judul** → `pub.title`
    - **Tanggal** → format `pub.createdAt` menggunakan helper `formatDate` (lihat catatan di bawah)
    - **Status** → tampilkan badge (PUBLISHED = "Terbit", DRAFT = "Draf")
    - **Deskripsi** → `pub.description` (tampilkan di area terpisah dengan background muted)
    - **Info File** (opsional, jika `pub.fileName` ada) → nama file + ukuran file
  - **Footer:** Tombol "Tutup" yang memanggil `onClose`
- **Catatan:** Helper `formatDate` dan `formatFileSize` sudah ada di `publication-hooks.tsx` tapi saat ini bersifat lokal (tidak di-export). Pilih salah satu:
  - Export helper tersebut dan import di dialog, **ATAU**
  - Duplikasi logic format sederhana di dalam komponen dialog.
- **Semua teks dalam Bahasa Indonesia.**

> **Petunjuk:** Lihat `publication-publish-dialog.tsx` sebagai referensi pattern. Gunakan skill `context7-mcp` jika perlu referensi API Base UI Dialog.

### Langkah 4: Pasang Dialog di Halaman Publikasi

**File:** `src/components/publication/publication-content.tsx`

- Import `PublicationDetailDialog` dari `./publication-detail-dialog`.
- Destructure `detailPub` dan `setDetailPub` dari `usePublicationContent()`.
- Tambahkan komponen dialog di bawah dialog-dialog lainnya (sebelum closing `</>`):
  ```
  <PublicationDetailDialog
    pub={detailPub}
    onClose={() => setDetailPub(null)}
  />
  ```

### Langkah 5: Verifikasi & Finalisasi

1. **Build check:** Jalankan `bun run build` — pastikan tidak ada error TypeScript atau build.
2. **Lint:** Jalankan `bun run lint` — perbaiki jika ada warning/error.
3. **MCP check:** Gunakan MCP `next-devtools`:
   - `get_errors` — cek tidak ada runtime error di browser.
   - `get_routes` — pastikan route `/publikasi` masih terdaftar.
4. **Manual test:**
   - Buka halaman `/publikasi`.
   - Klik tombol mata pada salah satu baris publikasi.
   - Pastikan modal muncul dengan data yang benar.
   - Pastikan tombol "Tutup" menutup modal.
   - Pastikan modal juga bisa ditutup dengan klik backdrop atau tombol X.

---

## File yang Diubah

| File | Aksi |
|---|---|
| `src/hooks/publication-hooks.tsx` | Tambah state `detailPub` + icon `IconEye` di kolom actions |
| `src/components/publication/publication-detail-dialog.tsx` | **File baru** — komponen dialog detail read-only |
| `src/components/publication/publication-content.tsx` | Import & pasang dialog detail |

## Checklist

- [ ] State `detailPub` ditambahkan di hook
- [ ] Tombol IconEye muncul di setiap baris tabel
- [ ] Dialog detail menampilkan semua field publikasi
- [ ] Semua teks dalam Bahasa Indonesia
- [ ] `bun run build` sukses tanpa error
- [ ] `bun run lint` sukses tanpa error
- [ ] MCP `get_errors` tidak menunjukkan error
- [ ] Manual test: modal buka/tutup dengan benar
