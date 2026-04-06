### 🏛️ 1. Arsitektur Layout: "Focus-Centric Modal"
Modal ini dirancang untuk memberikan titik fokus tunggal bagi pengguna saat pengisian atau pengeditan data master, meminimalkan kesalahan input.

* **Trigger & Portal**: Modal hanya di-*render* ke DOM saat tombol "Tambah" atau "Edit" diklik (menghemat memori), menggunakan Portal agar tidak terpengaruh *z-index* elemen lain.
* **Backdrop (60% Base)**: *Overlay* transparan dengan efek *blur* tipis untuk mengunci fokus pengguna pada formulir.
* **Centered Dialog Content**: Kotak putih bersih di tengah layar yang menampung seluruh *input field*, memberikan kesan familiar bagi staf.
* **Focus Trap & Accessibility**: Mengunci navigasi keyboard di dalam modal — *power user* bisa mengisi data cepat dengan `Tab`. Mendukung `Enter` untuk kirim dan `Esc` untuk batal.

---

### ⚡ 2. UX & Optimasi Performa
Upgrade performa menjadi prioritas utama dalam modul modal ini:

* **Lazy Fetch on Open**: Konten modal dan data detail (misal: `/api/v1/mail-types/{id}`) hanya dimuat saat modal terbuka; jika sudah ada di *cache*, tidak akan di-*fetch* ulang.
* **Caching with TanStack Query**: Data yang sama dibuka berulang kali akan muncul instan dari *cache* tanpa memicu *loading bar*.
* **Zod Client-side Validation**: Validasi skema instan di sisi klien mencegah pengiriman data tidak lengkap atau salah format ke API Spring Boot.
* **Keyboard Familiarity**: Mendukung `Enter` untuk kirim dan `Esc` untuk batal, sangat ramah bagi staf yang ingin kerja cepat.
* **Audit Trail Integration**: Di bagian bawah formulir, teks *muted* (60% base) menampilkan: `Terakhir diubah oleh: Bagus S. pada 2026-04-03` untuk akuntabilitas.

---

### 📋 Tabel Ringkasan: Master Data Modal

| Kategori | Komponen | Implementasi | Manfaat |
| :--- | :--- | :--- | :--- |
| **Kontainer Utama** | `Modal` (Base UI) | Portal + *overlay* tengah layar | Ringan, fleksibel, tidak bentrok *z-index* |
| **Interaksi** | Dialog Terpusat | Focus Trap + `Tab`/`Enter`/`Esc` | Familiar & efisien bagi semua level user |
| **Area Input** | `Input` / `Textarea` | Field pengisian data master | Ruang bersih, validasi instan |
| **Dropdown Relasi** | `Select` / `Option` | Pilih kategori induk | Performa ringan |
| **Tombol Aksi** | `Button` | "Simpan" (Blue 30%) / "Batal" (Slate 60%) | Hierarki aksi jelas |
| **Keamanan Data** | Zod Schema | Validasi sisi klien | Integritas data sebelum masuk sistem |
| **Audit Log** | `Typography` | Riwayat perubahan di dalam modal | Transparansi & akuntabilitas |
