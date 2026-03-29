"use client";

import { useCallback, useEffect } from "react";
import InputTextControll from "@/components/builder/input-text-controll";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
	useCreateQuickMessage,
	useUpdateQuickMessage,
} from "@/hooks/quick-message-hooks";
import type { QuickMessageDto } from "@/types/quick-message";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function CreateQuickMessageDialog({
	open,
	onOpenChange,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateQuickMessage(handleClose);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Buat Pesan Singkat</DialogTitle>
					<DialogDescription>Tambah pesan singkat baru</DialogDescription>
				</DialogHeader>
				<form id="create-qm-form" onSubmit={onSubmit}>
					<FieldGroup>
						<InputTextControll
							form={form}
							id="message"
							label="Pesan"
							placeholder="Masukkan pesan singkat"
							required
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="create-qm-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Edit ───────────────────────────────────────────────────────
interface EditDialogProps {
	qm: QuickMessageDto | null;
	onClose: () => void;
}

export function EditQuickMessageDialog({ qm, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateQuickMessage(onClose);

	useEffect(() => {
		if (qm) populate(qm);
	}, [qm, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (qm) onSubmit(qm.id);
		},
		[qm, onSubmit],
	);

	return (
		<Dialog open={!!qm} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Pesan Singkat</DialogTitle>
					<DialogDescription>Perbarui pesan singkat</DialogDescription>
				</DialogHeader>
				{qm && (
					<form id="edit-qm-form" onSubmit={handleSubmit}>
						<FieldGroup>
							<InputTextControll
								form={form}
								id="message"
								label="Pesan"
								placeholder="Masukkan pesan singkat"
								required
							/>
						</FieldGroup>
					</form>
				)}
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="edit-qm-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
