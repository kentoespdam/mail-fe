# Template Edit Master

## Latar Belakang

Saat ini halaman-halaman master (Tipe Surat, Kategori Surat, Pesan Singkat) berada di route group `(main)` dan ditampilkan sebagai sub-menu terpisah di sidebar. Navigasi antar halaman master kurang efisien dan tidak ada shared layout.

## Tujuan

Membuat **route group `(master)`** dengan **shared template** yang menyediakan tab navigasi antar halaman master, sekaligus menambahkan beberapa fitur UX: debounced search, smart duplicate, audit trail mini-log, inline status toggle, dan skeleton loading.

---

## Detail Fitur

### 1. Route Group `(master)` + Template

Pindahkan semua halaman master dari `(main)/master/` ke `(master)/master/`. Buat file `template.tsx` di `(master)/master/` yang berisi:

- Heading "Master Data"
- Tab navigasi menggunakan shadcn `Tabs` component
- Tab items: **Tipe Surat** | **Kategori Surat** | **Pesan Singkat**
- Tab aktif ditentukan berdasarkan `usePathname()`
- Children di-render di bawah tab

**Install komponen:** `bunx shadcn@latest add tabs`

### 2. Simplifikasi TopBar / Sidebar Menu

Hapus sub-menu master di sidebar. Ganti dengan satu link:

- Path: `/master/tipe-surat` (halaman default master)
- Label: "Master Mail"
- Icon: `IconSettings2` (tetap)

### 3. Debounced Search (300ms)

Implementasi debounce pada search input di semua halaman master agar tidak mengirim request ke server setiap keystroke. Delay: **300ms**.

### 4. Smart Duplicate

Tombol satu-klik pada setiap row tabel untuk menduplikasi data master. Saat diklik:

- Buka form dialog dalam mode "create"
- Form terisi otomatis dengan data dari row yang dipilih
- User tinggal edit lalu submit

### 5. Audit Trail Mini-Log

Tampilkan informasi "Last Modified" di bagian bawah form edit. Berisi info kapan dan oleh siapa data terakhir diubah (jika tersedia dari API).

### 6. Inline Status Toggle

Tambahkan switch/toggle di setiap row tabel untuk mengaktifkan/menonaktifkan status data master secara langsung tanpa membuka form.

**Install komponen:** `bunx shadcn@latest add switch`

### 7. Skeleton Loading (Opsional)

Tampilkan skeleton placeholder saat data tabel sedang loading untuk meningkatkan perceived performance.

**Install komponen:** `bunx shadcn@latest add skeleton`

---

## Perubahan Struktur Folder

```
src/app/(master)/master/template.tsx          ← BARU
src/app/(master)/master/tipe-surat/page.tsx   ← pindah dari (main)
src/app/(master)/master/kategori-surat/page.tsx ← pindah dari (main)
src/app/(master)/master/pesan-singkat/page.tsx  ← pindah dari (main)
```

---

## Langkah Pengerjaan

1. **Install komponen shadcn** — `bunx shadcn@latest add switch skeleton tabs`
2. **Buat route group `(master)`** — buat folder `src/app/(master)/master/` dan pindahkan semua halaman master dari `(main)/master/`
3. **Buat `template.tsx`** — implementasi heading + tab navigasi dengan `usePathname()` untuk menentukan tab aktif
4. **Update sidebar/topbar** — hapus sub-menu master, ganti dengan single link ke `/master/tipe-surat`
5. **Implementasi debounced search** — tambahkan debounce 300ms pada search input di semua halaman master
6. **Implementasi smart duplicate** — tambahkan tombol duplicate di tabel, buka form create dengan data pre-filled
7. **Implementasi audit trail mini-log** — tampilkan info "Last Modified" di form edit
8. **Implementasi inline status toggle** — tambahkan switch di row tabel untuk toggle status
9. **Implementasi skeleton loading** (opsional) — tambahkan skeleton saat data loading
10. **Testing** — pastikan semua halaman master bisa diakses via tab, navigasi bekerja, dan semua fitur baru berfungsi

---

## Acceptance Criteria

- [ ] Route group `(master)` aktif dengan `template.tsx` yang menampilkan tab navigasi
- [ ] Semua halaman master (tipe-surat, kategori-surat, pesan-singkat) bisa diakses via tab
- [ ] Sidebar hanya menampilkan satu link "Master Mail" ke `/master/tipe-surat`
- [ ] Search input di halaman master menggunakan debounce 300ms
- [ ] Tombol duplicate tersedia dan membuka form create dengan data pre-filled
- [ ] Info "Last Modified" tampil di form edit
- [ ] Toggle status di row tabel berfungsi mengaktifkan/menonaktifkan data
- [ ] (Opsional) Skeleton loading tampil saat data sedang dimuat
- [ ] Tidak ada regresi pada fitur CRUD yang sudah ada

---

## Catatan untuk Developer

- Gunakan `context7` CLI (`npx ctx7@latest docs`) untuk lookup best practices komponen shadcn (Tabs, Switch, Skeleton) dan debounce pattern
- Semua teks UI harus dalam **Bahasa Indonesia**
- Ikuti pattern yang sudah ada di codebase (lihat halaman master yang sudah jadi sebagai referensi)
- Pastikan route protection tetap berjalan setelah pindah route group
