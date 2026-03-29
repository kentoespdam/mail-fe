import { z } from "zod/v4";

export const QuickMessageSchema = z.object({
	message: z
		.string()
		.min(1, "Pesan wajib diisi")
		.max(128, "Maksimal 128 karakter"),
});

export type QuickMessagePayload = z.infer<typeof QuickMessageSchema>;

export interface QuickMessageDto {
	id: number;
	message: string;
}

export interface PageQuickMessage {
	totalPages: number;
	totalElements: number;
	size: number;
	content: QuickMessageDto[];
	number: number;
	numberOfElements: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}
