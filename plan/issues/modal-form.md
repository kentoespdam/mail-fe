# Modal Form Standar Master Data

## Latar Belakang

Form dialog untuk CRUD master data (Tipe Surat, Kategori Surat, Pesan Singkat) sudah berfungsi, namun belum memiliki standar visual dan UX yang konsisten. Setiap dialog menggunakan pola dasar yang sama (RHF + Zod + TanStack Query mutation di dalam Base UI Dialog), tetapi belum menerapkan:

- Coloring 60:30:10 yang seragam (backdrop/base, aksen, highlight)
- Focus trap dan keyboard navigation yang optimal (`Tab`, `Enter`, `Esc`)
- Audit trail mini-log di dalam modal
- Lazy fetch on open dengan caching yang konsisten
- Validasi client-side yang seragam sebelum submit

Standarisasi ini penting agar semua modal form terasa familiar bagi pengguna dan lebih mudah di-maintain oleh developer.

## Tujuan

Menstandarkan seluruh modal form master data agar mengikuti arsitektur "Focus-Centric Modal" — layout terpusat, coloring 60:30:10, keyboard-friendly, lazy fetch + cache, validasi Zod client-side, dan audit trail terintegrasi — sehingga pengalaman pengguna konsisten di semua halaman master.

---

## Detail Fitur

### 1. Layout: Focus-Centric Modal

- Modal di-render via **Portal** hanya saat trigger diklik (tidak mount ke DOM sebelumnya)
- **Backdrop** menggunakan overlay transparan dengan efek blur tipis — bagian dari porsi 60% base color
- **Dialog Content** berupa kotak putih bersih di tengah layar, menampung seluruh input field
- Gunakan komponen `Dialog` dari Base UI yang sudah ada di `src/components/ui/dialog.tsx`

### 2. Coloring 60:30:10

- **60% Base**: Backdrop overlay, background form, teks label, audit trail text (muted)
- **30% Accent**: Tombol "Simpan" (Blue), border input saat fokus, link/interaksi sekunder
- **10% Highlight**: Error state (Red), success toast, badge status

Pastikan warna menggunakan OKLch sesuai design system yang sudah ada di Tailwind v4 config.

### 3. Focus Trap & Keyboard Navigation

- **Focus Trap**: Navigasi keyboard terkunci di dalam modal selama modal terbuka
- **Tab**: Pindah antar field secara berurutan
- **Enter**: Submit form (pada field terakhir atau tombol Simpan)
- **Esc**: Tutup modal / batal
- Base UI Dialog sudah mendukung focus trap secara bawaan — pastikan tidak ada override yang merusak

### 4. Lazy Fetch on Open + Caching

- Data detail (misal `/api/v1/mail-types/{id}`) hanya di-fetch saat modal edit terbuka
- Gunakan opsi `enabled` pada `useQuery` yang terikat ke state open modal
- Jika data sudah ada di cache TanStack Query, tampilkan langsung tanpa loading
- Pastikan `staleTime` dikonfigurasi agar data yang baru di-fetch tidak langsung refetch

### 5. Validasi Zod Client-Side

- Semua form menggunakan Zod schema untuk validasi sebelum submit
- Error ditampilkan inline di bawah field yang bermasalah (menggunakan `FieldError`)
- Validasi berjalan secara real-time (on blur atau on change sesuai pattern existing)
- Tidak ada request ke API jika validasi gagal

### 6. Audit Trail Mini-Log

- Tampilkan di bagian **bawah form** (hanya pada mode edit, bukan create)
- Format: `Terakhir diubah oleh: {nama} pada {tanggal}`
- Styling: teks muted (porsi 60% base), font size kecil
- Data diambil dari response API field `createdBy`, `updatedBy`, `createdAt`, `updatedAt` (atau field serupa)
- Gunakan komponen `AuditTrailInfo` yang sudah ada di `src/components/ui/audit-trail-info.tsx`

### 7. Tombol Aksi

- **Simpan**: Warna Blue (30% accent), posisi kanan
- **Batal**: Warna Slate/neutral (60% base), posisi kiri dari tombol Simpan
- Hierarki visual harus jelas — Simpan lebih menonjol dari Batal
- Tombol Simpan disabled saat form invalid atau sedang loading (mutation pending)

---

## Perubahan pada Project Existing

| File / Area | Perubahan |
|---|---|
| `src/components/mail-type/mail-type-form-dialog.tsx` | Sesuaikan layout, coloring, keyboard, audit trail |
| `src/components/mail-category/mail-category-form-dialog.tsx` | Sesuaikan layout, coloring, keyboard, audit trail |
| `src/components/quick-message/quick-message-form-dialog.tsx` | Sesuaikan layout, coloring, keyboard, audit trail |
| `src/components/ui/dialog.tsx` | Review & pastikan focus trap aktif, tambahkan styling default backdrop blur jika belum |
| `src/components/ui/audit-trail-info.tsx` | Review & integrasikan ke semua form dialog edit |
| Hook files (`mail-type-hooks`, `mail-category-hooks`, `quick-message-hooks`) | Pastikan `useQuery` detail menggunakan `enabled` terikat ke state modal open |

---

## Langkah Pengerjaan

1. **Review komponen Dialog existing** — pastikan focus trap, portal rendering, dan backdrop blur sudah berfungsi di `dialog.tsx`
2. **Standarkan backdrop & dialog styling** — terapkan coloring 60:30:10 pada Dialog (backdrop overlay blur, content background, border)
3. **Update `mail-type-form-dialog.tsx`** — sesuaikan layout, coloring tombol aksi, dan pastikan keyboard navigation bekerja
4. **Integrasikan audit trail** — tambahkan `AuditTrailInfo` di bagian bawah form edit pada `mail-type-form-dialog.tsx`
5. **Optimasi lazy fetch** — pastikan `useQuery` detail hanya aktif saat modal terbuka (prop `enabled`)
6. **Replikasi ke `mail-category-form-dialog.tsx`** — terapkan perubahan yang sama seperti langkah 3–5
7. **Replikasi ke `quick-message-form-dialog.tsx`** — terapkan perubahan yang sama seperti langkah 3–5
8. **Validasi keyboard flow** — test manual `Tab` antar field, `Enter` submit, `Esc` tutup di semua modal
9. **Review konsistensi visual** — pastikan semua modal terlihat seragam dan mengikuti coloring 60:30:10
10. **Testing regresi** — pastikan CRUD create/edit/delete tetap berfungsi di semua halaman master

---

## Acceptance Criteria

- [ ] Semua modal form master menggunakan Portal rendering (tidak mount ke DOM sebelum dibuka)
- [ ] Backdrop menggunakan overlay transparan + blur sesuai porsi 60% base
- [ ] Tombol "Simpan" berwarna Blue (30% accent), "Batal" berwarna Slate/neutral
- [ ] Focus trap aktif — keyboard terkunci di dalam modal saat terbuka
- [ ] `Tab` berpindah antar field, `Enter` submit, `Esc` tutup modal
- [ ] Data detail hanya di-fetch saat modal edit terbuka (lazy fetch)
- [ ] Data dari cache TanStack Query ditampilkan instan tanpa loading ulang
- [ ] Validasi Zod client-side berjalan sebelum submit, error tampil inline
- [ ] Audit trail "Terakhir diubah oleh: {nama} pada {tanggal}" tampil di form edit
- [ ] Coloring konsisten di ketiga modal (mail-type, mail-category, quick-message)
- [ ] Tidak ada regresi pada fitur CRUD yang sudah ada
- [ ] Semua teks UI dalam Bahasa Indonesia

---

## Catatan untuk Developer

- Semua teks UI, label, dan pesan error harus dalam **Bahasa Indonesia**
- Ikuti pattern form dialog yang sudah ada — gunakan `FieldGroup > Controller > Field > FieldLabel + Input + FieldError`
- Untuk referensi Base UI Dialog:
  ```bash
  npx ctx7@latest docs /base-ui-org/base-ui "Dialog component focus trap portal overlay"
  ```
- Untuk referensi TanStack Query `enabled` option:
  ```bash
  npx ctx7@latest docs /tanstack/query "useQuery enabled option lazy fetch"
  ```
- Untuk referensi React Hook Form + Zod resolver:
  ```bash
  npx ctx7@latest docs /react-hook-form/react-hook-form "zodResolver validation"
  ```
- Untuk referensi Tailwind v4 OKLch colors:
  ```bash
  npx ctx7@latest docs /tailwindlabs/tailwindcss "oklch color theme"
  ```
- Pastikan perubahan styling Dialog tidak merusak modal lain di luar master data
