"use client";

import { memo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUpdatePublication } from "@/hooks/publication-hooks";
import type { PublicationDto } from "@/types/publication";
import { PublicationFormFields } from "./publication-form-fields";

interface EditPublicationFormProps {
	formId: string;
	pub: PublicationDto;
	onSuccess: () => void;
}

export const EditPublicationForm = memo(
	({ formId, pub, onSuccess }: EditPublicationFormProps) => {
		const fileRef = useRef<HTMLInputElement>(null);
		const { form, onSubmit, populate } = useUpdatePublication(onSuccess);

		const prevId = useRef<number | null>(null);
		if (pub.id !== prevId.current) {
			prevId.current = pub.id;
			populate(pub);
		}

		const handleSubmit = useCallback(
			(e: React.FormEvent) => {
				e.preventDefault();
				onSubmit(pub.id, fileRef.current?.files?.[0]);
			},
			[onSubmit, pub.id],
		);

		return (
			<form id={formId} onSubmit={handleSubmit}>
				<PublicationFormFields form={form} />
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
		);
	},
);

EditPublicationForm.displayName = "EditPublicationForm";

export function EditPublicationFooter({
	formId,
	onCancel,
	isPending,
}: {
	formId: string;
	onCancel: () => void;
	isPending: boolean;
}) {
	return (
		<>
			<Button type="button" variant="outline" onClick={onCancel}>
				Batal
			</Button>
			<Button type="submit" form={formId} disabled={isPending}>
				{isPending ? "Menyimpan…" : "Simpan"}
			</Button>
		</>
	);
}
