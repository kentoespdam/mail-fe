import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/constants";

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
			Authorization: `Bearer ${session.jwt}`,
		},
	});

	if (!res.ok) redirect("/login");

	return (await res.json()) as {
		$id: string;
		name: string;
		email: string;
	};
});
