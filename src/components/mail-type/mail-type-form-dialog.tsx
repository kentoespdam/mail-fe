"use client";

import { useCallback, useEffect } from "react";
import InputTextControll from "@/components/builder/input-text-controll";
import { AuditTrailInfo } from "@/components/ui/audit-trail-info";
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
import { useCreateMailType, useUpdateMailType } from "@/hooks/mail-type-hooks";
import type { MailTypeDto } from "@/types/mail-type";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	defaultValues?: Partial<MailTypeDto>;
}

export function CreateMailTypeDialog({
	open,
	onOpenChange,
	defaultValues,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateMailType(handleClose);

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
						{isDuplicate ? "Duplikat Tipe Surat" : "Buat Tipe Surat"}
					</DialogTitle>
					<DialogDescription>
						{isDuplicate
							? "Buat tipe surat baru berdasarkan data yang ada"
							: "Tambah tipe surat baru"}
					</DialogDescription>
				</DialogHeader>
				<form id="create-mt-form" onSubmit={onSubmit}>
					<FieldGroup>
						<InputTextControll
							form={form}
							id="name"
							label="Nama"
							placeholder="Masukkan nama tipe surat"
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
					<DialogTitle>Edit Tipe Surat</DialogTitle>
					<DialogDescription>Perbarui tipe surat</DialogDescription>
				</DialogHeader>
				{mt && (
					<>
						<form id="edit-mt-form" onSubmit={handleSubmit}>
							<FieldGroup>
								<InputTextControll
									form={form}
									id="name"
									label="Nama"
									placeholder="Masukkan nama tipe surat"
									required
								/>
							</FieldGroup>
						</form>
						<AuditTrailInfo updatedAt={mt.updatedAt} updatedBy={mt.updatedBy} />
					</>
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
