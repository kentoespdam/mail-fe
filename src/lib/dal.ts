import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/constants";
import { getJabatan } from "@/lib/rbac";
import { getSession } from "@/lib/session";
import type { AppwriteRole, UserProfile } from "@/types/auth";

export const verifySession = cache(async () => {
	const session = await getSession();
	if (!session) redirect("/login");
	return session;
});

export const getUser = cache(async () => {
	const session = await verifySession();

	const res = await fetch(`${APPWRITE_ENDPOINT}/v1/account`, {
		headers: {
			"Content-Type": "application/json",
			"X-Appwrite-Response-Format": "1.6.0",
			"X-Appwrite-Project": APPWRITE_PROJECT_ID,
			"X-Appwrite-JWT": session.jwt,
		},
	});

	if (!res.ok) {
		const { cookies } = await import("next/headers");
		const cookieStore = await cookies();
		cookieStore.delete("token");
		cookieStore.delete("mail_session");
		redirect("/login");
	}

	const data = await res.json();

	const rolesRaw = (data.prefs?.roles as string[]) ?? ["USER"];
	const AppwriteRoleSchema = z.enum(["SYSTEM", "ADMIN", "USER"]);
	const roles = rolesRaw.filter(
		(r): r is AppwriteRole => AppwriteRoleSchema.safeParse(r).success,
	);

	if (roles.length === 0) roles.push("USER");

	return {
		id: data.$id,
		name: data.name,
		email: data.email,
		roles,
		jabatan: getJabatan(roles),
	} as UserProfile;
});
