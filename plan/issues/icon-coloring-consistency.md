# Konsistensi Warna & Styling Icon — Palet PDAM Water Blue

## Konteks

Aplikasi persuratan PERUMDAM Tirta Satria menggunakan library **`@tabler/icons-react`** dengan **47 jenis icon** tersebar di **26 file**. Saat ini styling icon **tidak konsisten** — ada yang pakai `h-4 w-4`, ada `size-4`, ada yang punya warna eksplisit, ada yang inherit dari parent. Ini perlu distandarisasi agar selaras dengan palet **PDAM Water Blue** dan aturan **60:30:10**.

> **Referensi palet warna:** Lihat `plan/ui/refractor-template.md` untuk detail palet Water Blue.

---

## Hasil Audit Icon Saat Ini

### Inkonsistensi yang Ditemukan

| Masalah | Contoh | File |
|---|---|---|
| **Ukuran bervariasi** | `h-4 w-4`, `size-4`, `h-5 w-5`, `h-3.5 w-3.5`, `h-10 w-10` dipakai tanpa aturan jelas | Tersebar di 26 file |
| **Warna tidak konsisten** | Bell icon di topbar tanpa warna, tapi search icon pakai `text-muted-foreground` | `topbar.tsx`, `data-table.tsx` |
| **Edit/Delete tanpa warna** | Publication table icon edit/delete tidak punya warna, tapi hook-based punya `text-info`/`text-destructive` | `publication-table.tsx` vs `*-hooks.tsx` |
| **Implicit vs Explicit** | Beberapa icon di `menubar.tsx`, `dropdown-menu.tsx` inherit warna dari parent, tidak eksplisit | UI primitif |

### Peta Penggunaan Icon per Kategori

| Kategori | Icon | Lokasi | Ukuran Saat Ini | Warna Saat Ini |
|---|---|---|---|---|
| **Navigasi (TopBar)** | IconBell | `topbar.tsx` | `h-5 w-5` | Tidak ada (inherit) |
| **Navigasi (Menu)** | IconLayoutDashboard, dll (9 icon) | `top-menu.tsx` | `size-5 lg:size-4` | Tidak ada (inherit) |
| **Navigasi (Tab)** | IconListLetters, IconCategory, IconMailFast | `master/template.tsx` | `h-4 w-4` | Tidak ada (inherit) |
| **User Profile** | IconUser, IconKey, IconSettings, IconLogout | `user-profile-button.tsx` | `mr-2 h-4 w-4` | Tidak ada (inherit) |
| **Theme** | IconSun, IconMoon | `theme-toggle.tsx` | `h-4 w-4` | Tidak ada (inherit) |
| **Aksi Tabel (Copy)** | IconCopy | `*-hooks.tsx` | `size-4` | `text-muted-foreground` |
| **Aksi Tabel (Edit)** | IconPencil | `*-hooks.tsx` | `size-4` | `text-info` |
| **Aksi Tabel (Delete)** | IconTrash | `*-hooks.tsx` | `size-4` | `text-destructive` |
| **Card Title** | IconTemplate, IconMail, IconMessage, IconCategory | `*-content.tsx` | Varies | `text-muted-foreground` |
| **Empty State** | IconMessage, IconMail, IconCategory | `*-content.tsx` | `h-10 w-10` | `opacity-60` |
| **Data Table** | IconSearch, IconSort*, IconChevron* | `data-table.tsx` | `h-4 w-4` | Varies |
| **Form Input** | Dynamic icon prop | `input-*-controll.tsx` | `size-4` | `text-muted-foreground` |
| **Toast/Sonner** | IconCircleCheck, IconAlert*, IconLoader | `sonner.tsx` | `size-4` | Sesuai tipe toast |
| **Audit Trail** | IconClock | `audit-trail-info.tsx` | `h-3.5 w-3.5` | Tidak ada |

---

## Standar Icon yang Harus Diterapkan

### Aturan Ukuran

| Konteks | Ukuran Standar | Class Tailwind |
|---|---|---|
| **Default** (navigasi, menu, tabel, form) | 16px | `size-4` |
| **TopBar icon button** (bell, theme) | 20px | `size-5` |
| **Empty State** (placeholder besar) | 40px | `size-10` |
| **Micro** (audit trail, badge) | 14px | `size-3.5` |

> **Catatan:** Gunakan `size-*` (bukan `h-* w-*`) untuk konsistensi. `size-4` = `h-4 w-4`.

### Aturan Warna (Sesuai Palet Water Blue + 60:30:10)

| Konteks | Warna | Class Tailwind | Zona |
|---|---|---|---|
| **Navigasi pasif** (menu, tab tidak aktif, sidebar) | Biru-gray medium | `text-muted-foreground` | 30% |
| **Navigasi aktif** (tab aktif, menu hover) | Water Blue | `text-primary` | 10% |
| **Aksi netral** (copy, search, sort) | Biru-gray medium | `text-muted-foreground` | 30% |
| **Aksi edit** | Biru info | `text-info` | 10% |
| **Aksi hapus** | Merah | `text-destructive` | 10% |
| **TopBar utility** (bell, theme) | Inherit dari parent | Tidak perlu class warna | 30% |
| **Card title icon** | Biru-gray medium | `text-muted-foreground` | 30% |
| **Empty state** | Pudar | `text-muted-foreground/40` atau `opacity-40` | 60% |
| **Form input icon** | Biru-gray medium | `text-muted-foreground` | 30% |
| **Toast** | Sesuai tipe (success/error/warning/info) | Biarkan sesuai sonner config | 10% |

### Aturan Hover & Transisi

| Konteks | Hover State | Class Tailwind |
|---|---|---|
| **Tombol aksi tabel** | Warna lebih kuat + background subtle | `hover:text-primary hover:bg-primary/10` (edit), `hover:text-destructive hover:bg-destructive/10` (delete) |
| **Icon navigasi** | Warna foreground | `hover:text-foreground` |
| **Sort indicator** | Muncul saat hover kolom | `opacity-0 group-hover:opacity-100 transition-opacity` |

### Aksesibilitas

- Semua icon button **wajib** punya `aria-label` yang deskriptif (dalam Bahasa Indonesia)
- Icon dekoratif (di samping teks) tambahkan `aria-hidden="true"` agar screen reader skip
- Contrast ratio minimal **4.5:1** untuk icon interaktif terhadap background
- Touch target minimal **44x44px** untuk icon button di mobile

---

## Langkah-Langkah Pengerjaan

### Langkah 1: Riset Best Practice

> **Gunakan `context7`** untuk mencari dokumentasi dan best practice:
> ```bash
> npx ctx7@latest library "tabler-icons" "icon sizing color accessibility react"
> npx ctx7@latest library "tailwindcss" "size utility class icon styling responsive"
> npx ctx7@latest library "base-ui" "accessibility aria-label icon button"
> ```
> Cari tahu:
> - Best practice ukuran icon dalam design system
> - Pattern aksesibilitas untuk icon-only button
> - Cara konsisten styling icon di Tailwind v4

### Langkah 2: Standarisasi Ukuran Icon

**Tujuan:** Semua icon menggunakan class `size-*` (bukan `h-* w-*`).

1. **Dashboard components** (`src/components/dashboard/`)
   - `topbar.tsx`: Ganti `h-5 w-5` pada IconBell → `size-5`
   - `user-profile-button.tsx`: Ganti `mr-2 h-4 w-4` → `mr-2 size-4`
   - `top-menu.tsx`: Pastikan semua icon konsisten `size-4` (atau `size-5 lg:size-4` jika responsif)

2. **Master template** (`src/app/(master)/master/template.tsx`)
   - Ganti `h-4 w-4` pada tab icon → `size-4`

3. **UI components** (`src/components/ui/`)
   - `theme-toggle.tsx`: Ganti `h-4 w-4` → `size-4`
   - `data-table.tsx`: Ganti semua `h-4 w-4` → `size-4`
   - `audit-trail-info.tsx`: Ganti `h-3.5 w-3.5` → `size-3.5`

4. **Content components** (`src/components/*/`)
   - Standarisasi empty state icon → `size-10`
   - Card title icon → `size-4`

### Langkah 3: Standarisasi Warna Icon

**Tujuan:** Semua icon punya warna eksplisit sesuai aturan Water Blue.

1. **Navigasi TopBar** — `topbar.tsx`
   - IconBell: tambahkan `text-secondary-foreground` (karena TopBar = zona 30%)

2. **Menu navigasi** — `top-menu.tsx`
   - Semua icon di MenubarTrigger dan MenubarItem: pastikan `text-muted-foreground`
   - Atau biarkan inherit jika parent sudah set warna yang benar

3. **Tab icon** — `master/template.tsx`
   - Icon di tab aktif: warna harus ikut teks (otomatis via parent `data-active:text-primary`)
   - Icon di tab tidak aktif: `text-muted-foreground` (otomatis via parent)

4. **Aksi tabel** — `*-hooks.tsx` dan `publication-table.tsx`
   - **Samakan pattern** publication table dengan hooks:
     - Copy: `text-muted-foreground hover:bg-muted/50 hover:text-foreground`
     - Edit: `text-info hover:bg-primary/10 hover:text-primary`
     - Delete: `text-destructive hover:bg-destructive/10 hover:text-destructive`

5. **Card title icon** — `*-content.tsx`
   - Pastikan semua pakai `text-muted-foreground` secara eksplisit

6. **Empty state icon** — `*-content.tsx`
   - Standarisasi ke `text-muted-foreground/40` (bukan `opacity-60`)

7. **Form input icon** — `input-*-controll.tsx`
   - Sudah benar: `text-muted-foreground` ✓

8. **Audit trail** — `audit-trail-info.tsx`
   - Tambahkan `text-muted-foreground`

### Langkah 4: Tambahkan Aksesibilitas

**Tujuan:** Semua icon button punya `aria-label`, icon dekoratif punya `aria-hidden`.

1. **Icon button** (tombol yang hanya berisi icon):
   - `topbar.tsx` → IconBell button: sudah ada `aria-label="Notifikasi"` ✓
   - `theme-toggle.tsx` → Pastikan ada `aria-label="Ganti Tema"`
   - Semua `TooltipButton` di aksi tabel → Pastikan ada `aria-label`

2. **Icon dekoratif** (icon di samping teks):
   - Menu item icon (top-menu.tsx): tambahkan `aria-hidden="true"` pada setiap icon
   - Card title icon: tambahkan `aria-hidden="true"`
   - Tab icon (template.tsx): tambahkan `aria-hidden="true"`

3. **Empty state icon**:
   - Tambahkan `aria-hidden="true"` karena murni dekoratif

### Langkah 5: Verifikasi & Testing

1. **Visual check** — Buka setiap halaman aktif:
   - `/master/tipe-surat`
   - `/master/kategori-surat`
   - `/master/pesan-singkat`
   - `/publikasi`
2. **Konsistensi warna** — Pastikan semua icon navigasi bernuansa biru-gray (`muted-foreground`)
3. **Hover state** — Pastikan aksi tabel punya hover yang jelas dan konsisten
4. **Dark mode** — Toggle theme dan pastikan warna icon tetap readable
5. **Mobile** — Resize browser, pastikan icon tidak terpotong dan touch target cukup
6. **Screen reader** — Test dengan keyboard navigation, pastikan `aria-label` terbaca

---

## Checkpoint

| # | Checkpoint | Kriteria Selesai |
|---|---|---|
| 1 | Ukuran standar | Semua icon menggunakan `size-*` class, bukan `h-* w-*` |
| 2 | Warna navigasi | Semua icon navigasi (menu, tab, user profile) pakai `text-muted-foreground` |
| 3 | Warna aksi tabel | Copy = `text-muted-foreground`, Edit = `text-info`, Delete = `text-destructive` |
| 4 | Hover state konsisten | Semua icon aksi punya hover background + warna lebih kuat |
| 5 | Publication table | Icon edit/delete di publication table sama pattern-nya dengan hooks |
| 6 | Empty state | Semua empty state icon pakai `size-10 text-muted-foreground/40` |
| 7 | Aksesibilitas button | Semua icon-only button punya `aria-label` dalam Bahasa Indonesia |
| 8 | Aksesibilitas dekoratif | Semua icon dekoratif punya `aria-hidden="true"` |
| 9 | Dark mode | Semua icon readable dan kontras cukup di dark mode |
| 10 | Konsistensi cross-page | Tampilan icon identik di semua halaman master dan publikasi |

---

## Daftar File yang Perlu Diubah

| # | File | Perubahan |
|---|---|---|
| 1 | `src/components/dashboard/topbar.tsx` | Ukuran icon bell → `size-5`, tambah warna |
| 2 | `src/components/dashboard/top-menu.tsx` | Standarisasi ukuran & warna, `aria-hidden` pada icon dekoratif |
| 3 | `src/components/dashboard/user-profile-button.tsx` | Ukuran → `size-4`, `aria-hidden` |
| 4 | `src/app/(master)/master/template.tsx` | Ukuran tab icon → `size-4`, `aria-hidden` |
| 5 | `src/components/ui/theme-toggle.tsx` | Ukuran → `size-4`, `aria-label` |
| 6 | `src/components/ui/data-table.tsx` | Ukuran → `size-4`, warna standar |
| 7 | `src/components/ui/audit-trail-info.tsx` | Ukuran → `size-3.5`, tambah warna |
| 8 | `src/components/quick-message/quick-message-content.tsx` | Standarisasi card icon & empty state |
| 9 | `src/components/mail-type/mail-type-content.tsx` | Standarisasi card icon & empty state |
| 10 | `src/components/mail-category/mail-category-content.tsx` | Standarisasi card icon & empty state |
| 11 | `src/components/publication/publication-content.tsx` | Standarisasi card icon |
| 12 | `src/components/publication/publication-table.tsx` | Samakan pattern aksi dengan hooks |
| 13 | `src/hooks/quick-message-hooks.tsx` | Review & pastikan pattern sudah benar |
| 14 | `src/hooks/mail-type-hooks.tsx` | Review & pastikan pattern sudah benar |
| 15 | `src/hooks/mail-category-hooks.tsx` | Review & pastikan pattern sudah benar |

---

## Catatan Penting

- **Jangan ubah** komponen UI primitif (`menubar.tsx`, `dropdown-menu.tsx`, `select.tsx`, `dialog.tsx`) — ini shadcn base components, biarkan inherit
- **Jangan ubah** `sonner.tsx` — toast sudah punya warna sesuai tipe notifikasi
- **Prioritaskan** file dashboard dan content components — ini yang paling sering dilihat user
- Test di **light mode dan dark mode** setelah setiap perubahan
- Semua teks UI dan `aria-label` dalam **Bahasa Indonesia**
