"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePublication } from "@/hooks/publication-hooks";
import type { PublicationDto } from "@/types/publication";

interface DeletePublicationDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export function DeletePublicationDialog({
	pub,
	onClose,
}: DeletePublicationDialogProps) {
	const mutation = useDeletePublication(onClose);

	return (
		<Dialog open={!!pub} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Hapus Publikasi</DialogTitle>
					<DialogDescription>
						Yakin ingin menghapus &ldquo;{pub?.title}&rdquo;? Tindakan ini tidak
						dapat dibatalkan.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button
						variant="destructive"
						disabled={mutation.isPending}
						onClick={() => pub && mutation.mutate(pub.id)}
					>
						{mutation.isPending ? "Menghapus…" : "Hapus"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
