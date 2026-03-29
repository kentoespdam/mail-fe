"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { PublicationDto } from "@/types/publication";
import { CreatePublicationForm } from "./create-publication-form";
import { EditPublicationForm } from "./edit-publication-form";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export const CreatePublicationDialog = memo(
	({ open, onOpenChange }: CreateDialogProps) => {
		const formId = "create-publication-form";

		const handleOpenChange = useCallback(
			(v: boolean) => {
				onOpenChange(v);
			},
			[onOpenChange],
		);

		const handleCancel = useCallback(() => {
			onOpenChange(false);
		}, [onOpenChange]);

		const handleSuccess = useCallback(() => {
			onOpenChange(false);
		}, [onOpenChange]);

		return (
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Buat Publikasi</DialogTitle>
						<DialogDescription>Tambah dokumen publikasi baru</DialogDescription>
					</DialogHeader>
					<CreatePublicationForm formId={formId} onSuccess={handleSuccess} />
					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleCancel}>
							Batal
						</Button>
						<Button type="submit" form={formId}>
							Simpan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

CreatePublicationDialog.displayName = "CreatePublicationDialog";

// ─── Edit ───────────────────────────────────────────────────────
interface EditDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export const EditPublicationDialog = memo(
	({ pub, onClose }: EditDialogProps) => {
		const formId = "edit-publication-form";

		const handleOpenChange = useCallback(
			(v: boolean) => {
				if (!v) onClose();
			},
			[onClose],
		);

		return (
			<Dialog open={!!pub} onOpenChange={handleOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Publikasi</DialogTitle>
						<DialogDescription>Perbarui informasi publikasi</DialogDescription>
					</DialogHeader>
					{pub && (
						<EditPublicationForm
							formId={formId}
							pub={pub}
							onSuccess={onClose}
						/>
					)}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Batal
						</Button>
						<Button type="submit" form={formId}>
							Simpan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

EditPublicationDialog.displayName = "EditPublicationDialog";
