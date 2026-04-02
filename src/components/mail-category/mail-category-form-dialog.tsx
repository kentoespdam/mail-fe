"use client";

import { useCallback, useEffect } from "react";
import InputNumberControll from "@/components/builder/input-number-controll";
import InputTextControll from "@/components/builder/input-text-controll";
import SelectControll from "@/components/builder/select-controll";
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
	useCreateMailCategory,
	useMailTypeOptions,
	useUpdateMailCategory,
} from "@/hooks/mail-category-hooks";
import type { MailCategoryDto } from "@/types/mail-category";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function CreateMailCategoryDialog({
	open,
	onOpenChange,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateMailCategory(handleClose);
	const { data: mailTypeOptions = [] } = useMailTypeOptions();
	console.log(mailTypeOptions);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Buat Kategori Surat</DialogTitle>
					<DialogDescription>Tambah kategori surat baru</DialogDescription>
				</DialogHeader>
				<form id="create-mc-form" onSubmit={onSubmit}>
					<FieldGroup>
						<SelectControll
							form={form}
							id="mailTypeId"
							label="Tipe Surat"
							placeholder="Pilih tipe surat"
							options={mailTypeOptions}
							required
						/>
						<InputTextControll
							form={form}
							id="code"
							label="Kode"
							placeholder="Masukkan kode kategori"
							required
						/>
						<InputTextControll
							form={form}
							id="name"
							label="Nama"
							placeholder="Masukkan nama kategori"
							required
						/>
						<InputNumberControll
							form={form}
							id="sort"
							label="Urutan"
							placeholder="Urutan tampil"
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="create-mc-form"
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
	mc: MailCategoryDto | null;
	onClose: () => void;
}

export function EditMailCategoryDialog({ mc, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateMailCategory(onClose);
	const { data: mailTypeOptions = [] } = useMailTypeOptions();

	useEffect(() => {
		if (mc) populate(mc);
	}, [mc, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (mc) onSubmit(mc.id);
		},
		[mc, onSubmit],
	);

	return (
		<Dialog open={!!mc} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Kategori Surat</DialogTitle>
					<DialogDescription>Perbarui kategori surat</DialogDescription>
				</DialogHeader>
				{mc && (
					<form id="edit-mc-form" onSubmit={handleSubmit}>
						<FieldGroup>
							<SelectControll
								form={form}
								id="mailTypeId"
								label="Tipe Surat"
								placeholder="Pilih tipe surat"
								options={mailTypeOptions}
								required
							/>
							<InputTextControll
								form={form}
								id="code"
								label="Kode"
								placeholder="Masukkan kode kategori"
								required
							/>
							<InputTextControll
								form={form}
								id="name"
								label="Nama"
								placeholder="Masukkan nama kategori"
								required
							/>
							<InputNumberControll
								form={form}
								id="sort"
								label="Urutan"
								placeholder="Urutan tampil"
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
						form="edit-mc-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
