import { z } from "zod/v4";

export const CreatePublicationSchema = z.object({
	title: z.string().min(1, "Judul wajib diisi"),
	description: z.string(),
	documentTypeId: z.number().min(1, "Tipe dokumen wajib dipilih"),
	publish: z.boolean(),
});

export type CreatePublicationPayload = z.infer<typeof CreatePublicationSchema>;

export const UpdatePublicationSchema = CreatePublicationSchema;
export type UpdatePublicationPayload = z.infer<typeof UpdatePublicationSchema>;

export interface PublicationDto {
	id: number;
	title: string;
	description: string | null;
	documentTypeId: number;
	documentTypeName: string | null;
	status: string;
	publishedDate: string | null;
	fileName: string | null;
	filePath: string | null;
	fileSize: number | null;
	createdByName: string | null;
	createdByTitle: string | null;
	createdByUserId: number;
	createdAt: string;
	updatedAt: string;
	totalCount: number;
}

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "DELETED";

export interface PublicationFilter {
	status?: PublicationStatus;
	keyword?: string;
	typeId?: number;
}
