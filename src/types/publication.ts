import { z } from "zod/v4";

export const CreatePublicationSchema = z.object({
	title: z.string().min(1, "Judul wajib diisi"),
	description: z.string(),
	documentTypeId: z.string().min(1, "Tipe dokumen wajib dipilih"),
	publish: z.boolean(),
});

export type CreatePublicationPayload = z.infer<typeof CreatePublicationSchema>;

export const UpdatePublicationSchema = CreatePublicationSchema;
export type UpdatePublicationPayload = z.infer<typeof UpdatePublicationSchema>;

export interface DocumentTypeLookup {
	id: string;
	name: string;
}

export interface PublicationDto {
	id: string;
	title: string;
	description: string | null;
	documentType: DocumentTypeLookup | null;
	status: string;
	publishedDate: string | null;
	fileName: string | null;
	fileSize: number | null;
	createdByName: string | null;
	createdByTitle: string | null;
	createdByUserId: number;
	createdAt: string;
	updatedAt: string;
	updatedBy?: string;
}

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "DELETED";
