"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeleteMailCategory } from "@/hooks/mail-category-hooks";
import type { MailCategoryDto } from "@/types/mail-category";

interface DeleteMailCategoryDialogProps {
	mc: MailCategoryDto | null;
	onClose: () => void;
}

export const DeleteMailCategoryDialog = memo(
	({ mc, onClose }: DeleteMailCategoryDialogProps) => {
		const mutation = useDeleteMailCategory(onClose);

		return (
			<DeleteConfirmDialog
				open={!!mc}
				onClose={onClose}
				title="Hapus Kategori Surat"
				isPending={mutation.isPending}
				onConfirm={() => mc && mutation.mutate(mc.id)}
			/>
		);
	},
);

DeleteMailCategoryDialog.displayName = "DeleteMailCategoryDialog";
