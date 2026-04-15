import { z } from "zod/v4";
import type { PagedResponse } from "./commons";

export const FileRuleSchema = z.object({
	context: z.string().min(1, "Context wajib diisi"),
	extension: z.string().min(1, "Ekstensi wajib diisi"),
	maxSizeMb: z
		.number({ message: "Ukuran maksimal wajib diisi" })
		.min(1, "Ukuran maksimal minimal 1 MB"),
	isActive: z.boolean(),
});

export type FileRulePayload = z.infer<typeof FileRuleSchema>;

export interface FileRuleDto {
	id: string;
	context: string;
	extension: string;
	maxSizeMb: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PageFileRule extends PagedResponse<FileRuleDto> {}
