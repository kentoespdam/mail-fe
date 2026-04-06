# Refactor Tampilan — Tema PDAM Water Blue + 60:30:10

## Konteks
Aplikasi ini adalah sistem persuratan untuk **PERUMDAM Tirta Satria** (Perusahaan Daerah Air Minum Kab. Banyumas). Tema warna harus mencerminkan identitas PDAM — **air, kebersihan, kepercayaan** — menggunakan palet **Water Blue** (biru air).

---

## Palet Warna PDAM Water Blue

Gunakan hue OKLch di kisaran **220–240** (blue/water blue) untuk semua token warna.

| Zona | Peran | Nuansa | Contoh Penggunaan |
|---|---|---|---|
| **60% Dominant** | Background netral, area konten | Putih bersih / Biru sangat pucat (`oklch ~0.97-1.0, chroma ~0.005-0.01, hue ~230`) | Container utama, card, area children |
| **30% Secondary** | Elemen struktural, pemberi hierarki | Biru pucat / Soft blue-gray (`oklch ~0.92-0.96, chroma ~0.01-0.03, hue ~225`) | TopBar, heading area, tab list, border |
| **10% Accent** | Elemen interaktif, focal point | Biru air segar / Water blue (`oklch ~0.50-0.55, chroma ~0.15-0.20, hue ~235`) | Tab aktif (subtle), tombol CTA, notification dot |

### Warna Semantik (tetap di zona 10%)
- **Destructive:** Merah — untuk aksi hapus
- **Warning:** Amber/Kuning — untuk peringatan
- **Success/Info:** Biru lebih cerah — untuk informasi positif

---

## Analisis Screenshot Saat Ini

| Area | Masalah | Target |
|---|---|---|
| **TopBar** | `bg-background` putih, menyatu dengan konten | Background biru pucat (zona 30%) — identitas PDAM terasa |
| **Tab aktif** | Full `bg-primary` biru solid, terlalu besar & mencolok | Subtle: teks biru + underline (zona 10%) |
| **Tab tidak aktif** | Teks abu lemah, terlihat disabled | Biru-gray medium, readable |
| **Background konten** | Putih rata, flat, tanpa depth | Biru sangat pucat / off-white kebiruan |
| **Card konten** | Putih di atas putih — tidak ada elevasi | Card putih bersih di atas bg biru pucat |

---

## Langkah Implementasi

### 1. Update Token Warna di `globals.css`

**Tujuan:** Ganti palet warna dari netral abu-abu menjadi **Water Blue**.

- **Light Mode `:root`**
  - Zona 60%: Ubah `--background` dan `--card` ke putih dengan sedikit tint biru (hue ~230, chroma sangat rendah ~0.005)
  - Zona 30%: Ubah `--muted`, `--secondary`, `--border`, `--input` ke biru pucat yang terasa "air bersih" (hue ~225-230, chroma ~0.015-0.025)
  - Zona 10%: Ubah `--primary` dan `--accent` ke Water Blue yang segar dan profesional (hue ~235, chroma ~0.15-0.18) — jangan terlalu gelap, jangan terlalu terang
  - `--sidebar` dan `--sidebar-*` ikuti pola yang sama

- **Dark Mode `.dark`**
  - Zona 60%: Background gelap dengan hint biru (bukan hitam murni) — `oklch ~0.15-0.18, chroma ~0.01, hue ~230`
  - Zona 30%: Biru gelap medium untuk struktur
  - Zona 10%: Water Blue lebih cerah agar visible di dark bg

- **Jangan ubah:** Warna chart, destructive, warning — ini sudah benar

### 2. TopBar (`src/components/dashboard/topbar.tsx`)

**Tujuan:** TopBar menjadi elemen zona 30% dengan nuansa biru PDAM.

- Ganti `bg-background` pada `<header>` ke `bg-muted` atau `bg-secondary`
- Dengan palet Water Blue baru, TopBar akan otomatis bernuansa biru pucat — sesuai identitas PDAM
- Logo PERUMDAM Tirta Satria akan lebih "cocok" di atas background biru pucat
- Pastikan teks tetap readable: `text-foreground`
- Notification dot `bg-primary` = biru air segar ✓

### 3. Main Template (`src/app/(main)/template.tsx`)

**Tujuan:** Background utama menggunakan dominant color (biru sangat pucat).

- Perkuat gradient `<main>` agar transisi dari `background` ke `muted` lebih terasa
- Alternatif: ganti ke `bg-muted` solid agar Card putih terlihat "mengapung" di atas permukaan air (visual metaphor PDAM)

### 4. Master Template — Heading + Tabs (`src/app/(master)/master/template.tsx`)

**Tujuan:** Area navigasi master sebagai zona 30% yang jelas.

- Bungkus heading "Master Data" + tabs dalam `div` dengan `bg-card` + `border` + `rounded-lg` + `p-4` — memberi kesan "panel" yang terangkat
- Heading gunakan `text-foreground` + `font-bold`

### 5. Master Template — Tab Styling

**Tujuan:** Tab aktif = zona 10% (subtle water blue accent).

- **Hapus** tab aktif full `bg-primary` — terlalu dominan, melanggar aturan 10%
- **Gunakan** `TabsList` variant `line` yang sudah ada di `src/components/ui/tabs.tsx`
  - Tab aktif: `text-primary` (water blue) + underline biru 2px di bawah
  - Tab tidak aktif: `text-muted-foreground` (biru-gray) + `hover:text-foreground`
- Icon tab aktif ikut warna `text-primary`, tidak aktif `text-muted-foreground`

### 6. Tombol CTA & Elemen Interaktif

**Tujuan:** Tombol "Tambah" dan elemen interaktif menjadi focal point biru segar.

- Tombol CTA tetap `variant="default"` (`bg-primary`) — dengan palet baru, ini akan jadi Water Blue
- Ini harus menjadi elemen **paling mencolok** di halaman
- Switch/toggle status di tabel juga gunakan `bg-primary` saat aktif

---

## Referensi File

| File | Apa yang Diubah |
|---|---|
| `src/app/globals.css` | Token OKLch — ganti ke palet Water Blue (light + dark) |
| `src/components/dashboard/topbar.tsx` | Background `<header>` → zona 30% |
| `src/app/(main)/template.tsx` | Background `<main>` → lebih terasa gradient biru |
| `src/app/(master)/master/template.tsx` | Heading+Tabs wrapper, tab variant `line` |
| `src/components/ui/tabs.tsx` | Referensi variant yang tersedia (tidak perlu diubah) |

---

## Visual Metaphor PDAM

Tampilan akhir harus memberi kesan:
- **Bersih & Segar** — seperti air jernih (background putih kebiruan)
- **Terpercaya & Profesional** — biru tenang, tidak mencolok berlebihan
- **Berlayer** — Card putih "mengapung" di atas permukaan biru pucat (seperti air)
- **Aksen Segar** — tombol dan elemen aktif biru air yang hidup

---

## Checklist Verifikasi

- [ ] Token warna di `globals.css` sudah diganti ke palet Water Blue
- [ ] TopBar bernuansa biru pucat (zona 30%), terpisah dari konten
- [ ] Background utama biru sangat pucat / off-white kebiruan (zona 60%)
- [ ] Card konten putih bersih, terlihat "terangkat" dari background
- [ ] Tab aktif menggunakan underline + teks biru (zona 10%), bukan blok solid
- [ ] Tombol CTA biru air segar — elemen paling mencolok
- [ ] Dark mode: hint biru tetap terasa, bukan hitam murni
- [ ] Responsive: tampilan mobile tetap konsisten
- [ ] Logo PERUMDAM Tirta Satria terlihat serasi dengan palet baru
