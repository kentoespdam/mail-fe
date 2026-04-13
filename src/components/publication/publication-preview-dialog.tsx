"use client";

import { IconDownload, IconLoader2, IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getFileType } from "@/hooks/publication-hooks";
import {
	getPublicationDownloadUrl,
	triggerDownload,
} from "@/lib/publication-api";
import type { PublicationDto } from "@/types/publication";

// Dynamically import PDF viewer with SSR disabled
const PublicationPdfViewer = dynamic(() => import("./publication-pdf-viewer"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center p-20">
			<IconLoader2 className="size-8 animate-spin text-primary" />
		</div>
	),
});

interface PublicationPreviewDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const PublicationPreviewDialog = memo(
	({ pub, onClose }: PublicationPreviewDialogProps) => {
		const [isLoading, setIsLoading] = useState(true);

		if (!pub || !pub.fileName) return null;

		const fileType = getFileType(pub.fileName);
		const downloadUrl = getPublicationDownloadUrl(pub.id);

		const handleDownload = () => {
			if (pub.fileName) {
				triggerDownload(pub.id, pub.fileName);
			}
		};

		return (
			<Dialog open={!!pub} onOpenChange={(open) => !open && onClose()}>
				<DialogTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 absolute right-4 top-4"
							onClick={onClose}
						>
							<IconX className="size-4" />
							<span className="sr-only">Tutup</span>
						</Button>
					}
				/>
				<DialogContent className="min-w-3/4 max-h-[90vh] flex flex-col p-0 overflow-hidden">
					<DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
						<DialogTitle className="text-base font-semibold truncate pr-8">
							Preview: {pub.fileName}
						</DialogTitle>
					</DialogHeader>

					<div className="flex-1 overflow-auto bg-muted/30 p-4 min-h-100 flex flex-col">
						{fileType === "pdf" ? (
							<PublicationPdfViewer downloadUrl={downloadUrl} />
						) : fileType === "image" ? (
							<div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh]">
								{/** biome-ignore lint/performance/noImgElement: allow use img tag for performance reason */}
								<img
									src={downloadUrl}
									alt={pub.title}
									className="max-w-full max-h-[70vh] object-contain shadow-md rounded-sm border"
									onLoad={() => setIsLoading(false)}
								/>
								{isLoading && (
									<div className="absolute inset-0 flex items-center justify-center bg-background/50">
										<IconLoader2 className="size-8 animate-spin text-primary" />
									</div>
								)}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center w-full min-h-[50vh] text-center p-8">
								<p className="text-muted-foreground mb-4">
									Preview tidak tersedia untuk tipe file ini.
								</p>
								<Button
									onClick={handleDownload}
									variant="outline"
									className="gap-2"
								>
									<IconDownload className="size-4" />
									Download File
								</Button>
							</div>
						)}
					</div>

					<DialogFooter className="p-4 border-t flex flex-row items-center justify-end gap-2 bg-background">
						<Button variant="outline" onClick={onClose} size="sm">
							Tutup
						</Button>
						<Button onClick={handleDownload} size="sm" className="gap-2">
							<IconDownload className="size-4" />
							Download
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

PublicationPreviewDialog.displayName = "PublicationPreviewDialog";
