"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePublishPublication } from "@/hooks/publication-hooks";
import type { PublicationDto } from "@/types/publication";

interface PublishPublicationDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const PublishPublicationDialog = memo(
	({ pub, onClose }: PublishPublicationDialogProps) => {
		const mutation = usePublishPublication(onClose);

		return (
			<Dialog open={!!pub} onOpenChange={(v) => !v && onClose()}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Terbitkan Publikasi</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin menerbitkan publikasi "{pub?.title}"?
							Publikasi yang sudah terbit akan dapat diakses oleh publik.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Batal
						</Button>
						<Button
							disabled={mutation.isPending}
							onClick={() => pub && mutation.mutate(pub.id)}
						>
							{mutation.isPending ? "Menerbitkan…" : "Terbitkan"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

PublishPublicationDialog.displayName = "PublishPublicationDialog";
