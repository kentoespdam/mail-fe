# Issue: Auto-close Popover (Desktop Collapsed) & Auto-close Sidebar Sheet (Mobile) saat Klik Folder

## Context

Halaman `/persuratan` menggunakan shadcn `Sidebar collapsible="icon"` yang mendukung 3 mode tampilan:

1. **Desktop expanded** — sidebar lebar normal, folder pakai `Collapsible` inline dengan chevron
2. **Desktop collapsed icon-only** — sidebar hanya icon; folder dengan children buka `Popover` di sisi kanan
3. **Mobile (< 768px)** — sidebar jadi `Sheet` (drawer) yang muncul dari samping

**Dua masalah UX yang perlu diperbaiki:**

### Masalah A — Popover tidak tertutup saat klik child (Desktop collapsed)
Setelah user klik child folder di dalam `PopoverContent`, folder memang terpilih (`onSelectFolder` dipanggil), **tapi popover tidak otomatis tertutup**. User harus klik di luar atau tekan `Esc` manual.

### Masalah B — Sheet sidebar tidak tertutup saat klik folder (Mobile)
Di mobile, saat user membuka sheet sidebar lalu klik folder apapun, **sheet tetap terbuka** dan menutupi konten mail list. User harus close sheet manual (klik overlay / tombol close).

**Target:**
- **Desktop collapsed:** klik child di popover → popover otomatis tertutup
- **Mobile:** klik folder (apapun) → sheet sidebar otomatis tertutup
- **Desktop expanded:** **tidak berubah** — sidebar tetap terbuka setelah klik folder

## Referensi Utama

- **Sidebar shadcn docs:** https://ui.shadcn.com/docs/components/sidebar
- **Block sidebar-07** (mobile pattern): https://ui.shadcn.com/blocks/sidebar#sidebar-07
- **Base UI Popover:** controlled mode via `open` + `onOpenChange`
- **File proyek:**
  - `src/components/ui/popover.tsx` — wrapper `@base-ui/react/popover`
  - `src/components/ui/sidebar.tsx` — `useSidebar()` expose `{ state, isMobile, openMobile, setOpenMobile }`
  - `src/hooks/use-mobile.ts` — deteksi viewport < 768px
  - `src/components/persuratan/mail-folder-tree.tsx` — komponen yang akan diubah

## Pola yang Diharapkan (High Level)

### Masalah A — Controlled Popover

`Popover` di branch collapsed jadi **controlled**:

1. State lokal `openPopoverId: string | null` di `MailFolderTree`.
2. `Popover` menerima `open={openPopoverId === folder.id}` + `onOpenChange={(o) => setOpenPopoverId(o ? folder.id : null)}`.
3. Handler klik child di `PopoverContent`: panggil `onSelectFolder(child.id)` lalu `setOpenPopoverId(null)`.

### Masalah B — Close Sheet di Mobile

1. Ambil `isMobile` dan `setOpenMobile` dari `useSidebar()`.
2. Buat helper `handleSelectFolder(folderId)` yang:
   - Panggil `onSelectFolder(folderId)`
   - Jika `isMobile === true` → panggil `setOpenMobile(false)`
3. Gunakan helper ini di **semua** cabang rendering yang memicu pilihan folder:
   - Root folder tanpa children (`SidebarMenuButton` onClick)
   - Child di `Collapsible` expanded (`SidebarMenuSubButton` onClick)
   - Child di `PopoverContent` button onClick (meskipun popover branch tidak aktif di mobile, handler terpadu tetap aman untuk dipakai konsisten)

### Gabungan (handler child popover)

Handler untuk klik child di popover harus melakukan 3 hal:
1. `onSelectFolder(child.id)`
2. `setOpenPopoverId(null)` — tutup popover
3. Jika `isMobile` (defensive) → `setOpenMobile(false)`

```
Desktop Expanded:               Desktop Collapsed:              Mobile Sheet:
┌─ Sidebar ─┐                   ┌─ Sidebar ─┐                   ┌─ Sheet ──────┐
│ ▸ Inbox   │                   │ [📥]      │  ┌─ Popover ──┐   │ ▸ Inbox  ◀── klik
│ ▾ Folder A│ ◀── klik child    │ [📁] ◀──┼─▶│▸Rapat ◀── klik    │ ▸ Folder A   │
│   ▸ Rapat │    folder terpilih│ [📤]      │  │▸Surat      │   │   ▸ Rapat    │
│   ▸ Surat │    sidebar TETAP  └───────────┘  └────────────┘   └──────────────┘
└───────────┘    terbuka               ↓                              ↓
                                 popover tertutup             sheet tertutup
```

## Tool / Skill Wajib Digunakan

Executor **WAJIB** menggunakan tools berikut:

1. **Context7 (ctx7 CLI)** — fetch dokumentasi terkini:
   ```bash
   npx ctx7@latest library "Base UI" "popover controlled open state onOpenChange"
   npx ctx7@latest docs <libraryId> "popover controlled open prop close programmatically"
   npx ctx7@latest library "shadcn/ui" "sidebar mobile sheet useSidebar setOpenMobile"
   npx ctx7@latest docs /shadcn-ui/ui "useSidebar hook isMobile setOpenMobile close on navigation"
   ```

2. **MCP next-devtools** — validasi runtime:
   - `get_errors` — setelah perubahan
   - `get_page_metadata` pada `/persuratan`
   - `get_routes` — pastikan route `/persuratan` tidak rusak

3. **Skills Claude Code** (disarankan):
   - `find-docs` — cross-check dokumentasi
   - `simplify` — review kualitas pasca-implementasi

## Dependensi

### Sudah Tersedia (JANGAN install ulang)
| File | Keterangan |
|---|---|
| `src/components/ui/popover.tsx` | Popover base-ui — root menerima `open` / `onOpenChange` via spread |
| `src/components/ui/sidebar.tsx` | Menyediakan `useSidebar()` + `setOpenMobile` |
| `src/components/ui/sheet.tsx` | Sheet drawer untuk mobile |
| `src/components/ui/collapsible.tsx` | Collapsible untuk expanded mode |
| `src/hooks/use-mobile.ts` | Hook deteksi viewport mobile |
| `src/hooks/persuratan/use-mail-folder-tree.ts` | State open/close Collapsible (tidak dipakai untuk popover) |

### Perlu Ditambahkan
**Tidak ada.** Semua dependency tersedia.

## File yang Akan Diubah

| File | Aksi | Keterangan |
|---|---|---|
| `src/components/persuratan/mail-folder-tree.tsx` | **MINOR REFACTOR** | (1) Controlled Popover, (2) Handler terpadu `handleSelectFolder` untuk mobile close |
| `src/components/persuratan/persuratan-content.tsx` | **REVIEW** | Tidak diubah |
| `src/components/persuratan/mail-toolbar.tsx` | **REVIEW** | Pastikan `SidebarTrigger` tetap berfungsi di mobile |

## Langkah Implementasi

### Langkah 1: Pelajari Cara Kerja MailFolderTree

Baca secara berurutan:

1. `src/components/ui/sidebar.tsx` — khususnya:
   - `useSidebar()` mengembalikan `{ state, isMobile, open, openMobile, setOpenMobile, toggleSidebar }`
   - `SidebarProvider` render `Sheet` ketika `isMobile === true` (sekitar baris 182–184)

2. `src/components/ui/popover.tsx` — pahami:
   - `Popover` adalah wrapper `@base-ui/react/popover` `Root`
   - Props di-spread — `open` dan `onOpenChange` otomatis diterima

3. `src/components/persuratan/mail-folder-tree.tsx` — pahami:
   - Sudah ada `const { state, isMobile } = useSidebar();` (baris 74)
   - `isCollapsedMode = state === "collapsed" && !isMobile;` (baris 75)
   - Ada **3 cabang rendering** yang memanggil `onSelectFolder`:
     - **Cabang A (Popover):** button child di `PopoverContent` (~baris 127)
     - **Cabang B (Collapsible child):** `SidebarMenuSubButton` onClick (~baris 211)
     - **Cabang C (Root tanpa children):** `SidebarMenuButton` onClick (~baris 231)
   - `Popover` saat ini **uncontrolled**

4. `src/hooks/use-mobile.ts` — pahami threshold 768px.

**Gunakan ctx7** untuk verifikasi API base-ui `Popover.Root` (`open` / `onOpenChange`) dan shadcn `useSidebar`.

### Langkah 2: Tambah State & Destructure di `MailFolderTree`

Di awal komponen:

```
const { state, isMobile, setOpenMobile } = useSidebar();
const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
const isCollapsedMode = state === "collapsed" && !isMobile;
```

### Langkah 3: Buat Handler Terpadu `handleSelectFolder`

Helper lokal yang dipakai semua cabang:

```
const handleSelectFolder = (folderId: string) => {
    onSelectFolder(folderId);
    if (isMobile) setOpenMobile(false);
};
```

Opsional: bungkus `useCallback` untuk konsistensi.

### Langkah 4: Ubah Popover Jadi Controlled (Masalah A)

Di branch Popover (~baris 92):

- `<Popover>` → `<Popover open={openPopoverId === folder.id} onOpenChange={(o) => setOpenPopoverId(o ? folder.id : null)}>`

Dengan pola ini:
- Hanya satu popover yang boleh terbuka
- `Esc` / klik di luar tetap bekerja (base-ui otomatis panggil `onOpenChange(false)`)

### Langkah 5: Update Semua Handler `onSelectFolder`

Ganti **seluruh 3 cabang** dengan handler terpadu:

- **Cabang A (Popover child button onClick):**
  ```
  onClick={() => {
      handleSelectFolder(child.id);
      setOpenPopoverId(null);
  }}
  ```
- **Cabang B (Collapsible child `SidebarMenuSubButton`):**
  ```
  onClick={() => handleSelectFolder(folder.id)}
  ```
- **Cabang C (Root `SidebarMenuButton`):**
  ```
  onClick={() => handleSelectFolder(folder.id)}
  ```

### Langkah 6: Pertahankan Behavior Lain

- **Expanded mode** Collapsible → tidak memakai state `openPopoverId`, tidak regresi.
- **Folder tanpa children** → tidak pakai Popover, tetap `SidebarMenuButton` biasa.
- **Tooltip** (`SidebarMenuButton tooltip`) tetap muncul saat hover.
- **Klik di luar popover** / `Esc` → tetap berfungsi via `onOpenChange`.
- **Desktop expanded** → `handleSelectFolder` tidak memanggil `setOpenMobile` (karena `isMobile === false`), sidebar tetap terbuka.

### Langkah 7: Verifikasi Parent Component

- `src/components/persuratan/persuratan-content.tsx` — `<SidebarProvider>` + `<Sidebar collapsible="icon">`. **Tidak diubah.**
- `src/components/persuratan/mail-toolbar.tsx` — `SidebarTrigger` tetap ada untuk buka sheet di mobile. **Tidak diubah.**

### Langkah 8: Testing & Finalisasi (WAJIB LULUS)

#### 8a. MCP next-devtools
- `get_errors` — bersih
- `get_page_metadata` pada `/persuratan`
- `get_routes` — verifikasi

#### 8b. Build Check (WAJIB LULUS)
```bash
bun run build
```
TIDAK ada TypeScript error. Perbaiki dulu jika gagal.

#### 8c. Lint / Format Check
```bash
bun run lint
bun run format
```

#### 8d. Manual Test Checklist

Buka `http://localhost:3000/persuratan`:

**Desktop Expanded (lebar >= 768px, sidebar terbuka):**
- [ ] Klik folder tanpa children → folder terpilih, sidebar **TETAP terbuka**
- [ ] Klik folder dengan children → Collapsible expand inline
- [ ] Klik child di Collapsible → folder terpilih, sidebar **TETAP terbuka**, Collapsible tetap expand
- [ ] Tidak ada regresi

**Desktop Collapsed icon-only:**
- [ ] Toggle collapsed (Ctrl+B / SidebarTrigger / SidebarRail)
- [ ] Klik icon folder tanpa children → folder terpilih, tidak ada popover
- [ ] Klik icon folder dengan children → popover muncul di sisi kanan
- [ ] Klik child di popover → folder terpilih **DAN popover tertutup otomatis**
- [ ] Mail list update sesuai folder yang dipilih
- [ ] Buka popover folder A → klik icon folder B → popover A tertutup, popover B terbuka
- [ ] Klik di luar popover → popover tertutup
- [ ] `Esc` saat popover terbuka → popover tertutup
- [ ] Tooltip nama folder tetap muncul saat hover icon
- [ ] Sidebar **TETAP collapsed** setelah memilih folder

**Mobile (< 768px — resize browser atau DevTools toggle device):**
- [ ] Sidebar tersembunyi, ada `SidebarTrigger` di toolbar
- [ ] Klik trigger → Sheet sidebar muncul dari kiri
- [ ] Klik folder **tanpa children** → folder terpilih **DAN sheet tertutup**
- [ ] Klik folder **dengan children** → Collapsible expand (sheet masih terbuka supaya user bisa pilih child)
- [ ] Klik **child folder** di Collapsible → folder terpilih **DAN sheet tertutup**
- [ ] Mail list terlihat full tanpa manual close sheet
- [ ] Popover logic TIDAK aktif di mobile (karena `isCollapsedMode = false` saat `isMobile = true`)
- [ ] Tidak ada flicker atau double-render

**Regresi umum:**
- [ ] Unread badge tetap terlihat di semua mode
- [ ] Tidak ada error / warning di console
- [ ] Panel mail list + detail tidak terpengaruh
- [ ] Tidak ada layout shift saat toggle antar mode

#### 8e. Final MCP Sweep
Panggil `get_errors` sekali lagi — bersih.

## Catatan Penting

- **JANGAN** ubah props interface `MailFolderTreeProps` — backward compatible
- **JANGAN** ubah file `src/components/ui/sidebar.tsx`, `sheet.tsx`, `collapsible.tsx`, `popover.tsx`
- **JANGAN** ubah parent `persuratan-content.tsx` / `mail-toolbar.tsx` kecuali verifikasi pasif
- **JANGAN** bikin hook baru — cukup `useState` lokal + helper `handleSelectFolder` di dalam komponen
- **JANGAN** regresi behavior desktop expanded
- **Semua teks UI** tetap dalam **Bahasa Indonesia**
- Perubahan minimal — fokus hanya (1) controlled Popover, (2) handler terpadu close sheet di mobile
- Jika ragu pada API base-ui / shadcn, **wajib fetch via ctx7**
- Commit message: Bahasa Indonesia, conventional commits (contoh: `fix(persuratan): tutup popover & sidebar sheet saat folder dipilih`)

## Definition of Done

- [ ] State `openPopoverId` + handler `handleSelectFolder` ada di `MailFolderTree`
- [ ] Popover di branch collapsed jadi controlled (`open` + `onOpenChange`)
- [ ] Klik child di popover → `onSelectFolder` + tutup popover
- [ ] Mobile: klik folder apapun → `setOpenMobile(false)` dipanggil
- [ ] Desktop expanded: sidebar tidak tertutup setelah klik folder
- [ ] Klik di luar / `Esc` tetap menutup popover
- [ ] Props interface `MailFolderTreeProps` tidak berubah
- [ ] `bun run build` lulus tanpa error
- [ ] `bun run lint` lulus tanpa error
- [ ] MCP `get_errors` bersih
- [ ] Manual test checklist desktop expanded + collapsed + mobile semua ✅
- [ ] Update memory `features/mail-viewer.md` dengan catatan "popover auto-close on child click + mobile sheet auto-close"
