# Implementasi RBAC pada TopBar Toolbar

## Status: ✅ IMPLEMENTASI SELESAI — Menunggu Verifikasi

> **Update 2026-04-13:** Langkah 1–5 sudah terimplementasi. Dokumen ini diperbarui untuk mencerminkan status terkini.

---

## Konteks

TopBar (`src/components/dashboard/topbar.tsx`) sebelumnya menampilkan nama dan jabatan hardcoded, serta semua menu terlihat oleh semua user tanpa filter role. Sekarang sudah menggunakan data dinamis dari Appwrite dan RBAC.

### Data Appwrite Account (Response Aktual)

```json
{
  "$id": "123",
  "name": "BAGUS SUDRAJAT, S.Kom.",
  "email": "123456789@example.com",
  "prefs": {
    "roles": ["USER", "ADMIN", "SYSTEM"]
  }
}
```

---

## Definisi Role & Permission

### Roles (dari Appwrite `prefs.roles`)

| Role | Display Name | Deskripsi |
|------|-------------|-----------|
| `SYSTEM` | Sistem | Akses penuh ke semua fitur termasuk master data |
| `ADMIN` | Administrator | Akses penuh ke fitur operasional |
| `USER` | Pengguna | Akses dasar (dashboard, persuratan, publikasi) |

### Mapping Role → Permission

| Permission | SYSTEM | ADMIN | USER |
|------------|--------|-------|------|
| `menu:dashboard` | ✓ | ✓ | ✓ |
| `menu:persuratan` | ✓ | ✓ | ✓ |
| `menu:arsip_surat` | ✓ | ✓ | - |
| `menu:publikasi` | ✓ | ✓ | ✓ |
| `menu:master` | ✓ | - | - |

---

## File yang Diubah/Dibuat

| File | Status | Perubahan |
|------|--------|-----------|
| `src/types/auth.ts` | ✅ Selesai | Tambah `AppwriteRole`, `Permission`, `UserProfile` |
| `src/lib/rbac.ts` | ✅ Selesai (baru) | `ROLE_PERMISSIONS`, `ROLE_PRIORITY`, `ROLE_DISPLAY_NAMES`, `hasPermission()`, `getAllPermissions()`, `getJabatan()` |
| `src/lib/dal.ts` | ✅ Selesai | `getUser()` mengambil `prefs.roles`, parse dengan Zod, hitung jabatan via `getJabatan()` |
| `src/hooks/use-user.ts` | ✅ Selesai (baru) | `useUser()` hook — TanStack Query, staleTime 5min, gcTime 30min |
| `src/actions/auth.ts` | ✅ Selesai | `getUserProfile()` server action sebagai wrapper `getUser()` |
| `src/components/dashboard/topbar.tsx` | ✅ Selesai | Nama & jabatan dinamis dari `useUser()`, skeleton saat loading |
| `src/components/dashboard/top-menu.tsx` | ✅ Selesai | Menu data-driven, filter berdasarkan `hasPermission()`, submenu Arsip Surat conditional |

---

## Langkah Implementasi — Progress

### ✅ Langkah 1: Definisi Types & RBAC Config
- `src/types/auth.ts` — `AppwriteRole`, `Permission`, `UserProfile`
- `src/lib/rbac.ts` — roles, permissions, mapping, helpers

### ✅ Langkah 2: Extend Data Access Layer
- `src/lib/dal.ts` — `getUser()` mengambil `prefs.roles`, validasi Zod, default `["USER"]`

### ✅ Langkah 3: Hook useUser
- `src/hooks/use-user.ts` — TanStack Query dengan caching
- `src/actions/auth.ts` — `getUserProfile()` server action

### ✅ Langkah 4: TopBar — Nama & Jabatan Dinamis
- `src/components/dashboard/topbar.tsx` — data dari `useUser()`, skeleton loading

### ✅ Langkah 5: Filter Menu Berdasarkan Permission
- `src/components/dashboard/top-menu.tsx` — data-driven menu, `hasPermission()` filter, Arsip Surat conditional

### ⏳ Langkah 6: Verifikasi & Finalisasi

**Belum dilakukan.** Checklist:

1. **Build check:**
   ```bash
   bun run build
   ```

2. **Lint check:**
   ```bash
   bun run lint
   ```

3. **Test manual:**
   - Login sebagai user dengan `roles: ["USER", "ADMIN", "SYSTEM"]` — semua menu tampil, jabatan = "Sistem"
   - Login sebagai user dengan `roles: ["USER"]` — hanya Dashboard, Persuratan, Publikasi, jabatan = "Pengguna"
   - Login sebagai user dengan `roles: ["USER", "ADMIN"]` — semua kecuali Master Mail, jabatan = "Administrator"
   - Verifikasi nama dari Appwrite tampil di topbar
   - Verifikasi loading skeleton saat data belum tersedia

---

## Catatan Arsitektur

- `dal.ts` dan `proxy.ts` **tidak duplikat** — proxy mengelola JWT di middleware layer, dal mengambil user profile di application layer
- RBAC di client (hide menu) hanya untuk UX — proteksi utama harus di server (Server Actions / Route Handlers)
- `getUser()` di-wrap `React.cache()` untuk deduplikasi per-request
- Roles divalidasi dengan Zod schema, unknown roles di-filter, default ke `["USER"]`
