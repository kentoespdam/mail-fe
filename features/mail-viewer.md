# Mail Viewer Feature Memory

## Recent Changes

### MailFolderTree Collapsed Mode Expansion
- **Issue:** Folder dengan children tidak bisa di-expand saat sidebar dalam kondisi collapsed (icon-only).
- **Solution:** Menambahkan jalur rendering khusus untuk mode collapsed menggunakan component `Popover` dari shadcn/ui.
- **Details:**
    - Saat sidebar expanded: Tetap menggunakan behavior `Collapsible` inline.
    - Saat sidebar collapsed: Menggunakan `Popover` yang muncul di sebelah kanan icon folder.
    - Popover berisi daftar children folder tersebut yang bisa diklik untuk navigasi.
    - Menggunakan hook `useSidebar` untuk mendeteksi state sidebar.
    - Styling popover disesuaikan dengan tema sidebar (`bg-sidebar`, `text-sidebar-foreground`).
- **Files Modified:**
    - `src/components/persuratan/mail-folder-tree.tsx`
    - `src/components/ui/popover.tsx` (Created via shadcn CLI)
