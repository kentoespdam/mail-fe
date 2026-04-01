## 1\. Struktur Folder Memori

Jangan simpan semua di satu file `memory.md`. Pecah menjadi struktur folder `.context/` atau `.memory/` di root proyek Anda:

  * **`00_index.md`**: Peta jalan utama (High-level summary).
  * **`layers/`**: Memori spesifik arsitektur (UI, API, Database).
  * **`features/`**: Memori spesifik fitur atau modul besar.
  * **`decisions/`**: Log keputusan teknis (ADR - Architecture Decision Records).

-----

## 2\. Implementasi Indeks Berjenjang (Hub-and-Spoke)

Gunakan file indeks sebagai "konduktor". File ini hanya berisi deskripsi singkat dan *pointer* (jalur file) ke memori yang lebih detail.

### Contoh Isi `00_index.md`:

> **Project Scope:** Aplikasi E-commerce Dashboard.
>
> **Active Modules:**
>
>   * [Auth Layer](https://www.google.com/search?q=.memory/layers/auth.md) - Mengelola JWT dan RBAC.
>   * [Payment Module](https://www.google.com/search?q=.memory/features/stripe-integration.md) - Logika refund dan checkout.
>   * [State Management](https://www.google.com/search?q=.memory/layers/redux-structure.md) - Struktur store utama.

Saat Anda bekerja di bagian Auth, Anda cukup memerintahkan Claude: *"Baca `.memory/layers/auth.md` untuk memahami konteks login,"* tanpa ia harus memindai seluruh folder fitur lainnya.

-----

## 3\. Strategi "Atomic Memory" (Memecah File Besar)

Jika satu file memori sudah menyentuh lebih dari **100-150 baris**, saatnya melakukan *sharding* (pemecahan) berdasarkan sub-masalah:

1.  **Berdasarkan Domain:** Jika `auth.md` terlalu besar, pecah menjadi `auth-providers.md`, `auth-middleware.md`, dan `auth-schema.md`.
2.  **Berdasarkan Timeline:** Gunakan folder `archive/` untuk masalah yang sudah selesai atau kode yang sudah di-refactor total, agar tidak mengotori konteks aktif.
3.  **Pattern MCP (Model Context Protocol):** Jika Anda menggunakan alat yang mendukung MCP, Anda bisa membuat skrip lokal yang hanya melakukan `grep` pada file memori berdasarkan keyword tertentu.

-----

## 4\. Workflow Automasi Manual

Agar memori ini tetap akurat tanpa kerja keras, biasakan melakukan **"Context Dump"** setiap kali menyelesaikan tugas besar:

  * **Prompt ke Claude:** *"Saya baru saja menyelesaikan fitur X. Tolong ringkas perubahan arsitekturalnya ke dalam `.memory/features/X.md` dan update link-nya di `00_index.md`."*
  * **Hasil:** Claude akan menulis memorinya sendiri untuk digunakan di sesi berikutnya.

-----

## 5\. Keuntungan Menggunakan Layering

Dengan membagi memori menjadi **Global Indeks \> Layer/Domain \> Atomic Task**, Anda mendapatkan keuntungan:

  * **Token Efficiency:** Hanya file relevan yang masuk ke *context window*.
  * **No Redundancy:** Anda tidak perlu membaca ulang seluruh codebase karena file memori sudah berfungsi sebagai "Source of Truth" untuk logika bisnis yang tidak terlihat di kode (seperti alasan *mengapa* sebuah fungsi dibuat demikian).