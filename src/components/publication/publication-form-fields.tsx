"use client";

import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import CheckboxControll from "@/components/builder/checkbox-controll";
import InputTextControll from "@/components/builder/input-text-controll";
import SelectControll, {
	type SelectOption,
} from "@/components/builder/select-controll";
import TextareaControll from "@/components/builder/textarea-controll";
import { FieldGroup } from "@/components/ui/field";
import type { CreatePublicationPayload } from "@/types/publication";

interface PublicationFormFieldsProps {
	form: UseFormReturn<CreatePublicationPayload>;
	documentTypeOptions: SelectOption[];
}

export const PublicationFormFields = memo(
	({ form, documentTypeOptions }: PublicationFormFieldsProps) => {
		return (
			<FieldGroup className="px-4 py-4">
				<InputTextControll
					form={form}
					id="title"
					label="Judul *"
					placeholder="Judul publikasi"
				/>
				<TextareaControll
					form={form}
					id="description"
					label="Deskripsi"
					placeholder="Deskripsi singkat"
					rows={3}
				/>
				<SelectControll
					form={form}
					id="documentTypeId"
					label="Tipe Dokumen *"
					placeholder="Pilih tipe dokumen"
					options={documentTypeOptions}
					required
				/>
				<CheckboxControll form={form} id="publish" label="Langsung terbitkan" />
			</FieldGroup>
		);
	},
);

PublicationFormFields.displayName = "PublicationFormFields";
