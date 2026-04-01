"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeleteMailType } from "@/hooks/mail-type-hooks";
import type { MailTypeDto } from "@/types/mail-type";

interface DeleteMailTypeDialogProps {
	mt: MailTypeDto | null;
	onClose: () => void;
}

export const DeleteMailTypeDialog = memo(
	({ mt, onClose }: DeleteMailTypeDialogProps) => {
		const mutation = useDeleteMailType(onClose);

		return (
			<DeleteConfirmDialog
				open={!!mt}
				onClose={onClose}
				title="Hapus Tipe Surat"
				isPending={mutation.isPending}
				onConfirm={() => mt && mutation.mutate(mt.id)}
			/>
		);
	},
);

DeleteMailTypeDialog.displayName = "DeleteMailTypeDialog";
