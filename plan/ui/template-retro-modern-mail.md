### 🏛️ Arsitektur Layout: "The Retro-Modern Horizontal Split"

Konsep ini dirancang untuk menyelesaikan masalah performa lambat sambil menjaga kenyamanan *power user* dan staf senior yang sudah terbiasa dengan sistem lama.

| Komponen | Deskripsi Implementasi | Library / Tech |
| :--- | :--- | :--- |
| **Sidebar (Kiri)** | Daftar folder (`Inbox`, `Sent`, `Personal`) yang kini bisa disembunyikan (*collapsible*) untuk memperluas area kerja. | **shadcn/ui Nav** |
| **Panel Atas** | Daftar surat dalam bentuk tabel padat informasi (pengirim, perihal, status) dengan navigasi keyboard yang instan. | **Base UI Table + shadcn** |
| **Panel Bawah** | *Preview Pane* untuk membaca isi surat, melihat lampiran, dan riwayat threading tanpa pindah halaman. | **shadcn Card + Base UI Tabs** |
| **Resizable Divider** | Garis pemisah antara tabel (atas) dan detail (bawah) yang bisa digeser naik-turun sesuai kebutuhan user. | **shadcn Resizable** |

---

### 🚀 Fitur Unggulan & Optimasi Performa

Untuk mengatasi keluhan "performa lambat" pada sistem CodeIgniter lama, kita menerapkan:

* **Instant Rendering:** Perpindahan antar surat di panel bawah terjadi seketika tanpa *loading* ulang seluruh halaman berkat caching dari React Query.
* **Virtual Scrolling:** Tabel di panel atas hanya me-render data yang terlihat di layar, sehingga mencari di ribuan surat tetap terasa ringan.
* **Keyboard Friendly:** Mendukung navigasi panah atas/bawah untuk memilih surat, sangat efisien bagi *power user*.
* **Smart Indicators:** Penggunaan `Badge` berwarna kontras untuk kolom "Batas Respon" (Merah/Kuning/Hijau) agar urgensi surat langsung terlihat.

---

### 🎨 Estetika: "Korporat & Bersih"

Walaupun tata letaknya "Retro", tampilannya tetap modern dan profesional:

* **Clean UI:** Mengurangi garis-garis tabel yang terlalu tebal, menggantinya dengan *whitespace* yang pas dan tipografi tajam dari font sistem modern.
* **Adaptive Theme:** Mendukung *Dark Mode* untuk mengurangi kelelahan mata staf saat bekerja lembur.
* **Consistent Branding:** Tetap menggunakan aksen biru SmartOffice namun dengan palet warna yang lebih lembut dan elegan.