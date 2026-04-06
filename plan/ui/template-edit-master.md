# Template Edit Master — Plan

## 1. Arsitektur Performa

| Item | Status | Keterangan |
|------|--------|------------|
| TanStack Query caching | ✅ Done | Semua master CRUD sudah pakai `queryOptions` + cache |
| Server-side pagination | ✅ Done | `pageable` param via URL query |
| URL sync (sort/filter/page) | ✅ Done | State disinkronkan ke URL query params |
| `React.memo` | ✅ Done | Dialog form components sudah di-memo |
| Lazy per-page | ✅ Done | Setiap master = halaman terpisah (App Router), otomatis code-split |
| Debounced Search 300ms | ❌ Belum | Perlu implementasi di search input |

---

## 2. Fitur UI/UX

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Smart Duplicate | Baru | Tombol satu-klik untuk copy data master, form terisi otomatis |
| Audit Trail Mini-Log | Baru | "Last Modified" info di bagian bawah form |
| Inline Status Toggle | Baru | `bunx shadcn@latest add switch` |
| Skeleton Loading | Opsional | `bunx shadcn@latest add skeleton` |

---

## 3. Master Route Group & Template

### Perubahan Struktur

Pindah route group dari `(main)/master/` → `(master)/master/` dengan shared template.

```
src/app/(master)/master/template.tsx   ← BARU (tab nav + heading)
src/app/(master)/master/tipe-surat/page.tsx
src/app/(master)/master/kategori-surat/page.tsx
src/app/(master)/master/pesan-singkat/page.tsx
```

### Template (`template.tsx`)

- Heading: "Master Data"
- Tab navigasi menggunakan shadcn `Tabs` component
- Tab items: **Tipe Surat** | **Kategori Surat** | **Pesan Singkat**
- Tab aktif ditentukan via `usePathname()`
- Children render di bawah tab
- Install: `bunx shadcn@latest add tabs`

---

### Target

Hapus sub-menu, ganti dengan single item:

- Link ke `/master/tipe-surat` (default master page)
- Label: "Master Mail", icon tetap `IconSettings2`

---

## 5. Tabel Checkpoint

| Kategori | Status | Target |
|----------|--------|--------|
| Route group `(master)` + template | ❌ | Tab navigasi antar master pages |
| TopBar menu simplify | ❌ | Single link ke master |
| Debounced Search | ❌ | Reduce server load |
| Smart Duplicate | ❌ | Power user efficiency |
| Audit Trail Mini-Log | ❌ | Akuntabilitas |
| Inline Status Toggle | ❌ | Quick enable/disable |
| Skeleton Loading | ❌ Opsional | Better perceived performance |

---

## Komponen shadcn perlu install

```bash
bunx shadcn@latest add switch skeleton tabs
```
