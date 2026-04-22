# Mail Viewer Feature Memory

## Recent Changes

### Auto-close Popover & Mobile Sidebar Sheet
- **Issue:** Popover tidak otomatis tertutup saat klik child folder (Desktop Collapsed) dan Sidebar Sheet tidak otomatis tertutup saat klik folder (Mobile).
- **Solution:** 
    - Mengubah `Popover` menjadi controlled component menggunakan state `openPopoverId`.
    - Implementasi handler terpadu `handleSelectFolder` untuk menangani seleksi folder dan penutupan otomatis sidebar di mobile.
- **Details:**
    - **Desktop Collapsed:** Klik child di popover akan memicu `setOpenPopoverId(null)` yang langsung menutup popover.
    - **Mobile:** Klik folder apapun (tanpa children atau child folder) memicu `setOpenMobile(false)` untuk menutup sheet sidebar secara otomatis.
    - **Desktop Expanded:** Sidebar tetap terbuka (tidak ada perubahan behavior).
    - Mempertahankan unread badge dan tooltip behavior di semua mode.
- **Files Modified:**
    - `src/components/persuratan/mail-folder-tree.tsx`

### Sticky Header Table Integration in MailList
- **Issue:** Header kolom di MailList hilang saat daftar surat yang panjang di-scroll di panel atas `ResizablePanel`.
- **Solution:** 
    - Implementasi `StickyDataTable` sebagai jembatan antara TanStack Table dan primitif `StickyTable`.
    - Integrasi `StickyDataTable` ke `MailList` dengan mengganti `DataTable` existing.
- **Details:**
    - **Sticky Header:** Header tetap terlihat saat scroll body secara vertikal.
    - **Responsive:** Scroll horizontal tetap berfungsi tanpa memecah sticky behavior.
    - **Logic Preservation:** Sorting, row selection highlight, unread indicator, dan pagination tetap berfungsi normal.
    - **Clean Architecture:** Menggunakan pola composition (Opsi A) sehingga `StickyDataTable` dapat digunakan kembali di halaman lain.
    - **UI/UX:** Loading skeleton dan empty state diimplementasikan dengan tetap menjaga header terlihat.
- **Files Modified/Created:**
    - `src/components/ui/sticky-data-table.tsx` (Baru)
    - `src/components/persuratan/mail-list.tsx` (Update)

### Color Harmonization & UI/UX Refinement
- **Issue:** Inkonsistensi warna antara Topbar, Sidebar, dan Workspace yang menyebabkan hierarki visual kurang tajam dan kelelahan mata pada penggunaan jangka panjang.
- **Solution:** 
    - Redesign sistem token menggunakan OKLch di `globals.css` dengan penambahan token `--topbar`.
    - Harmonisasi `TopBar`, `Sidebar`, dan `Template` utama untuk menciptakan separasi visual yang jelas (Chrome vs Workspace).
    - Normalisasi warna logo dan ikon folder menggunakan design tokens (Zero literal colors).
- **Details:**
    - **Navigation Zone:** Topbar kini menggunakan background netral (White/Dark Card) untuk mengurangi distraksi. Sidebar memiliki separasi visual yang lebih tajam dari content area.
    - **Workspace Zone:** Area konten utama menggunakan background solid yang bersih untuk meningkatkan readability.
    - **Accessibility:** Seluruh kombinasi warna memenuhi standar WCAG AA (Contrast >= 4.5:1).
    - **Iconography:** Ikon folder di Sidebar diharmonisasi menggunakan variasi opacity warna primer, menciptakan tampilan institusional yang profesional.
- **Files Modified:**
    - `src/app/globals.css`
    - `src/app/(main)/template.tsx`
    - `src/components/dashboard/topbar.tsx`
    - `src/components/ui/smart-office-icon.tsx`
    - `src/components/persuratan/mail-folder-tree.tsx`
    - `src/components/auth/login-form.tsx`
