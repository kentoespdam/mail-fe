"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeletePublication } from "@/hooks/publication-hooks";
import type { PublicationDto } from "@/types/publication";

interface DeletePublicationDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const DeletePublicationDialog = memo(
	({ pub, onClose }: DeletePublicationDialogProps) => {
		const mutation = useDeletePublication(onClose);

		return (
			<DeleteConfirmDialog
				open={!!pub}
				onClose={onClose}
				title="Hapus Publikasi"
				isPending={mutation.isPending}
				onConfirm={() => pub && mutation.mutate(pub.id)}
			/>
		);
	},
);

DeletePublicationDialog.displayName = "DeletePublicationDialog";
