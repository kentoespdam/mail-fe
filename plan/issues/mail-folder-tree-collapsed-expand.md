# Issue: Expand Folder saat Sidebar Collapsed (Icon-only) di MailFolderTree

## Context

Saat ini `MailFolderTree` sudah menggunakan pola shadcn Sidebar `collapsible="icon"` dengan Collapsible menu (NavMain pattern). Ketika sidebar dalam kondisi **expanded** (lebar normal), user bisa klik folder yang punya children untuk expand/collapse daftar sub-folder.

**Masalah:** Ketika sidebar dalam kondisi **collapsed** (icon-only), folder yang punya children **tidak bisa di-expand**. Semua folder hanya tampil sebagai icon tanpa cara menelusuri children-nya. Ini menurunkan usability karena user harus men-expand sidebar dulu untuk navigasi ke sub-folder.

**Target:** Saat sidebar collapsed (icon-only), klik icon folder yang punya children harus menampilkan children-nya — pola yang umum dipakai adalah **floating submenu / popover** di samping icon (pattern sidebar-07 shadcn menggunakan `SidebarMenuSub` pada mode expanded, dan popover / hover-card saat collapsed).

## Referensi Utama

- **Block referensi:** https://ui.shadcn.com/blocks/sidebar#sidebar-07 — lihat behavior saat sidebar di-collapse ke icon
- **Docs Sidebar (bagian `collapsible="icon"`):** https://ui.shadcn.com/docs/components/sidebar
- **Docs Popover / HoverCard:** https://ui.shadcn.com/docs/components/popover

## Pola yang Diharapkan (High Level)

Saat sidebar collapsed:
- Icon folder tanpa children → klik langsung pilih folder (behavior sekarang sudah benar)
- Icon folder **dengan children** → klik membuka **floating submenu** (popover) di sisi kanan icon, berisi daftar children. User bisa klik child di dalam popover.
- Tooltip nama folder tetap muncul saat hover (behavior `SidebarMenuButton tooltip` bawaan shadcn).

Saat sidebar expanded: behavior tetap seperti sekarang (inline Collapsible dengan chevron).

```
┌─ Sidebar Collapsed ─┐        klik icon folder yg punya children:
│                     │
│ [📥]                │        ┌─ Sidebar ─┐  ┌─ Popover ────────┐
│ [📝]                │        │           │  │ ▸ Rapat          │
│ [📁] ← klik icon    │        │ [📁] ◀──┼─▶│ ▸ Surat Masuk    │
│ [📤]                │        │           │  │ ▸ Undangan       │
│                     │        └───────────┘  └──────────────────┘
└─────────────────────┘
```

## Tool / Skill Wajib Digunakan

Executor **WAJIB** menggunakan tools berikut di setiap fase:

1. **Context7 (ctx7 CLI)** — fetch dokumentasi terkini shadcn:
   ```bash
   npx ctx7@latest library "shadcn/ui" "sidebar collapsible icon with submenu popover"
   npx ctx7@latest docs /shadcn-ui/ui "sidebar collapsible icon mode nested menu popover pattern"
   npx ctx7@latest docs /shadcn-ui/ui "popover component trigger and positioning"
   ```
   Pelajari bagaimana shadcn mendemonstrasikan nested menu di mode collapsed.

2. **MCP next-devtools** — validasi runtime:
   - `get_errors` — jalankan setelah setiap perubahan besar
   - `get_page_metadata` — verifikasi halaman `/persuratan`
   - `get_routes` — pastikan route `/persuratan` tidak rusak

3. **Skills Claude Code** (opsional tapi disarankan):
   - `find-docs` — untuk cross-check dokumentasi
   - `simplify` — pasca-implementasi untuk review kualitas kode

## Dependensi

### Sudah Tersedia (JANGAN install ulang)
| File | Keterangan |
|---|---|
| `src/components/ui/sidebar.tsx` | Komponen Sidebar (sudah support `collapsible="icon"`) |
| `src/components/ui/collapsible.tsx` | Komponen Collapsible (untuk expanded state) |
| `src/components/ui/sheet.tsx` | Sheet untuk mobile |
| `src/hooks/use-mobile.ts` | Deteksi viewport mobile |
| `src/hooks/persuratan/use-mail-folder-tree.ts` | State open/close folder |

### Perlu Dipastikan / Ditambahkan
| File | Keterangan |
|---|---|
| `src/components/ui/popover.tsx` | **Cek dulu** — jika belum ada, install via `bunx shadcn@latest add popover`. Popover dipakai untuk floating submenu saat collapsed. |

## File yang Akan Diubah

| File | Aksi | Keterangan |
|---|---|---|
| `src/components/ui/popover.tsx` | **CREATE (jika belum ada)** | Install via shadcn CLI |
| `src/components/persuratan/mail-folder-tree.tsx` | **REFACTOR** | Tambahkan cabang rendering untuk state collapsed |
| `src/hooks/persuratan/use-mail-folder-tree.ts` | **REVIEW / minor update** | Kemungkinan perlu expose helper untuk collapsed mode |
| `src/components/persuratan/persuratan-content.tsx` | **REVIEW** | Tidak perlu diubah, hanya verifikasi |

## Langkah Implementasi

### Langkah 1: Pelajari State Sidebar Collapsed

Baca `src/components/ui/sidebar.tsx` dan cari:
- Bagaimana `SidebarProvider` expose state `state === "collapsed"`
- Hook `useSidebar()` yang mengembalikan `state`, `open`, `isMobile`
- Selector CSS `data-[state=collapsed]` / `group-data-[collapsible=icon]` yang dipakai styling

**Gunakan ctx7** untuk fetch dokumentasi terkini tentang `useSidebar` hook dan state machine-nya.

### Langkah 2: Pastikan Popover Component Ada

Cek apakah file `src/components/ui/popover.tsx` sudah ada. Jika belum:

```bash
bunx shadcn@latest add popover
```

**Verifikasi:** file ter-create dan berisi export `Popover`, `PopoverTrigger`, `PopoverContent`.

### Langkah 3: Pelajari Kondisi Rendering Saat Ini

Baca `src/components/persuratan/mail-folder-tree.tsx`. Pahami:
- Saat ini folder dengan children dibungkus `Collapsible` dengan `CollapsibleTrigger` → `SidebarMenuButton`
- Saat sidebar collapsed, `SidebarMenuButton` otomatis menampilkan icon saja (fitur bawaan shadcn)
- Tapi `CollapsibleContent` (berisi `SidebarMenuSub`) **tersembunyi** karena sidebar lebarnya jadi icon-only

Pahami juga `use-mail-folder-tree.ts`: state `openFolders`, helper `isOpen`, `toggleFolder`, `getChildren`.

### Langkah 4: Desain Dua Jalur Rendering

Di `mail-folder-tree.tsx`, tambahkan pengecekan sidebar state menggunakan `useSidebar()`:

1. **Sidebar expanded** → render seperti sekarang (Collapsible inline dengan chevron)
2. **Sidebar collapsed (icon mode)** → untuk folder dengan children:
   - Ganti pembungkus `Collapsible` dengan `Popover`
   - `PopoverTrigger` = `SidebarMenuButton` (icon saja + tooltip)
   - `PopoverContent` (`side="right"`, `align="start"`) = daftar children (gunakan komponen list sederhana, bisa reuse `SidebarMenuSub` / `SidebarMenuSubButton` styling, atau buat list button plain)
   - Children di dalam popover harus bisa diklik untuk memilih folder (`onSelectFolder`)
   - Jika child juga punya grandchildren → cukup tampilkan flat / nested list dalam popover (nested popover tidak wajib di fase ini)

**Catatan Mobile:** gunakan `useSidebar()` → `isMobile`. Di mobile, sidebar sudah berubah jadi Sheet; logika collapsed tidak relevan. Skip popover logic saat `isMobile === true`.

### Langkah 5: Implementasi Refactor

Di dalam fungsi `renderFolder`:

```
const { state, isMobile } = useSidebar();
const isCollapsedMode = state === "collapsed" && !isMobile;

if (hasChildren && isCollapsedMode && level === 0) {
  // Render Popover branch
  return <PopoverBranch folder={folder} children={children} ... />;
}

if (hasChildren) {
  // Existing Collapsible branch
}

// Leaf folder — existing code
```

Pertahankan:
- Props interface `MailFolderTreeProps` (tidak berubah)
- Fungsi `getIcon()`
- Prop `tooltip` pada `SidebarMenuButton`
- Behavior expanded mode (Collapsible inline) — **jangan regresi**

### Langkah 6: Styling Popover

- `PopoverContent` side `right`, offset tipis (`sideOffset={8}`)
- Width yang cukup untuk nama folder terpanjang (min-width ~ 12rem)
- Background & border konsisten dengan Sidebar (`bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`)
- Item di dalam popover: hover state, active state (highlight jika folder aktif), badge unread
- Gunakan token warna OKLch dari design system — **JANGAN hardcode warna hex**

### Langkah 7: Verifikasi Layout Parent

Buka `src/components/persuratan/persuratan-content.tsx`:
- Pastikan `<Sidebar collapsible="icon">` tidak diubah
- Pastikan `SidebarRail` tetap berfungsi untuk toggle

**Tidak perlu diubah.**

### Langkah 8: Testing & Finalisasi (WAJIB)

Lakukan **secara berurutan**:

#### 8a. Gunakan MCP next-devtools
- Panggil `get_errors` untuk cek runtime error
- Panggil `get_page_metadata` pada `/persuratan`
- Panggil `get_routes` untuk verifikasi route tidak rusak

#### 8b. Build Check (WAJIB LULUS)
```bash
bun run build
```
Pastikan **TIDAK ada** TypeScript error atau build failure. Jika error, perbaiki dulu sebelum lanjut.

#### 8c. Lint / Format Check
```bash
bun run lint
bun run format
```

#### 8d. Manual Test Checklist
Buka `http://localhost:3000/persuratan`:

- [ ] **Expanded mode** — behavior lama tetap jalan (Collapsible inline, chevron, expand/collapse children)
- [ ] **Expanded mode** — folder auto-open jika child aktif (regression check)
- [ ] **Toggle ke collapsed** (via `SidebarTrigger` / `SidebarRail` / `Ctrl+B`)
- [ ] **Collapsed mode** — folder tanpa children: klik langsung pilih (tetap jalan)
- [ ] **Collapsed mode** — folder dengan children: klik icon → **Popover muncul di sebelah kanan** berisi daftar children
- [ ] **Collapsed mode** — klik child di dalam popover → folder terpilih, popover tertutup
- [ ] **Collapsed mode** — tooltip nama folder tetap muncul saat hover (tidak bentrok dengan popover)
- [ ] **Collapsed mode** — unread badge terlihat di icon (atau di dalam popover item, keduanya OK)
- [ ] Klik di luar popover → popover tertutup
- [ ] Keyboard: `Esc` menutup popover, `Tab` navigable
- [ ] **Mobile (< 768px)** — sidebar tetap berupa sheet/drawer (popover logic TIDAK aktif)
- [ ] Tidak ada layout shift saat toggle expanded ↔ collapsed
- [ ] Panel mail list & detail tidak terpengaruh
- [ ] Tidak ada warning di console

#### 8e. Final MCP Sweep
Panggil `get_errors` sekali lagi setelah manual test — pastikan bersih.

## Catatan Penting

- **JANGAN** ubah props interface `MailFolderTreeProps` — jaga backward compatibility
- **JANGAN** ubah file `src/components/ui/sidebar.tsx`, `sheet.tsx`, `collapsible.tsx`
- **JANGAN** ubah layout `persuratan-content.tsx` kecuali verifikasi pasif
- **Semua teks UI** dalam **Bahasa Indonesia** (sesuai konvensi project)
- Perubahan harus **minimal** dan **fokus** pada penambahan jalur rendering untuk collapsed mode
- Ikon pakai `@tabler/icons-react` (konsisten dengan kode existing)
- Warna pakai token Tailwind v4 / OKLch dari design system — **tidak boleh hardcode**
- Jika ragu pada detail API shadcn, **wajib fetch via ctx7** sebelum menebak
- Commit message dalam Bahasa Indonesia, format conventional commits (`feat:`, `fix:`, `refactor:`)

## Definition of Done

- [ ] Popover component tersedia di `src/components/ui/popover.tsx`
- [ ] `mail-folder-tree.tsx` merender dua jalur berdasarkan state sidebar
- [ ] Mode expanded: behavior lama tidak regresi
- [ ] Mode collapsed: folder dengan children bisa expand via popover
- [ ] `bun run build` lulus tanpa error
- [ ] `bun run lint` lulus tanpa error
- [ ] MCP `get_errors` tidak melaporkan error baru
- [ ] Manual test checklist semua ✅
- [ ] Update memory file `features/mail-viewer.md` dengan catatan perubahan
