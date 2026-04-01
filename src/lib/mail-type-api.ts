import type {
	MailTypeDto,
	MailTypePayload,
	PageMailType,
} from "@/types/mail-type";

const BASE = "/api/proxy/v1/mail-types";

export async function fetchMailTypes(
	page = 0,
	size = 20,
	search?: string,
): Promise<PageMailType> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data jenis surat");
	return res.json();
}

export async function fetchMailType(id: string): Promise<MailTypeDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail jenis surat");
	return res.json();
}

export async function createMailType(
	data: MailTypePayload,
): Promise<MailTypeDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat jenis surat");
	}
	return res.json();
}

export async function updateMailType(
	id: string,
	data: MailTypePayload,
): Promise<MailTypeDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui jenis surat");
	}
	return res.json();
}

export async function deleteMailType(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus jenis surat");
}
