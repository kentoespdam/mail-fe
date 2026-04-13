"use client";

import {
	IconCalendar,
	IconDownload,
	IconEye,
	IconFileText,
	IconTag,
} from "@tabler/icons-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { getFileType } from "@/hooks/publication-hooks";
import { formatIndonesianDate } from "@/lib/date-helper";
import { triggerDownload } from "@/lib/publication-api";
import type { PublicationDto } from "@/types/publication";
import { PublicationPreviewDialog } from "./publication-preview-dialog";

interface PublicationDetailDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const PublicationDetailDialog = memo(
	({ pub, onClose }: PublicationDetailDialogProps) => {
		const [previewPub, setPreviewPub] = useState<PublicationDto | null>(null);

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

								<TooltipProvider delay={0}>
									<TooltipButton
										variant="ghost"
										size="icon-sm"
										onClick={() => {
											const type = getFileType(pub.fileName);
											if (type === "other") {
												triggerDownload(pub.id, pub.fileName as string);
											} else {
												setPreviewPub(pub);
											}
										}}
										tooltip={
											getFileType(pub.fileName) === "other"
												? "Download file"
												: "Lihat file"
										}
										className="h-9 w-9 text-primary hover:bg-primary/10 hover:text-primary"
									>
										{getFileType(pub.fileName) === "other" ? (
											<IconDownload className="size-4" aria-hidden="true" />
										) : (
											<IconEye className="size-4" aria-hidden="true" />
										)}
									</TooltipButton>
								</TooltipProvider>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Tutup
						</Button>
					</DialogFooter>
				</DialogContent>

				<PublicationPreviewDialog
					pub={previewPub}
					onClose={() => setPreviewPub(null)}
				/>
			</Dialog>
		);
	},
);

PublicationDetailDialog.displayName = "PublicationDetailDialog";
