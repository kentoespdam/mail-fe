"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeleteQuickMessage } from "@/hooks/quick-message-hooks";
import type { QuickMessageDto } from "@/types/quick-message";

interface DeleteQuickMessageDialogProps {
	qm: QuickMessageDto | null;
	onClose: () => void;
}

export const DeleteQuickMessageDialog = memo(
	({ qm, onClose }: DeleteQuickMessageDialogProps) => {
		const mutation = useDeleteQuickMessage(onClose);

		return (
			<DeleteConfirmDialog
				open={!!qm}
				onClose={onClose}
				title="Hapus Pesan Singkat"
				isPending={mutation.isPending}
				onConfirm={() => qm && mutation.mutate(qm.id)}
			/>
		);
	},
);

DeleteQuickMessageDialog.displayName = "DeleteQuickMessageDialog";
