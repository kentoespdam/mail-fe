import { z } from "zod/v4";
import type { PagedResponse } from "./commons";

export const DocumentTypeSchema = z.object({
	name: z
		.string()
		.min(1, "Nama jenis dokumen wajib diisi")
		.max(100, "Maksimal 100 karakter"),
});

export type DocumentTypePayload = z.infer<typeof DocumentTypeSchema>;

export interface DocumentTypeDto {
	id: string;
	name: string;
	status: "ACTIVE" | "INACTIVE" | "DELETED";
	publicationCount: number;
}

export interface PageDocumentType extends PagedResponse<DocumentTypeDto> {}
