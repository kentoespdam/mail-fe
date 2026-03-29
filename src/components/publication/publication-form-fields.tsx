"use client";

import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import CheckboxControll from "@/components/builder/checkbox-controll";
import InputNumberControll from "@/components/builder/input-number-controll";
import InputTextControll from "@/components/builder/input-text-controll";
import { FieldGroup } from "@/components/ui/field";
import type { CreatePublicationPayload } from "@/types/publication";

interface PublicationFormFieldsProps {
	form: UseFormReturn<CreatePublicationPayload>;
}

export const PublicationFormFields = memo(
	({ form }: PublicationFormFieldsProps) => {
		return (
			<FieldGroup className="px-4 py-4">
				<InputTextControll
					form={form}
					id="title"
					label="Judul *"
					placeholder="Judul publikasi"
				/>
				<InputTextControll
					form={form}
					id="description"
					label="Deskripsi"
					placeholder="Deskripsi singkat"
				/>
				<InputNumberControll
					form={form}
					id="documentTypeId"
					label="ID Tipe Dokumen *"
					placeholder="Contoh: 1"
				/>
				<CheckboxControll form={form} id="publish" label="Langsung terbitkan" />
			</FieldGroup>
		);
	},
);

PublicationFormFields.displayName = "PublicationFormFields";
