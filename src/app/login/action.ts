"use server";

import { cookies } from "next/headers";
import {
	APPWRITE_ENDPOINT,
	APPWRITE_HOSTNAME,
	APPWRITE_PROJECT_ID,
} from "@/lib/constants";
import { isEmailValid } from "@/lib/email-validator";
import type { LoginSchema } from "@/types/auth";

export const doLogin = async (formData: LoginSchema) => {
	if (!isEmailValid(formData.username)) {
		formData.username = `${formData.username}@${process.env.DEFAULT_MAIL_DOMAIN || ""}`;
	}
	const session = await createEmailSession(formData);
	if (!session) {
		throw new Error("Email atau password salah");
	}

	const cookieStore = await cookies();

	// Set session cookies from Appwrite Set-Cookie header
	for (const raw of session.setCookies) {
		const parsed = parseSetCookie(raw);
		if (parsed) {
			cookieStore.set(parsed.name, parsed.value, parsed.options);
		}
	}

	// Generate JWT using the Set-Cookie header from session response
	const jwt = await createJwt(session.setCookieString);
	if (!jwt) {
		throw new Error("Gagal membuat access token");
	}

	// Set JWT as access token cookie
	cookieStore.set("access_token", jwt.jwt, {
		path: "/",
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 15 * 60, // 15 minutes (Appwrite JWT default)
	});

	return { success: true, accessToken: jwt.jwt };
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
		const setCookieString = setCookies.join("; ");
		const data = (await res.json()) as {
			$id: string;
			secret: string;
			expire: string;
			userId: string;
		};

		return { ...data, setCookies, setCookieString };
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

const parseSetCookie = (raw: string) => {
	const parts = raw.split(";").map((p) => p.trim());
	const [nameValue, ...attrs] = parts;
	const eqIndex = nameValue.indexOf("=");
	if (eqIndex === -1) return null;

	const name = nameValue.slice(0, eqIndex);
	const value = nameValue.slice(eqIndex + 1);

	const options: {
		path?: string;
		domain?: string;
		httpOnly?: boolean;
		secure?: boolean;
		sameSite?: "lax" | "strict" | "none";
		expires?: Date;
		maxAge?: number;
	} = {};

	for (const attr of attrs) {
		const lower = attr.toLowerCase();
		if (lower === "httponly") {
			options.httpOnly = true;
		} else if (lower === "secure") {
			options.secure = process.env.ENVIRONMENT === "production";
		} else if (lower.startsWith("path=")) {
			options.path = attr.slice(5);
		} else if (lower.startsWith("domain=")) {
			options.domain = attr.slice(7);
		} else if (lower.startsWith("expires=")) {
			options.expires = new Date(attr.slice(8));
		} else if (lower.startsWith("max-age=")) {
			options.maxAge = Number(attr.slice(8));
		} else if (lower.startsWith("samesite=")) {
			options.sameSite = attr.slice(9).toLowerCase() as
				| "lax"
				| "strict"
				| "none";
		}
	}

	return { name, value, options };
};
