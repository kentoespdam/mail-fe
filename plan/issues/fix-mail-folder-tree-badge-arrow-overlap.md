# Fix: Angka (Badge) dan Icon Panah Saling Bertumpuk pada MailFolderTree

## Context

Pada sidebar `/persuratan`, komponen `MailFolderTree` menampilkan folder tree dengan fitur collapsible. **Masalah:** angka unread count dan icon panah (chevron) saling bertumpuk/overlap pada folder yang memiliki children (collapsible items).

### Screenshot Masalah

Terlihat pada folder "eOffice Mailbox" — angka `347` dan icon panah chevron bertumpuk sehingga angka tidak terbaca dengan jelas (tampak seperti `3↕7`). Masalah serupa terlihat pada "Personal Folder" dengan angka `56`.

### Akar Masalah

Di file `src/components/persuratan/mail-folder-tree.tsx`, pada **root-level collapsible folders** (level === 0, baris 105-113), layout-nya:

```
SidebarMenuButton (flex container)
├── Icon
├── Folder name
└── IconChevronRight (ml-auto)    ← icon panah di dalam button
+ SidebarMenuBadge (absolute right-1) ← badge di luar button, posisi absolute
```

**`SidebarMenuBadge`** menggunakan `position: absolute; right: 4px` — menempel di kanan `SidebarMenuItem`. Sementara **`IconChevronRight`** ada di dalam `SidebarMenuButton` dengan `ml-auto` — juga terdorong ke kanan. Keduanya menempati area yang sama sehingga **bertumpuk secara visual**.

Pada **sub-level collapsible folders** (level > 0, baris 88-103), masalah berbeda tapi serupa:

```
SidebarMenuSubButton (flex container)
├── div (icon + nama)
├── span.ml-auto (unread count)   ← badge inline
└── IconChevronRight.ml-auto      ← chevron inline
```

Kedua elemen menggunakan `ml-auto` dalam satu flex container, menyebabkan mereka berkompetisi untuk posisi paling kanan.

## Referensi Best Practice (shadcn/ui)

Berdasarkan dokumentasi shadcn/ui:

1. **`SidebarMenuBadge`** didesain untuk ditempatkan **sejajar (sibling)** dengan `SidebarMenuButton` di dalam `SidebarMenuItem` — bukan bersama chevron di dalam button.
2. Untuk **collapsible menu items**, pattern yang direkomendasikan:
   - Chevron berada **di dalam** `SidebarMenuButton` / `CollapsibleTrigger`
   - Badge berada **di luar** button, sebagai sibling di `SidebarMenuItem`
3. `SidebarMenuBadge` sudah memiliki styling `absolute right-1` yang otomatis memposisikan badge di kanan.

## File yang Perlu Diubah

| File | Aksi |
|---|---|
| `src/components/persuratan/mail-folder-tree.tsx` | **EDIT** — perbaiki layout badge dan chevron |

**JANGAN** ubah file lain (sidebar.tsx, persuratan-content.tsx, dll).

## Tool / Skill Wajib Digunakan

Selama implementasi, **gunakan tools berikut**:

### 1. Context7 (MCP)

Fetch dokumentasi terbaru sebelum coding:

```
// Resolusi library ID
mcp: resolve-library-id → "shadcn/ui" dengan query "sidebar menu badge collapsible"

// Fetch docs
mcp: query-docs → /shadcn-ui/ui dengan query "SidebarMenuBadge positioning with collapsible menu items"
```

Gunakan dokumentasi ini sebagai acuan untuk memastikan implementasi sesuai pattern shadcn/ui terbaru.

### 2. MCP next-devtools

Gunakan untuk monitoring error:

- **`get_errors`** — cek error setelah setiap perubahan
- **`get_page_metadata`** — verifikasi halaman `/persuratan` masih render dengan benar
- **`get_routes`** — verifikasi route `/persuratan` masih valid

## Langkah Implementasi

### Langkah 1: Pelajari Referensi (WAJIB)

Sebelum mulai coding:

1. **Gunakan Context7** untuk fetch dokumentasi sidebar dan badge dari shadcn/ui:
   - Query: "SidebarMenuBadge positioning with SidebarMenuButton and collapsible"
   - Query: "sidebar collapsible menu items with badge count"
2. **Baca file** `src/components/persuratan/mail-folder-tree.tsx` — pahami struktur saat ini
3. **Baca file** `src/components/ui/sidebar.tsx` — pahami styling `SidebarMenuBadge` dan `SidebarMenuButton`
4. **Gunakan MCP `get_page_metadata`** untuk konteks halaman `/persuratan`

### Langkah 2: Perbaiki Layout Root-Level Collapsible (level === 0)

**Masalah:** `SidebarMenuBadge` (absolute positioned) dan `IconChevronRight` (di dalam button) menempati area kanan yang sama.

**Solusi:** Pastikan `SidebarMenuBadge` memiliki cukup ruang dan tidak tertimpa chevron. Ada 2 pendekatan:

#### Pendekatan A: Beri padding-right pada SidebarMenuButton (Recommended)
- Tambahkan class padding-right pada `SidebarMenuButton` ketika folder punya unread > 0
- Ini memberi ruang agar chevron tidak overlap dengan badge yang absolute-positioned

#### Pendekatan B: Pindahkan badge ke dalam button
- Letakkan unread count sebagai inline element di dalam `SidebarMenuButton`, **sebelum** chevron
- Hapus `SidebarMenuBadge` untuk item collapsible, gunakan `<span>` inline sebagai gantinya
- Pastikan ada `gap` atau margin yang cukup antara badge dan chevron

**Pilih pendekatan yang paling clean dan sesuai pattern shadcn/ui berdasarkan hasil Context7.**

### Langkah 3: Perbaiki Layout Sub-Level Collapsible (level > 0)

**Masalah:** Dua elemen (`span` unread dan `IconChevronRight`) sama-sama menggunakan `ml-auto`.

**Solusi:**
- Hapus `ml-auto` dari salah satu elemen
- Bungkus unread count dan chevron dalam satu `div` dengan layout flex dan gap
- Contoh struktur yang benar:

```
SidebarMenuSubButton (flex)
├── div (icon + nama, flex-1 truncate)
└── div (flex items-center gap-1) ← wrapper baru
    ├── span (unread count)
    └── IconChevronRight (chevron)
```

### Langkah 4: Verifikasi Konsistensi

Pastikan semua 3 jenis folder rendering konsisten:
1. **Root collapsible** (hasChildren, level 0) — badge + chevron tidak overlap
2. **Sub-level collapsible** (hasChildren, level > 0) — badge + chevron tidak overlap
3. **Leaf items** (no children) — badge tampil normal (ini sudah benar, jangan ubah)

### Langkah 5: Testing & Finalisasi

#### 5a. MCP Error Check
Gunakan MCP tool `get_errors` — pastikan tidak ada runtime error.

#### 5b. Build Check
```bash
bun run build
```
Pastikan TIDAK ada TypeScript error atau build failure.

#### 5c. Lint Check
```bash
bun run lint
```

#### 5d. Visual Test Checklist

Buka `http://localhost:3000/persuratan` dan verifikasi:

- [ ] Angka unread pada "eOffice Mailbox" (root collapsible) terbaca jelas, tidak tertumpuk chevron
- [ ] Angka unread pada "Personal Folder" (root collapsible) terbaca jelas
- [ ] Angka unread pada sub-folder (misal "Inbox 314") terbaca jelas, tidak tertumpuk chevron expand
- [ ] Chevron rotate saat expand/collapse masih berfungsi smooth
- [ ] Klik folder masih memilih folder dengan benar
- [ ] Folder tanpa unread (misal "Sent Items") tampil normal tanpa badge
- [ ] Sidebar collapsed state (icon-only) masih berfungsi
- [ ] Tidak ada layout shift atau overflow

## Catatan Penting

- **JANGAN** ubah file `src/components/ui/sidebar.tsx` — masalah ada di cara penggunaan, bukan di komponen UI
- **JANGAN** ubah props interface `MailFolderTreeProps`
- **JANGAN** ubah logic tree traversal (`useMailFolderTree`) — hanya perbaiki layout/rendering
- **Gunakan Context7 dan MCP next-devtools** di setiap langkah untuk validasi
- Perubahan harus **minimal** — hanya fix layout overlap, jangan refactor hal lain
- Pastikan **build berhasil** sebelum menganggap selesai
