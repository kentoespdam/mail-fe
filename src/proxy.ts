import { base64url, compactDecrypt, decodeJwt } from "jose";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import {
	API_BASE_URL,
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECT_ID,
	SESSION_SECRET,
} from "./lib/constants";

if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET env variable");
if (!APPWRITE_PROJECT_ID)
	throw new Error("Missing APPWRITE_PROJECT_ID env variable");
if (!API_BASE_URL) throw new Error("Missing API_BASE_URL env variable");

const ACCESS_TOKEN = "token";
const APPWRITE_SESSION_COOKIE = "mail_session";
const API_PREFIX = "/api/proxy";
const REFRESH_BUFFER_MS = 10_000;
const PROTECTED_PREFIXES = ["/persuratan", "/publikasi"] as const;

// Decryption cache with 5s TTL
const decryptCache = new Map<string, { value: string; expires: number }>();

const cleanupDecryptCache = (): void => {
	const now = Date.now();
	for (const [key, entry] of decryptCache) {
		if (entry.expires <= now) decryptCache.delete(key);
	}
};

const isProtectedPath = (pathname: string): boolean =>
	PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

interface SessionResult {
	jwt: string;
	exp: number;
	refreshed: boolean;
}

const getTokenExp = (token: string): number | null => {
	try {
		const { exp } = decodeJwt(token);
		return exp ?? null;
	} catch {
		return null;
	}
};

const decryptAppwriteSession = async (
	encrypted: string,
): Promise<string | null> => {
	const cached = decryptCache.get(encrypted);
	if (cached && cached.expires > Date.now()) return cached.value;

	try {
		const key = base64url.decode(SESSION_SECRET);
		const { plaintext } = await compactDecrypt(encrypted, key);
		const value = new TextDecoder().decode(plaintext);
		decryptCache.set(encrypted, { value, expires: Date.now() + 5_000 });
		return value;
	} catch {
		console.warn("[proxy] Failed to decrypt Appwrite session");
		return null;
	}
};

const refreshJwt = async (appwriteCookie: string): Promise<string | null> => {
	try {
		const res = await fetch(`${APPWRITE_ENDPOINT}/v1/account/jwt`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Appwrite-Response-Format": "1.6.0",
				"X-Appwrite-Project": APPWRITE_PROJECT_ID,
				Cookie: appwriteCookie,
			},
		});
		if (!res.ok) {
			console.warn(`[proxy] JWT refresh failed: ${res.status}`);
			return null;
		}
		const { jwt } = (await res.json()) as { jwt: string };
		return jwt;
	} catch (err) {
		console.error("[proxy] JWT refresh error:", err);
		return null;
	}
};

const setCookieOnResponse = (
	response: NextResponse,
	jwt: string,
	exp: number,
): void => {
	const maxAge = exp - Math.floor(Date.now() / 1000);
	response.cookies.set(ACCESS_TOKEN, jwt, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge,
	});
};

const resolveSession = async (
	request: NextRequest,
): Promise<SessionResult | null> => {
	const token = request.cookies.get(ACCESS_TOKEN)?.value;
	if (token) {
		const exp = getTokenExp(token);
		if (exp && exp * 1000 > Date.now() + REFRESH_BUFFER_MS) {
			return { jwt: token, exp, refreshed: false };
		}
	}

	const encrypted = request.cookies.get(APPWRITE_SESSION_COOKIE)?.value;
	if (!encrypted) return null;

	const awCookie = await decryptAppwriteSession(encrypted);
	if (!awCookie) return null;

	const newJwt = await refreshJwt(awCookie);
	if (!newJwt) return null;

	const exp = getTokenExp(newJwt);
	if (!exp) return null;

	return { jwt: newJwt, exp, refreshed: true };
};

export const proxy: NextProxy = async (request, event) => {
	const { pathname } = request.nextUrl;
	const session = await resolveSession(request);

	// Periodic cleanup of expired decrypt cache entries
	event.waitUntil(Promise.resolve().then(cleanupDecryptCache));

	// API proxy — use NextResponse.rewrite() instead of manual fetch
	if (pathname.startsWith(API_PREFIX)) {
		const targetUrl = new URL(
			`${API_BASE_URL}${pathname.replace(API_PREFIX, "")}${request.nextUrl.search}`,
		);
		const requestHeaders = new Headers(request.headers);
		if (session?.jwt)
			requestHeaders.set("authorization", `Bearer ${session.jwt}`);
		requestHeaders.delete("host");
		requestHeaders.delete("accept-encoding");

		const response = NextResponse.rewrite(targetUrl, {
			request: { headers: requestHeaders },
		});
		if (session?.refreshed)
			setCookieOnResponse(response, session.jwt, session.exp);
		return response;
	}

	// Redirect logged-in users away from login
	if (pathname === "/login" && session) {
		const response = NextResponse.redirect(new URL("/persuratan", request.url));
		if (session.refreshed)
			setCookieOnResponse(response, session.jwt, session.exp);
		return response;
	}

	// Redirect unauthenticated users to login
	if (isProtectedPath(pathname) && !session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Pass through
	const response = NextResponse.next();
	if (session) setCookieOnResponse(response, session.jwt, session.exp);
	return response;
};

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
