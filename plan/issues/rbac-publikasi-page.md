# RBAC: Sembunyikan Tombol Aksi di Halaman Publikasi untuk Role USER

## Konteks

Sistem RBAC sudah diimplementasikan untuk menu navigasi (commit `e9aaf7d`). Sekarang perlu diterapkan juga di level **komponen** pada halaman `/publikasi`, agar tombol **Tambah**, **Edit**, **Hapus**, dan **Publish** tidak muncul untuk role `USER`. Role `USER` hanya boleh **melihat** dan **preview/download** dokumen publikasi.

## Tujuan

- Role `USER`: hanya bisa lihat daftar, lihat detail, dan preview/download file.
- Role `ADMIN` dan `SYSTEM`: akses penuh (tambah, edit, hapus, publish).

## Referensi File & Pattern

| File | Fungsi |
|---|---|
| `src/hooks/use-user.ts` | Hook `useUser()` untuk ambil data user + roles |
| `src/lib/rbac.ts` | `hasPermission()`, `ROLE_PERMISSIONS`, tipe `Permission` |
| `src/types/auth.ts` | Tipe `AppwriteRole`, `Permission`, `UserProfile` |
| `src/components/publication/publication-content.tsx` | Komponen utama halaman publikasi |
| `src/hooks/publication-hooks.tsx` | Hook `usePublicationContent()` + definisi kolom tabel |
| `src/components/dashboard/top-menu.tsx` | **Contoh pattern** penggunaan RBAC di komponen |

### Pattern yang Sudah Ada (contoh di `top-menu.tsx`)

```tsx
import { useUser } from "@/hooks/use-user";
import { hasPermission } from "@/lib/rbac";

const { user } = useUser();
const canAccess = hasPermission(user.roles, "menu:publikasi");
```

## Langkah Implementasi

### 1. Tambah Permission Baru (Opsional)

**File:** `src/types/auth.ts` dan `src/lib/rbac.ts`

- Pertimbangkan apakah perlu permission baru seperti `"publikasi:write"`, atau cukup cek role langsung (`role !== "USER"`).
- Jika ingin scalable, tambahkan permission baru di tipe `Permission` dan mapping `ROLE_PERMISSIONS`.
- Gunakan **Context7 MCP** untuk cek best practice RBAC pattern di React/Next.js jika ragu.

### 2. Buat Helper atau Flag `canWrite` di Hook

**File:** `src/hooks/publication-hooks.tsx`

- Import `useUser` dan `hasPermission` (atau cek role langsung).
- Buat variabel `canWrite` (boolean) yang menentukan apakah user boleh create/edit/delete/publish.
- Return `canWrite` dari `usePublicationContent()`.

### 3. Sembunyikan Tombol "Tambah Dokumen" di Header

**File:** `src/components/publication/publication-content.tsx`

- Gunakan `canWrite` dari hook untuk conditional render tombol "Tambah Dokumen" di `CardAction`.
- Sembunyikan juga tombol "Tambah Publikasi Pertama" di empty state.

### 4. Sembunyikan Tombol Aksi di Kolom Tabel

**File:** `src/hooks/publication-hooks.tsx`

- Di definisi kolom `actions`, sembunyikan tombol **Edit** (`IconPencil`), **Hapus** (`IconTrash`), dan **Publish** (`IconCloudUpload`) berdasarkan `canWrite`.
- Tombol **Lihat Detail** (`IconEye`) dan **Preview/Download** (`IconDownload`) tetap tampil untuk semua role.

### 5. Sembunyikan Dialog yang Tidak Relevan

**File:** `src/components/publication/publication-content.tsx`

- Jika `canWrite` false, tidak perlu render `CreatePublicationDialog`, `EditPublicationDialog`, `DeletePublicationDialog`, dan `PublishPublicationDialog`.

## Instruksi untuk Developer/AI

1. **Gunakan Context7 MCP** (`npx ctx7@latest`) untuk referensi dokumentasi library jika ada keraguan tentang API/pattern.
2. **Gunakan Next DevTools MCP** untuk inspect state dan debug di browser.
3. Ikuti pattern yang sudah ada di `top-menu.tsx` -- jangan buat pattern baru.
4. Semua teks UI dalam **Bahasa Indonesia**.
5. Jangan ubah behavior untuk role `ADMIN` dan `SYSTEM` -- hanya batasi `USER`.

## Verifikasi & Finalisasi

1. **Jalankan build** untuk cek TypeScript errors:
   ```bash
   bun run build
   ```
2. **Jalankan lint** untuk cek code style:
   ```bash
   bun run lint
   ```
3. **Gunakan Next DevTools MCP** untuk tes di browser:
   - Login sebagai `USER` -> pastikan tombol Tambah/Edit/Hapus/Publish tidak muncul.
   - Login sebagai `ADMIN`/`SYSTEM` -> pastikan semua tombol tetap muncul.
   - Pastikan tombol Lihat Detail dan Preview/Download tetap muncul untuk semua role.
4. **Test edge case**: user tanpa roles (default `USER`) harus diperlakukan sama seperti role `USER`.
