"use client";

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { cn } from "@/lib/utils";

interface MailListToggleProps {
	hidden: boolean;
	onToggle: () => void;
	className?: string;
}

/**
 * Komponen toggle untuk menampilkan/menyembunyikan daftar surat.
 * Alasan Opsi B: Selalu terlihat di kedua state, posisi semantik jelas.
 * Catatan: Chevron butuh `text-foreground` + bg solid karena `ResizableHandle`
 * punya grip `bg-border` yang bisa menutupi ikon jika transparan.
 */
export function MailListToggle({
	hidden,
	onToggle,
	className,
}: MailListToggleProps) {
	const label = hidden ? "Tampilkan daftar surat" : "Sembunyikan daftar surat";
	const Icon = hidden ? IconChevronDown : IconChevronUp;

	return (
		<TooltipButton
			tooltip={label}
			variant="outline"
			size="icon"
			className={cn(
				"size-6 rounded-full bg-background border border-border shadow-sm z-20",
				className,
			)}
			onClick={(e) => {
				e.stopPropagation();
				onToggle();
			}}
			aria-label={label}
		>
			<Icon className="size-4 text-foreground" />
		</TooltipButton>
	);
}
