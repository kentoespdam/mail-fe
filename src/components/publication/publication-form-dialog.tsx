"use client";

import { useCallback, useEffect, useRef } from "react";
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
import {
	useCreatePublication,
	useDocumentTypeOptions,
	usePublication,
	useUpdatePublication,
} from "@/hooks/publication-hooks";
import type { PublicationDto } from "@/types/publication";
import { PublicationFormFields } from "./publication-form-fields";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	defaultValues?: Partial<PublicationDto>;
}

export function CreatePublicationDialog({
	open,
	onOpenChange,
	defaultValues,
}: CreateDialogProps) {
	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
	const { form, mutation, onSubmit } = useCreatePublication(handleClose);
	const { data: docTypeOptions = [] } = useDocumentTypeOptions();
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open && defaultValues) {
			form.reset({
				title: defaultValues.title ?? "",
				description: defaultValues.description ?? "",
				documentTypeId: defaultValues.documentType?.id ?? "",
				publish: defaultValues.status === "PUBLISHED",
			});
		}
	}, [open, defaultValues, form]);

	const isDuplicate = !!defaultValues;

	const handleSubmit = useCallback(
		(e: React.SubmitEvent) => {
			e.preventDefault();
			onSubmit(fileRef.current?.files?.[0]);
		},
		[onSubmit],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isDuplicate ? "Duplikat Publikasi" : "Buat Publikasi"}
					</DialogTitle>
					<DialogDescription>
						{isDuplicate
							? "Buat publikasi baru berdasarkan data yang ada"
							: "Tambah dokumen publikasi baru"}
					</DialogDescription>
				</DialogHeader>
				<form id="create-pub-form" onSubmit={handleSubmit}>
					<PublicationFormFields
						form={form}
						documentTypeOptions={docTypeOptions}
					/>
					<div className="px-4 pb-4">
						<label
							htmlFor="pub-file"
							className="text-xs/relaxed font-medium mb-2 block"
						>
							File Lampiran
						</label>
						<input id="pub-file" type="file" ref={fileRef} />
					</div>
				</form>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="create-pub-form"
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
	pubId: string | null;
	onClose: () => void;
}

export function EditPublicationDialog({ pubId, onClose }: EditDialogProps) {
	const { form, mutation, populate, onSubmit } = useUpdatePublication(onClose);
	const { data: publication, isLoading } = usePublication(pubId);
	const { data: docTypeOptions = [] } = useDocumentTypeOptions();
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (publication) populate(publication);
	}, [publication, populate]);

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) onClose();
		},
		[onClose],
	);

	const handleSubmit = useCallback(
		(e: React.SubmitEvent) => {
			e.preventDefault();
			if (pubId) onSubmit(pubId, fileRef.current?.files?.[0]);
		},
		[pubId, onSubmit],
	);

	return (
		<Dialog open={!!pubId} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Publikasi</DialogTitle>
					<DialogDescription>Perbarui informasi publikasi</DialogDescription>
				</DialogHeader>
				{isLoading ? (
					<div className="flex items-center justify-center py-10 text-muted-foreground">
						<span className="text-sm">Memuat data...</span>
					</div>
				) : publication ? (
					<>
						<form id="edit-pub-form" onSubmit={handleSubmit}>
							<PublicationFormFields
								form={form}
								documentTypeOptions={docTypeOptions}
							/>
							<div className="px-4 pb-4">
								<label
									htmlFor="pub-file-edit"
									className="text-xs/relaxed font-medium mb-2 block"
								>
									File Lampiran
								</label>
								<input id="pub-file-edit" type="file" ref={fileRef} />
							</div>
						</form>
						<AuditTrailInfo updatedAt={publication.updatedAt} />
					</>
				) : null}
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button
						type="submit"
						form="edit-pub-form"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Menyimpan…" : "Simpan"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
