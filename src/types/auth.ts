import * as z from "zod";

export const LoginSchema = z.object({
	username: z.string().min(6, "username wajib diisi"),
	password: z.string().min(1, "password wajib diisi"),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

export interface LoginPayload {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
}

export type AppwriteRole = "SYSTEM" | "ADMIN" | "USER";

export type Permission =
	| "menu:dashboard"
	| "menu:persuratan"
	| "menu:arsip_surat"
	| "menu:publikasi"
	| "menu:master";

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	roles: AppwriteRole[];
	jabatan: string;
}
