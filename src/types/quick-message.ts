import { z } from "zod/v4";
import type { PagedResponse } from "./commons";

export const QuickMessageSchema = z.object({
	message: z
		.string()
		.min(1, "Pesan wajib diisi")
		.max(128, "Maksimal 128 karakter"),
});

export type QuickMessagePayload = z.infer<typeof QuickMessageSchema>;

export interface QuickMessageDto {
	id: string;
	message: string;
}

export interface PageQuickMessage extends PagedResponse<QuickMessageDto> {}
