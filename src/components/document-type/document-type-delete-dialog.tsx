"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeleteDocumentType } from "@/hooks/document-type-hooks";
import type { DocumentTypeDto } from "@/types/document-type";

interface DeleteDocumentTypeDialogProps {
	dt: DocumentTypeDto | null;
	onClose: () => void;
}

export const DeleteDocumentTypeDialog = memo(
	({ dt, onClose }: DeleteDocumentTypeDialogProps) => {
		const mutation = useDeleteDocumentType(onClose);

		return (
			<DeleteConfirmDialog
				open={!!dt}
				onClose={onClose}
				title="Hapus Jenis Dokumen"
				isPending={mutation.isPending}
				onConfirm={() => dt && mutation.mutate(dt.id)}
			/>
		);
	},
);

DeleteDocumentTypeDialog.displayName = "DeleteDocumentTypeDialog";
