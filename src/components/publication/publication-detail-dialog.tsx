"use client";

import { IconCalendar, IconFileText, IconTag } from "@tabler/icons-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatIndonesianDate } from "@/lib/date-helper";
import type { PublicationDto } from "@/types/publication";

interface PublicationDetailDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const PublicationDetailDialog = memo(
	({ pub, onClose }: PublicationDetailDialogProps) => {
		if (!pub) return null;

		return (
			<Dialog open={!!pub} onOpenChange={(v) => !v && onClose()}>
				<DialogContent className="min-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<IconFileText
								className="size-5 text-muted-foreground"
								aria-hidden="true"
							/>
							Detail Pengumuman & Informasi
						</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Jenis Dokumen
								</p>
								<div className="flex items-center gap-2 text-sm font-medium">
									<IconTag
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									{pub.documentType?.name ?? "—"}
								</div>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Tanggal Dibuat
								</p>
								<div className="flex items-center gap-2 text-sm">
									<IconCalendar
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									{formatIndonesianDate(pub.createdAt)}
								</div>
							</div>
						</div>

						<div className="space-y-1">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Judul
							</p>
							<p className="text-base font-semibold text-foreground leading-tight">
								{pub.title}
							</p>
						</div>

						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Deskripsi
							</p>
							<div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-foreground border border-border/50">
								{pub.description || (
									<span className="italic text-muted-foreground">
										Tidak ada deskripsi
									</span>
								)}
							</div>
						</div>

						{pub.fileName && (
							<div className="flex items-center justify-between rounded-lg border border-border p-3 bg-card">
								<div className="flex items-center gap-3">
									<div className="rounded-md bg-primary/10 p-2 text-primary">
										<IconFileText className="size-5" aria-hidden="true" />
									</div>
									<div className="space-y-0.5">
										<p className="text-sm font-medium leading-none">
											{pub.fileName}
										</p>
										<p className="text-xs text-muted-foreground">
											UKURAN FILE:{" "}
											{pub.fileSize
												? (pub.fileSize / (1024 * 1024)).toFixed(2)
												: 0}{" "}
											MB
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Tutup
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

PublicationDetailDialog.displayName = "PublicationDetailDialog";
