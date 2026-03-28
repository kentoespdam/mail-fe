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
import { useDeleteQuickMessage } from "@/hooks/quick-message-hooks";
import type { QuickMessageDto } from "@/types/quick-message";

interface DeleteQuickMessageDialogProps {
	qm: QuickMessageDto | null;
	onClose: () => void;
}

export function DeleteQuickMessageDialog({
	qm,
	onClose,
}: DeleteQuickMessageDialogProps) {
	const mutation = useDeleteQuickMessage(onClose);

	return (
		<Dialog open={!!qm} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Hapus Pesan Singkat</DialogTitle>
					<DialogDescription>
						Yakin ingin menghapus &ldquo;{qm?.message}&rdquo;? Tindakan ini
						tidak dapat dibatalkan.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button
						variant="destructive"
						disabled={mutation.isPending}
						onClick={() => qm && mutation.mutate(qm.id)}
					>
						{mutation.isPending ? "Menghapus…" : "Hapus"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
