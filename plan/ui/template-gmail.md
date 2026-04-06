### 🏛️ Arsitektur Layout: "The Modern Gmail-Style"

Berbeda dengan Retro-Modern yang membagi layar, konsep ini menggunakan pendekatan **Single-Pane Focus** yang memaksimalkan area baca dan daftar surat secara bergantian.

| Komponen | Deskripsi Implementasi | Library / Tech |
| :--- | :--- | :--- |
| **Side-Dock Nav** | Sidebar kiri yang ramping dengan tombol "Tulis Baru" yang menonjol dan kategori folder yang bersih. | **shadcn/ui Nav + Button** |
| **Centralized Search** | Bar pencarian besar di bagian header sebagai pusat navigasi utama dengan filter canggih di dalamnya. | **shadcn Input + Base UI Popover** |
| **Unified Mail List** | Daftar surat yang memenuhi layar dengan *hover actions* (tombol cepat muncul saat kursor diarahkan ke baris surat). | **Base UI Table + shadcn Checkbox** |
| **Slide-In Detail** | Saat surat diklik, daftar surat menghilang dan digantikan oleh tampilan detail surat secara penuh (atau mode panel samping). | **React Router + shadcn Card** |

---

### 🚀 Fitur Unggulan & Optimasi Performa

Konsep ini membawa efisiensi "Gmail" ke dalam sistem internal kamu untuk membasmi masalah lambat:

* **Dynamic Action Toolbar:** Bar aksi (Arsip, Hapus, Disposisi) hanya muncul di atas saat ada satu atau lebih surat yang dicentang.
* **Threaded Conversation:** Menampilkan balasan surat dalam bentuk *accordion* atau tumpukan kartu yang rapi agar riwayat surat tidak berantakan.
* **Hover Interactions:** User bisa melakukan pengarsipan atau menghapus surat tanpa perlu membuka surat tersebut, cukup arahkan kursor saja.
* **Smart Filtering:** Pencarian instan yang langsung memfilter daftar surat saat user mulai mengetik tanpa perlu menekan tombol "Cari".

---

### 🎨 Estetika: "Modern, Minimalis & Familiar"

Tampilan ini adalah definisi dari "Korporat & Bersih" yang kamu inginkan:

* **White-Space Optimization:** Memberikan ruang antar elemen agar staf tidak merasa sesak saat melihat ribuan surat masuk.
* **Rounded Elements:** Penggunaan sudut-sudut komponen yang melengkung (*rounded*) memberikan kesan aplikasi yang ramah dan tidak kaku bagi staf gaptek.
* **High Readability:** Fokus pada tipografi yang kontras dan jelas, sehingga nomor surat dan perihal sangat mudah dibaca.
* **Breadcrumb Safety Net:** Selalu ada petunjuk posisi folder di bagian atas agar user tidak pernah merasa "tersesat" saat masuk ke detail surat yang dalam.