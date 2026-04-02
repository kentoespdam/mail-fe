import { z } from "zod/v4";
import type { PagedResponse } from "./commons";

export const MailCategorySchema = z.object({
	mailTypeId: z.string().min(1, "Tipe surat wajib dipilih"),
	code: z.string().min(1, "Kode wajib diisi").max(32, "Maksimal 32 karakter"),
	name: z.string().min(1, "Nama wajib diisi").max(64, "Maksimal 64 karakter"),
	sort: z.number().int().optional(),
});

export type MailCategoryPayload = z.infer<typeof MailCategorySchema>;

export interface MailTypeMini {
	id: string;
	name: string;
}

export interface MailCategoryDto {
	id: string;
	mailType: MailTypeMini;
	code: string;
	name: string;
	codeName: string;
	status: string;
	sort: number;
}

export interface PageMailCategory extends PagedResponse<MailCategoryDto> {}
