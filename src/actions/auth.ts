"use server";

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/constants";
import { isEmailValid } from "@/lib/email-validator";
import {
	createSession,
	deleteSession,
	getAppwriteSession,
	getSession,
} from "@/lib/session";
import type { LoginSchema } from "@/types/auth";

export const doLogin = async (formData: LoginSchema) => {
	if (!isEmailValid(formData.username)) {
		formData.username = `${formData.username}@${process.env.DEFAULT_MAIL_DOMAIN || ""}`;
	}
	const session = await createEmailSession(formData);
	if (!session) {
		throw new Error("Email atau password salah");
	}

	const jwt = await createJwt(session.setCookieString);
	if (!jwt) {
		throw new Error("Gagal membuat access token");
	}

	await createSession(jwt.jwt, session.setCookieString, session.expiresAt);

	return { success: true };
};

const createEmailSession = async (formData: LoginSchema) => {
	const headers = {
		"Content-Type": "application/json",
		"X-Appwrite-Response-Format": "1.6.0",
		"X-Appwrite-Project": APPWRITE_PROJECT_ID,
	};

	try {
		const res = await fetch(`${APPWRITE_ENDPOINT}/v1/account/sessions/email`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				email: formData.username,
				password: formData.password,
			}),
		});

		if (!res.ok) {
			return null;
		}

		const setCookies = res.headers.getSetCookie();
		// Only keep the first session cookie (skip _legacy duplicate)
		const setCookieString = setCookies[0] ?? "";

		// Parse expires from Set-Cookie header
		const expiresMatch = setCookieString.match(/expires=([^;]+)/i);
		const expiresAt = expiresMatch ? new Date(expiresMatch[1]) : null;

		const data = (await res.json()) as {
			$id: string;
			secret: string;
			expire: string;
			userId: string;
		};

		return { ...data, setCookies, setCookieString, expiresAt };
	} catch {
		return null;
	}
};

const createJwt = async (setCookie: string) => {
	const headers = {
		"Content-Type": "application/json",
		"X-Appwrite-Response-Format": "1.6.0",
		"X-Appwrite-Project": APPWRITE_PROJECT_ID,
		Cookie: setCookie,
	};

	try {
		const res = await fetch(`${APPWRITE_ENDPOINT}/v1/account/jwt`, {
			method: "POST",
			headers,
		});

		if (!res.ok) {
			return null;
		}

		return (await res.json()) as { jwt: string };
	} catch {
		return null;
	}
};

export async function logout() {
	const [session, appwriteCookie] = await Promise.all([
		getSession(),
		getAppwriteSession(),
	]);

	if (session && appwriteCookie) {
		try {
			await fetch(`${APPWRITE_ENDPOINT}/v1/account/sessions/current`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"X-Appwrite-Response-Format": "1.6.0",
					"X-Appwrite-Project": APPWRITE_PROJECT_ID,
					Cookie: appwriteCookie,
				},
			});
		} catch {
			// Continue with local cleanup even if Appwrite call fails
		}
	}

	await deleteSession();
}
