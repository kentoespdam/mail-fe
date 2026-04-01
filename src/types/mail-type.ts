import { z } from "zod/v4";
import type { PagedResponse } from "./commons";

export const MailTypeSchema = z.object({
	name: z
		.string()
		.min(1, "Nama wajib diisi")
		.max(32, "Maksimal 32 karakter"),
});

export type MailTypePayload = z.infer<typeof MailTypeSchema>;

export interface MailTypeDto {
	id: string;
	name: string;
	status: "ACTIVE" | "INACTIVE" | "DELETED";
	categoryCount: number;
}

export interface PageMailType extends PagedResponse<MailTypeDto> {}
