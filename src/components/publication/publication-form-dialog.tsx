"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PublicationDto } from "@/types/publication";
import { CreatePublicationForm } from "./create-publication-form";
import { EditPublicationForm } from "./edit-publication-form";

// ─── Create ─────────────────────────────────────────────────────
interface CreateDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function CreatePublicationDialog({
	open,
	onOpenChange,
}: CreateDialogProps) {
	const formId = "create-publication-form";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Buat Publikasi</DialogTitle>
					<DialogDescription>Tambah dokumen publikasi baru</DialogDescription>
				</DialogHeader>
				<CreatePublicationForm
					formId={formId}
					onSuccess={() => onOpenChange(false)}
				/>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Batal
					</Button>
					<Button type="submit" form={formId}>
						Simpan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─── Edit ───────────────────────────────────────────────────────
interface EditDialogProps {
	pub: PublicationDto | null;
	onClose: () => void;
}

export function EditPublicationDialog({ pub, onClose }: EditDialogProps) {
	const formId = "edit-publication-form";

	return (
		<Dialog open={!!pub} onOpenChange={(v) => !v && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Publikasi</DialogTitle>
					<DialogDescription>Perbarui informasi publikasi</DialogDescription>
				</DialogHeader>
				{pub && (
					<EditPublicationForm formId={formId} pub={pub} onSuccess={onClose} />
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
}
