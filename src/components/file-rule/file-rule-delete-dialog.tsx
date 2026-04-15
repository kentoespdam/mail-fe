"use client";

import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { useDeleteFileRule } from "@/hooks/file-rule-hooks";
import type { FileRuleDto } from "@/types/file-rule";

interface DeleteFileRuleDialogProps {
	fr: FileRuleDto | null;
	onClose: () => void;
}

export const DeleteFileRuleDialog = memo(
	({ fr, onClose }: DeleteFileRuleDialogProps) => {
		const mutation = useDeleteFileRule(onClose);

		return (
			<DeleteConfirmDialog
				open={!!fr}
				onClose={onClose}
				title="Hapus Aturan File"
				isPending={mutation.isPending}
				onConfirm={() => fr && mutation.mutate(fr.id)}
			/>
		);
	},
);

DeleteFileRuleDialog.displayName = "DeleteFileRuleDialog";
