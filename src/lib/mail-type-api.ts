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
	sortBy?: string,
	sortDir?: string,
): Promise<PageMailType> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data tipe surat");
	return res.json();
}

export const fetchMailTypesLookup = async () => {
	const res = await fetch(`${BASE}/lookup`);
	if (!res.ok) throw new Error("Gagal memuat data tipe surat");
	const result = await res.json();
	return result;
};

export async function fetchMailType(id: string): Promise<MailTypeDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail tipe surat");
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
		throw new Error(err?.detail ?? "Gagal membuat tipe surat");
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
		throw new Error(err?.detail ?? "Gagal memperbarui tipe surat");
	}
	return res.json();
}

export async function deleteMailType(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus tipe surat");
}

export async function toggleMailTypeStatus(id: string): Promise<MailTypeDto> {
	const res = await fetch(`${BASE}/${id}/status`, {
		method: "PATCH",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengubah status tipe surat");
	}
	return res.json();
}
