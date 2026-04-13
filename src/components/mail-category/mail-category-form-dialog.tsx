"use client";

import { useCallback, useEffect } from "react";
import InputNumberControll from "@/components/builder/input-number-controll";
import InputTextControll from "@/components/builder/input-text-controll";
import SelectControll from "@/components/builder/select-controll";
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
import {
	useCreateMailCategory,
	useMailCategory,
	useMailTypeOptions,
	useUpdateMailCategory,
} from "@/hooks/mail-category-hooks";
import type { MailCategoryDto } from "@/types/mail-category";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	defaultValues?: Partial<MailCategoryDto>;
}

export function CreateMailCategoryDialog({
	open,
	onOpenChange,
	defaultValues,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateMailCategory(handleClose);
	const { data: mailTypeOptions = [] } = useMailTypeOptions();

	useEffect(() => {
		if (open && defaultValues) {
			form.reset({
				mailTypeId: String(defaultValues.mailType?.id ?? ""),
				code: defaultValues.code,
				name: defaultValues.name,
				sort: defaultValues.sort,
			});
		}
	}, [open, defaultValues, form]);

	const isDuplicate = !!defaultValues;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isDuplicate ? "Duplikat Kategori Surat" : "Buat Kategori Surat"}
					</DialogTitle>
					<DialogDescription>
						{isDuplicate
							? "Buat kategori surat baru berdasarkan data yang ada"
							: "Tambah kategori surat baru"}
					</DialogDescription>
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
	mcId: string | null;
	onClose: () => void;
}

export function EditMailCategoryDialog({ mcId, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateMailCategory(onClose);
	const { data: mailCategory, isLoading } = useMailCategory(mcId);
	const { data: mailTypeOptions = [] } = useMailTypeOptions();

	useEffect(() => {
		if (mailCategory) populate(mailCategory);
	}, [mailCategory, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.SubmitEvent) => {
			e.preventDefault();
			if (mcId) onSubmit(mcId);
		},
		[mcId, onSubmit],
	);

	return (
		<Dialog open={!!mcId} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Kategori Surat</DialogTitle>
					<DialogDescription>Perbarui kategori surat</DialogDescription>
				</DialogHeader>
				{isLoading ? (
					<div className="flex items-center justify-center py-10 text-muted-foreground">
						<span className="text-sm">Memuat data...</span>
					</div>
				) : mailCategory ? (
					<>
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
						<AuditTrailInfo
							updatedAt={mailCategory.updatedAt}
							updatedBy={mailCategory.updatedBy}
						/>
					</>
				) : null}
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
