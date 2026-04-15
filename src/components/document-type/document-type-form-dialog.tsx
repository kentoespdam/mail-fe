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
	useCreateDocumentType,
	useUpdateDocumentType,
} from "@/hooks/document-type-hooks";
import type { DocumentTypeDto } from "@/types/document-type";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	defaultValues?: Partial<DocumentTypeDto>;
}

export function CreateDocumentTypeDialog({
	open,
	onOpenChange,
	defaultValues,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateDocumentType(handleClose);

	useEffect(() => {
		if (open && defaultValues) {
			form.reset({
				name: defaultValues.name ?? "",
			});
		}
	}, [open, defaultValues, form]);

	const isDuplicate = !!defaultValues;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isDuplicate ? "Duplikat Jenis Dokumen" : "Buat Jenis Dokumen"}
					</DialogTitle>
					<DialogDescription>
						{isDuplicate
							? "Buat jenis dokumen baru berdasarkan data yang ada"
							: "Tambah jenis dokumen baru"}
					</DialogDescription>
				</DialogHeader>
				<form id="create-dt-form" onSubmit={onSubmit}>
					<FieldGroup>
						<InputTextControll
							form={form}
							id="name"
							label="Nama"
							placeholder="Masukkan nama jenis dokumen"
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
						form="create-dt-form"
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
	dt: DocumentTypeDto | null;
	onClose: () => void;
}

export function EditDocumentTypeDialog({ dt, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateDocumentType(onClose);

	useEffect(() => {
		if (dt) populate(dt);
	}, [dt, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.SubmitEvent) => {
			e.preventDefault();
			if (dt) onSubmit(dt.id);
		},
		[dt, onSubmit],
	);

	return (
		<Dialog open={!!dt} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Jenis Dokumen</DialogTitle>
					<DialogDescription>Perbarui jenis dokumen</DialogDescription>
				</DialogHeader>
				{dt && (
					<form id="edit-dt-form" onSubmit={handleSubmit}>
						<FieldGroup>
							<InputTextControll
								form={form}
								id="name"
								label="Nama"
								placeholder="Masukkan nama jenis dokumen"
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
						form="edit-dt-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
