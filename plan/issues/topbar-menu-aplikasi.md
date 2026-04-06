# Perbaikan Tombol Menu Aplikasi di TopBar

## Konteks

Saat ini tombol **"Menu Aplikasi"** berada di **sebelah kiri** TopBar, tepat di samping logo. Tombol ini menggunakan komponen `Menubar` + `MenubarTrigger` dengan teks "Menu Aplikasi" dan icon `IconLayoutDashboard`.

### Masalah
1. **Posisi kurang optimal** — tombol navigasi utama berada di kiri bersama logo, padahal best practice menempatkan action/navigation di sisi kanan agar mudah dijangkau (terutama di mobile)
2. **Hilang di mobile** — tombol dibungkus `hidden lg:block`, sehingga pengguna mobile **tidak bisa mengakses navigasi sama sekali**
3. **Kurang aksesibel** — tidak ada tooltip yang menjelaskan fungsi tombol, hanya label teks biasa

---

## Fitur yang Akan Dibuat

### A. Pindahkan Tombol Menu Aplikasi ke Sisi Kanan

**Deskripsi:**
Tombol "Menu Aplikasi" dipindahkan dari Left Section (bersama logo) ke **Right Section** (bersama theme toggle, notifikasi, dan user profile).

**Posisi terbaik (referensi):**
Berdasarkan best practice UI/UX untuk top bar navigation:
- Posisi ideal: **paling kiri di Right Section**, sebelum ThemeToggle
- Urutan Right Section menjadi: `[Menu Aplikasi] [ThemeToggle] [Notifikasi] [User Info] [Divider] [UserProfile]`
- Alasan: Menu Aplikasi adalah navigasi utama, jadi ditempatkan paling awal di area aksi. ThemeToggle dan Notifikasi adalah utility/secondary action, lalu User Profile di paling kanan (pattern umum: avatar/profile selalu di ujung kanan)

**Referensi pattern:**
- Google Workspace: navigasi utama (apps grid) di kanan, sebelum avatar
- GitHub: menu navigasi di kanan header, sebelum avatar
- Gmail: app switcher di kanan, sebelum profile

### B. Responsif di Mobile — Icon-Only Mode

**Deskripsi:**
Tombol Menu Aplikasi **tidak boleh hilang** di layar kecil. Saat ini class `hidden lg:block` menyembunyikan seluruh navigasi di mobile.

**Solusi:**
- Tampilkan tombol Menu Aplikasi di **semua ukuran layar**
- Di layar kecil (< `lg`): tampilkan **hanya icon** (`IconLayoutDashboard`) tanpa teks "Menu Aplikasi"
- Di layar besar (≥ `lg`): tampilkan icon + teks seperti semasa ini
- Gunakan responsive class Tailwind: `<span className="hidden lg:inline">Menu Aplikasi</span>` pada teks label

### C. Tambahkan Tooltip pada Tombol Menu Aplikasi

**Deskripsi:**
Tambahkan tooltip yang muncul saat hover/focus pada tombol Menu Aplikasi untuk meningkatkan aksesibilitas.

**Implementasi:**
- Gunakan komponen `TooltipButton` yang sudah ada di project (`src/components/ui/tooltip-button.tsx`) sebagai referensi pattern
- Atau langsung gunakan `Tooltip` + `TooltipTrigger` + `TooltipContent` dari `src/components/ui/tooltip.tsx`
- Tooltip text: **"Menu Aplikasi"**
- Tooltip khususnya berguna di mobile mode (icon-only) agar user tahu fungsi tombol
- Tambahkan juga `aria-label="Menu Aplikasi"` pada trigger untuk screen reader

---

## Perubahan pada Existing Project

### File yang Diubah

| File | Perubahan |
|---|---|
| `src/components/dashboard/topbar.tsx` | Pindahkan `<nav>` dari Left Section ke Right Section. Hapus `hidden lg:block` wrapper. |
| `src/components/dashboard/top-menu.tsx` | Update `MenubarTrigger` agar teks responsif (hidden di mobile, visible di desktop). Bungkus dengan Tooltip. Tambahkan `aria-label`. |

### File Referensi (Tidak Diubah)

| File | Fungsi |
|---|---|
| `src/components/ui/tooltip.tsx` | Komponen Tooltip yang sudah tersedia |
| `src/components/ui/tooltip-button.tsx` | Pattern penggunaan Tooltip pada Button (referensi) |
| `src/components/ui/menubar.tsx` | Komponen Menubar dari base-ui (tidak perlu diubah) |

---

## Langkah-Langkah Pengerjaan

### Langkah 1: Riset Best Practice
> **Gunakan `context7`** untuk mencari dokumentasi terbaru:
> ```bash
> npx ctx7@latest library "base-ui" "menubar trigger with tooltip accessible"
> npx ctx7@latest library "tailwindcss" "responsive hidden show mobile breakpoint"
> ```
> Cari tahu best practice untuk:
> - Bagaimana menambahkan Tooltip pada MenubarTrigger tanpa konflik event
> - Pattern responsive icon-only button di Tailwind

### Langkah 2: Pindahkan Navigasi ke Right Section
1. Buka `src/components/dashboard/topbar.tsx`
2. **Hapus** blok `<nav className="hidden lg:block">...</nav>` dari Left Section
3. **Tambahkan** blok `<nav>` di Right Section, **sebelum** `<ThemeToggle />`
4. Hapus class `hidden lg:block` dari `<nav>` — tombol harus selalu terlihat
5. Pastikan Left Section hanya berisi `<SmartOfficeIcon />`

### Langkah 3: Buat Tombol Responsif (Icon-Only di Mobile)
1. Buka `src/components/dashboard/top-menu.tsx`
2. Pada `MenubarTrigger`, ubah label teks menjadi responsif:
   - Icon `IconLayoutDashboard` selalu tampil
   - Teks "Menu Aplikasi" dibungkus dengan `<span>` yang memiliki class `hidden lg:inline`
3. Pastikan `MenubarTrigger` tetap memiliki minimum touch target 44px di mobile (`min-h-10 min-w-10` atau sejenisnya)

### Langkah 4: Tambahkan Tooltip
1. Baca file `src/components/ui/tooltip-button.tsx` sebagai referensi pattern
2. Bungkus `MenubarTrigger` (atau keseluruhan `Menubar`) dengan komponen `Tooltip`
3. Set tooltip text = "Menu Aplikasi"
4. Set tooltip `side="bottom"` agar muncul di bawah TopBar
5. Tambahkan `aria-label="Menu Aplikasi"` pada `MenubarTrigger`

### Langkah 5: Verifikasi & Testing
1. Buka aplikasi di browser — pastikan tombol Menu Aplikasi ada di **kanan**, sebelum ThemeToggle
2. Resize browser ke ukuran mobile (< 1024px) — pastikan tombol masih terlihat, hanya icon
3. Resize kembali ke desktop (≥ 1024px) — pastikan icon + teks muncul
4. Hover tombol — pastikan tooltip "Menu Aplikasi" muncul
5. Klik tombol — pastikan dropdown menu navigasi tetap berfungsi normal
6. Cek aksesibilitas: fokus dengan keyboard (Tab), pastikan tooltip dan menu bisa diakses

---

## Checkpoint

| # | Checkpoint | Kriteria Selesai |
|---|---|---|
| 1 | Menu Aplikasi pindah ke kanan | Tombol berada di Right Section, sebelum ThemeToggle |
| 2 | Left Section bersih | Left Section hanya berisi logo SmartOfficeIcon |
| 3 | Responsif mobile | Di layar < 1024px: hanya icon, tanpa teks |
| 4 | Responsif desktop | Di layar ≥ 1024px: icon + teks "Menu Aplikasi" |
| 5 | Tooltip aktif | Hover/focus menampilkan tooltip "Menu Aplikasi" |
| 6 | Dropdown berfungsi | Klik tombol membuka dropdown navigasi seperti semula |
| 7 | Aksesibilitas | `aria-label` ada, keyboard navigation berfungsi |
| 8 | Touch target mobile | Tombol minimal 44x44px di mobile (accessibility standard) |

---

## Catatan Penting

- **Jangan ubah** isi dropdown menu (MenuAplikasi) — hanya ubah posisi dan wrapper-nya
- **Jangan ubah** komponen UI primitif (`menubar.tsx`, `tooltip.tsx`) — gunakan apa adanya
- Pastikan `<Providers>` wrapper tetap ada saat memindahkan `<TopBarMenu />`
- Test di **light mode dan dark mode** — pastikan tampilan konsisten
