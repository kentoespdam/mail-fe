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
	useCreateMailType,
	useUpdateMailType,
} from "@/hooks/mail-type-hooks";
import type { MailTypeDto } from "@/types/mail-type";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function CreateMailTypeDialog({
	open,
	onOpenChange,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateMailType(handleClose);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Buat Jenis Surat</DialogTitle>
					<DialogDescription>Tambah jenis surat baru</DialogDescription>
				</DialogHeader>
				<form id="create-mt-form" onSubmit={onSubmit}>
					<FieldGroup>
						<InputTextControll
							form={form}
							id="name"
							label="Nama"
							placeholder="Masukkan nama jenis surat"
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
						form="create-mt-form"
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
	mt: MailTypeDto | null;
	onClose: () => void;
}

export function EditMailTypeDialog({ mt, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateMailType(onClose);

	useEffect(() => {
		if (mt) populate(mt);
	}, [mt, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (mt) onSubmit(mt.id);
		},
		[mt, onSubmit],
	);

	return (
		<Dialog open={!!mt} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Jenis Surat</DialogTitle>
					<DialogDescription>Perbarui jenis surat</DialogDescription>
				</DialogHeader>
				{mt && (
					<form id="edit-mt-form" onSubmit={handleSubmit}>
						<FieldGroup>
							<InputTextControll
								form={form}
								id="name"
								label="Nama"
								placeholder="Masukkan nama jenis surat"
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
						form="edit-mt-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
