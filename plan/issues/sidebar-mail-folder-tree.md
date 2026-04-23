# Issue: Implementasi Collapsible Sidebar untuk MailFolderTree (NavMain Pattern dari sidebar-07)

## Context

Saat ini `MailFolderTree` ditampilkan dengan flat list menggunakan `SidebarMenu` + `SidebarMenuButton`. Layout utama `/persuratan` sudah menggunakan `SidebarProvider` + `Sidebar collapsible="icon"`. **Yang perlu diubah** adalah isi sidebar agar menggunakan **Collapsible** tree menu sesuai pola `NavMain` dari [sidebar-07](https://ui.shadcn.com/blocks/sidebar#sidebar-07).

## Referensi Utama

- **Block:** https://ui.shadcn.com/blocks/sidebar#sidebar-07 (NavMain component)
- **Docs Collapsible:** https://ui.shadcn.com/docs/components/collapsible
- **Docs Sidebar:** https://ui.shadcn.com/docs/components/sidebar (bagian "Make SidebarGroup collapsible")

## Pola NavMain dari sidebar-07

Berikut pola yang digunakan di shadcn sidebar-07 — ini adalah **referensi utama** untuk implementasi:

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Setiap menu item yang punya children dibungkus Collapsible
<SidebarMenu>
  {items.map((item) => (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  ))}
</SidebarMenu>
```

Perbedaan dengan implementasi kita:
- Folder yang **punya children** → gunakan pattern Collapsible di atas (dengan chevron)
- Folder yang **TIDAK punya children** → render langsung `SidebarMenuButton` tanpa Collapsible
- Unread count → tampilkan `SidebarMenuBadge`
- Icon → pertahankan `getIcon()` helper yang sudah ada

## Dependensi

### Sudah Tersedia (JANGAN install ulang)
| File | Keterangan |
|---|---|
| `src/components/ui/sidebar.tsx` | Komponen Sidebar lengkap |
| `src/components/ui/sheet.tsx` | Sheet dialog untuk mobile |
| `src/hooks/use-mobile.ts` | Hook deteksi viewport mobile |

### Perlu Ditambahkan
| File | Keterangan |
|---|---|
| `src/components/ui/collapsible.tsx` | **WAJIB INSTALL** — komponen Collapsible dari shadcn |

## Tool / Skill Wajib Digunakan

Selama implementasi, **gunakan tools berikut**:

1. **Context7 (ctx7)** — untuk fetch dokumentasi terbaru:
   ```bash
   npx ctx7@latest docs /shadcn-ui/ui "collapsible component usage with sidebar"
   npx ctx7@latest docs /shadcn-ui/ui "sidebar NavMain collapsible menu sub-items"
   ```

2. **MCP next-devtools** — untuk monitoring error dan metadata:
   - `get_errors` — cek error setelah setiap perubahan besar
   - `get_page_metadata` — cek metadata halaman `/persuratan`
   - `get_routes` — verifikasi route `/persuratan` masih valid

## File yang Perlu Diubah

| File | Aksi | Keterangan |
|---|---|---|
| `src/components/ui/collapsible.tsx` | **CREATE** | Install via `bunx shadcn@latest add collapsible` |
| `src/components/persuratan/mail-folder-tree.tsx` | **REFACTOR** | Ubah ke pattern NavMain dengan Collapsible |
| `src/components/persuratan/persuratan-content.tsx` | **REVIEW** | Sudah menggunakan SidebarProvider — pastikan tidak perlu diubah |
| `src/components/persuratan/mail-toolbar.tsx` | **REVIEW** | Sudah ada SidebarTrigger — pastikan tidak perlu diubah |

## Langkah Implementasi

### Langkah 1: Install Collapsible Component

```bash
bunx shadcn@latest add collapsible
```

Komponen ini diperlukan untuk membungkus folder yang punya children agar bisa expand/collapse.

**Verifikasi:** Pastikan file `src/components/ui/collapsible.tsx` ter-create dan berisi export `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`.

### Langkah 2: Pelajari Referensi (Wajib)

Sebelum coding, gunakan **ctx7** untuk fetch dokumentasi terbaru:

```bash
npx ctx7@latest docs /shadcn-ui/ui "sidebar collapsible menu items NavMain pattern with sub-items"
```

Gunakan juga **MCP next-devtools**:
- Panggil `get_page_metadata` untuk memahami konteks halaman `/persuratan`
- Panggil `get_routes` untuk verifikasi route

Baca juga file-file berikut:
- `src/components/ui/sidebar.tsx` — pahami semua sub-komponen Sidebar
- `src/components/ui/collapsible.tsx` — pahami Collapsible API
- `src/components/persuratan/mail-folder-tree.tsx` — pahami implementasi saat ini
- `src/components/persuratan/persuratan-content.tsx` — pahami layout wrapper saat ini
- `src/types/mail.ts` — pahami `MailFolderDto` (khususnya `parentFolderId` untuk tree hierarchy)

### Langkah 3: Refactor `MailFolderTree`

Ubah `src/components/persuratan/mail-folder-tree.tsx` dengan pendekatan berikut:

**Logika rendering berdasarkan ada/tidaknya children:**

1. **Folder TANPA children** → render langsung:
   ```
   SidebarMenuItem > SidebarMenuButton (dengan icon, nama, tooltip, isActive)
   + SidebarMenuBadge (jika ada unread)
   ```

2. **Folder DENGAN children** → bungkus dengan Collapsible:
   ```
   Collapsible (defaultOpen jika folder/child-nya sedang selected) > SidebarMenuItem >
     CollapsibleTrigger > SidebarMenuButton (icon + nama + ChevronRight yang rotate)
     + SidebarMenuBadge (jika ada unread)
     CollapsibleContent > SidebarMenuSub >
       SidebarMenuSubItem > SidebarMenuSubButton (untuk setiap child)
   ```

**Yang harus dipertahankan:**
- Props interface `MailFolderTreeProps` — jangan ubah
- Fungsi `getIcon()` — pertahankan mapping icon per folder
- Prop `tooltip` pada `SidebarMenuButton` — agar nama muncul saat sidebar collapsed

**Yang harus ditambahkan:**
- Import `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` dari `@/components/ui/collapsible`
- ChevronRight icon (dari `@tabler/icons-react` → gunakan `IconChevronRight`, atau `lucide-react` → `ChevronRight`)
- Logic: tentukan `defaultOpen` pada Collapsible berdasarkan apakah folder tersebut atau child-nya sedang selected
- Class `group-data-[state=open]/collapsible:rotate-90` pada chevron icon untuk animasi rotate

### Langkah 4: Verifikasi Layout (persuratan-content.tsx)

Periksa `src/components/persuratan/persuratan-content.tsx`:
- Sudah menggunakan `SidebarProvider` + `Sidebar collapsible="icon"` ✅
- Sudah ada `SidebarRail` ✅
- `MailFolderTree` sudah di-render di dalam `Sidebar` ✅

**Kemungkinan besar TIDAK perlu diubah.** Tapi verifikasi:
- Apakah `MailFolderTree` masih compatible setelah refactor (prop tidak berubah)
- Apakah height/overflow styling masih benar

### Langkah 5: Verifikasi Toolbar (mail-toolbar.tsx)

Periksa `src/components/persuratan/mail-toolbar.tsx`:
- Sudah ada `SidebarTrigger` ✅
- Sudah ada `Separator` setelah trigger ✅

**Tidak perlu diubah.**

### Langkah 6: Testing & Finalisasi

Lakukan pengecekan berikut **secara berurutan**:

#### 6a. MCP Error Check
Panggil MCP tool `get_errors` untuk cek runtime error.

#### 6b. Build Check
```bash
bun run build
```
Pastikan TIDAK ada TypeScript error atau build failure.

#### 6c. Lint Check
```bash
bun run lint
```

#### 6d. Manual Test Checklist
Buka `http://localhost:3000/persuratan` dan verifikasi:

- [ ] Folder tree tampil lengkap dalam sidebar (expanded state)
- [ ] Folder yang punya children: klik chevron → expand/collapse children (animasi smooth)
- [ ] Folder yang punya children: Collapsible auto-open jika child-nya sedang selected
- [ ] Folder tanpa children: klik langsung memilih folder
- [ ] Klik folder memilih folder dan highlight aktif (`isActive`)
- [ ] Toggle sidebar collapse (via SidebarTrigger atau Ctrl+B) — folder jadi icon-only
- [ ] Tooltip muncul saat hover icon di collapsed state
- [ ] Unread badge terlihat di expanded state
- [ ] SidebarRail bisa digunakan untuk toggle
- [ ] Responsive: di mobile (< 768px), sidebar menjadi sheet/drawer
- [ ] Panel mail list + mail detail tetap berfungsi normal
- [ ] Tidak ada layout shift atau overflow saat toggle

## Catatan Penting

- **JANGAN** install ulang komponen sidebar/sheet — sudah tersedia
- **JANGAN** ubah file `src/components/ui/sidebar.tsx` atau `src/components/ui/sheet.tsx`
- **JANGAN** ubah props interface `MailFolderTreeProps` — jaga backward compatibility
- **Gunakan ctx7 dan MCP next-devtools** di setiap langkah untuk validasi
- **Semua teks UI** harus dalam **Bahasa Indonesia** (sesuai konvensi project)
- Perubahan harus **minimal** — hanya refactor isi MailFolderTree, jangan ubah layout atau komponen lain
- Icon library: project menggunakan `@tabler/icons-react`, gunakan `IconChevronRight` dari situ
