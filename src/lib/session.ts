import "server-only";

import { base64url, CompactEncrypt, compactDecrypt, decodeJwt } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "token";
const APPWRITE_SESSION_COOKIE = "mail_session";

function getEncryptionKey() {
	const secret = process.env.SESSION_SECRET;
	if (!secret)
		throw new Error("SESSION_SECRET environment variable is required");
	// Derive a 256-bit key from the secret by hashing with SHA-256
	return base64url.decode(secret);
}

async function encrypt(plaintext: string): Promise<string> {
	const key = getEncryptionKey();
	return new CompactEncrypt(new TextEncoder().encode(plaintext))
		.setProtectedHeader({ alg: "dir", enc: "A256GCM" })
		.encrypt(key);
}

async function decrypt(token: string): Promise<string> {
	const key = getEncryptionKey();
	const { plaintext } = await compactDecrypt(token, key);
	return new TextDecoder().decode(plaintext);
}

export interface SessionPayload {
	sub: string;
	exp: number;
	jwt: string;
}

export async function getSession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;
	if (!token) return null;

	try {
		const claims = decodeJwt(token);
		if (!claims.exp || claims.exp * 1000 < Date.now()) return null;
		return { sub: claims.sub as string, exp: claims.exp, jwt: token };
	} catch {
		return null;
	}
}

export async function createSession(
	jwt: string,
	appwriteSessionCookie: string,
	sessionExpiresAt?: Date | null,
) {
	const cookieStore = await cookies();
	const claims = decodeJwt(jwt);
	const maxAge = claims.exp ? claims.exp - Math.floor(Date.now() / 1000) : 900;

	cookieStore.set(SESSION_COOKIE, jwt, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge,
	});

	// Store encrypted Appwrite session cookie for JWT refresh
	const encrypted = await encrypt(appwriteSessionCookie);
	const sessionMaxAge =
		sessionExpiresAt && !Number.isNaN(sessionExpiresAt.getTime())
			? Math.floor((sessionExpiresAt.getTime() - Date.now()) / 1000)
			: 365 * 24 * 60 * 60;
	cookieStore.set(APPWRITE_SESSION_COOKIE, encrypted, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: sessionMaxAge,
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE);
	cookieStore.delete(APPWRITE_SESSION_COOKIE);
}

export async function getAppwriteSession(): Promise<string | null> {
	const cookieStore = await cookies();
	const encrypted = cookieStore.get(APPWRITE_SESSION_COOKIE)?.value;
	if (!encrypted) return null;

	try {
		return await decrypt(encrypted);
	} catch {
		return null;
	}
}

export { APPWRITE_SESSION_COOKIE, SESSION_COOKIE };
