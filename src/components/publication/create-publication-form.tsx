"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCreatePublication } from "@/hooks/publication-hooks";
import { PublicationFormFields } from "./publication-form-fields";

interface CreatePublicationFormProps {
	formId: string;
	onSuccess: () => void;
}

export function CreatePublicationForm({
	formId,
	onSuccess,
}: CreatePublicationFormProps) {
	const fileRef = useRef<HTMLInputElement>(null);
	const { form, onSubmit } = useCreatePublication(onSuccess);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(fileRef.current?.files?.[0]);
	};

	return (
		<form id={formId} onSubmit={handleSubmit}>
			<PublicationFormFields form={form} />
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
	);
}

export function CreatePublicationFooter({
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
