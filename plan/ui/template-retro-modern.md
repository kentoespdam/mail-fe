### 🏛️ Arsitektur Layout: "Base Template The Retro-Modern"

Konsep ini dirancang untuk menyelesaikan masalah performa lambat sambil menjaga kenyamanan *power user* dan staf senior yang sudah terbiasa dengan sistem lama.

| Komponen | Deskripsi Implementasi | Library / Tech (Existing) |
| :--- | :--- | :--- |
| **TopBar (Panel Atas)** | Sticky header berisi logo SmartOffice, navigasi dropdown (Menubar), theme toggle, notifikasi, dan user profile. | **shadcn Menubar + DropdownMenu + Avatar** |
| **Content Area** | Container utama dengan auto-scroll dan gradient background subtle. Berisi DataTable untuk CRUD atau card view sesuai konteks halaman. | **TanStack React Table v8 + shadcn Card** |
| **DataTable** | Tabel padat informasi (sorting, search, filter, pagination, row selection, bulk action) untuk daftar surat/master data. | **@tanstack/react-table + shadcn Table** |
| **Footer** | *(Belum diimplementasi)* Sticky bottom untuk informasi copyright. | **shadcn Typography** |

---

### 📐 Existing Layout Structure

```
src/app/layout.tsx          → Root: fonts (Merriweather + Source Sans 3), TooltipProvider, CustomThemeProvider, Sonner
src/app/(main)/template.tsx → Protected: TopBar (sticky z-50) + main content (auto-scroll, gradient bg, container py-8 px-4)
```

**Navigasi:** TopBar dengan Menubar dropdown (bukan sidebar) — menu: Aplikasi, Arsip Surat, Publikasi, Master Mail.

---

### 🚀 Fitur Unggulan & Optimasi Performa

Untuk mengatasi keluhan "performa lambat" pada sistem CodeIgniter lama, kita menerapkan:

* **Instant Rendering:** Perpindahan antar halaman tanpa *full reload* berkat Next.js App Router + TanStack Query v5 caching.
* **Server-Side Pagination:** Data di-fetch per halaman via API proxy (`/api/proxy/*`), state pagination disinkronkan ke URL query params (`useQueryStates`).
* **Memoized Components:** DataTable dan komponen berat di-wrap `React.memo` untuk mencegah re-render tidak perlu.
* **Smart Indicators:** `Badge` berwarna kontras untuk status/urgensi (Merah/Kuning/Hijau) agar informasi langsung terlihat.
* **Keyboard Friendly:** *(Planned)* Navigasi panah atas/bawah untuk memilih surat di DataTable.
* **Virtual Scrolling:** *(Planned — belum ada library)* Untuk skenario ribuan baris tanpa pagination. Perlu tambah `@tanstack/react-virtual` jika dibutuhkan.

---

### 🎨 Estetika: "Korporat & Bersih"

Walaupun tata letaknya "Retro", tampilannya tetap modern dan profesional:

* **OKLch Color System:** Palet warna perceptually uniform dengan aturan 60-30-10 (dominant/secondary/accent). Light & dark mode via CSS variables.
* **Clean UI:** Tabel minimalis dengan whitespace yang pas, tipografi tajam (Merriweather heading + Source Sans 3 body).
* **Adaptive Theme:** Dark Mode via `next-themes` + `CustomThemeProvider`, transisi smooth 0.3s ease.
* **Consistent Branding:** Aksen biru SmartOffice dengan palet `mist` yang lembut dan elegan. Style: `base-mira`.
* **Custom Animations:** fadeInLeft, fadeInScale, waterStream, ripple, floatBubble, logoBounce.
* **Bahasa Indonesia:** Semua UI text, error, toast, pagination label dalam Bahasa Indonesia.

---

### 🧩 Existing Component Map

| Kategori | Komponen | Path |
| :--- | :--- | :--- |
| **Layout** | TopBar, TopMenu, UserProfileButton | `src/components/dashboard/` |
| **Data Display** | DataTable, DataTablePagination, Table | `src/components/ui/data-table.tsx`, `table.tsx` |
| **Form Builder** | InputText, InputNumber, InputPassword, InputFile, Checkbox, Select Controller | `src/components/builder/` |
| **UI Primitives** | Button, Card, Dialog, Badge, Input, Select, Tooltip, Avatar, Label | `src/components/ui/` |
| **Icons** | @tabler/icons-react, @hugeicons/react | — |

### 📊 DataTable Pattern (Existing)

Semua fitur CRUD mengikuti pola:
1. **Content Component** — Card wrapper + DataTable + Pagination + Dialogs
2. **Composite Hook** (`useXxxContent`) — mengelola pagination, sorting, search, dialog state, columns
3. **Query/Mutation Hooks** — TanStack Query untuk fetch & mutasi data
4. **Form Dialogs** — RHF + Zod validation, builder components
5. **Delete Dialog** — Reusable `DeleteConfirmDialog`

### 🗺️ Active Routes

| Path | Status |
|---|---|
| `/login` | Active |
| `/dashboard` | Stub |
| `/persuratan` | Stub |
| `/master/pesan-singkat` | Active (CRUD) |
| `/master/tipe-surat` | Active (CRUD) |
| `/master/kategori-surat` | Active (CRUD) |
| `/publikasi` | Active (CRUD) |
