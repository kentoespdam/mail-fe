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
