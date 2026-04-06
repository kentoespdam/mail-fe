# Plan: Implement Tooltip Button untuk Table Actions

## Context
Saat ini tombol aksi di tabel (edit, duplikat, hapus) menggunakan native HTML `title` attribute. Akan diganti dengan tooltip component yang sudah ada (`@base-ui/react/tooltip`) agar UX lebih konsisten dan visual lebih baik. Sekaligus buat reusable component `TooltipButton`.

## Reusable Component: `TooltipButton`

**File baru:** `src/components/ui/tooltip-button.tsx`

Wrapper yang menggabungkan `Tooltip` + `TooltipTrigger` + `TooltipContent` + `Button` menjadi satu komponen reusable:

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";

interface TooltipButtonProps extends ButtonProps {
	tooltip: string;
	side?: "top" | "bottom" | "left" | "right";
}

function TooltipButton({ tooltip, side = "top", children, ...buttonProps }: TooltipButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger render={<Button {...buttonProps} />}>
				{children}
			</TooltipTrigger>
			<TooltipContent side={side}>{tooltip}</TooltipContent>
		</Tooltip>
	);
}
```

- Menghapus `title` attribute dari button (diganti tooltip)
- Props `tooltip` untuk teks tooltip, `side` untuk posisi
- Semua props Button tetap diteruskan

## Perubahan pada Hooks (Action Columns)

Ganti `<Button title="...">` → `<TooltipButton tooltip="...">` di 3 file:

1. **`src/hooks/mail-category-hooks.tsx`** — 3 tombol (Edit, Duplikat, Hapus)
2. **`src/hooks/mail-type-hooks.tsx`** — 3 tombol (Edit, Duplikat, Hapus)
3. **`src/hooks/quick-message-hooks.tsx`** — 3 tombol (Edit, Duplikat, Hapus)

Wrap action column `<div>` dengan `<TooltipProvider>` untuk mengontrol delay.

## File yang Diubah

| File | Aksi |
|---|---|
| `src/components/ui/tooltip-button.tsx` | **Baru** — reusable component |
| `src/hooks/mail-category-hooks.tsx` | Ganti Button → TooltipButton |
| `src/hooks/mail-type-hooks.tsx` | Ganti Button → TooltipButton |
| `src/hooks/quick-message-hooks.tsx` | Ganti Button → TooltipButton |

## Verifikasi
1. `bun run build` — pastikan tidak ada error
2. Buka `/master/kategori-surat`, `/master/tipe-surat`, `/master/pesan-singkat`
3. Hover tombol aksi — tooltip muncul dengan animasi (bukan native title)
4. `bun run lint` — pastikan clean
