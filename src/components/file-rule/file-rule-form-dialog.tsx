"use client";

import { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import InputNumberControll from "@/components/builder/input-number-controll";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useCreateFileRule, useUpdateFileRule } from "@/hooks/file-rule-hooks";
import type { FileRuleDto, FileRulePayload } from "@/types/file-rule";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function CreateFileRuleDialog({
	open,
	onOpenChange,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreateFileRule(handleClose);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Tambah Aturan File</DialogTitle>
					<DialogDescription>
						Tambah aturan tipe file baru beserta batas ukurannya
					</DialogDescription>
				</DialogHeader>
				<form id="create-fr-form" onSubmit={onSubmit}>
					<FieldGroup>
						<InputTextControll
							form={form}
							id="context"
							label="Context"
							placeholder="Contoh: MAIL_ATTACHMENT"
							required
						/>
						<InputTextControll
							form={form}
							id="extension"
							label="Ekstensi"
							placeholder="Contoh: .pdf"
							required
						/>
						<InputNumberControll
							form={form}
							id="maxSizeMb"
							label="Max Size (MB)"
							placeholder="Masukkan ukuran maksimal"
							required
						/>
						<Controller
							name="isActive"
							control={form.control}
							render={({ field }) => (
								<Field orientation="horizontal" className="items-center gap-2">
									<Switch
										id={field.name}
										checked={field.value}
										onCheckedChange={field.onChange}
										onBlur={field.onBlur}
										disabled={mutation.isPending}
									/>
									<FieldLabel htmlFor={field.name} className="mb-0">
										Aktif
									</FieldLabel>
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="create-fr-form"
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
	fr: FileRuleDto | null;
	onClose: () => void;
}

export function EditFileRuleDialog({ fr, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdateFileRule(onClose);

	useEffect(() => {
		if (fr) populate(fr);
	}, [fr, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (fr) onSubmit(fr.id);
		},
		[fr, onSubmit],
	);

	return (
		<Dialog open={!!fr} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Aturan File</DialogTitle>
					<DialogDescription>Perbarui aturan tipe file</DialogDescription>
				</DialogHeader>
				{fr && (
					<form id="edit-fr-form" onSubmit={handleSubmit}>
						<FieldGroup>
							<InputTextControll
								form={form}
								id="context"
								label="Context"
								placeholder="Contoh: MAIL_ATTACHMENT"
								required
							/>
							<InputTextControll
								form={form}
								id="extension"
								label="Ekstensi"
								placeholder="Contoh: .pdf"
								required
							/>
							<InputNumberControll
								form={form}
								id="maxSizeMb"
								label="Max Size (MB)"
								placeholder="Masukkan ukuran maksimal"
								required
							/>
							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Field
										orientation="horizontal"
										className="items-center gap-2"
									>
										<Switch
											id={field.name}
											checked={field.value}
											onCheckedChange={field.onChange}
											onBlur={field.onBlur}
											disabled={mutation.isPending}
										/>
										<FieldLabel htmlFor={field.name} className="mb-0">
											Aktif
										</FieldLabel>
									</Field>
								)}
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
						form="edit-fr-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
