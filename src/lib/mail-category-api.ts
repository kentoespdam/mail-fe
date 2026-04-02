import type {
	MailCategoryDto,
	MailCategoryPayload,
	PageMailCategory,
} from "@/types/mail-category";

const BASE = "/api/proxy/v1/mail-categories";

export async function fetchMailCategories(
	page = 0,
	size = 20,
	search?: string,
	mailTypeId?: string,
	sortBy?: string,
	sortDir?: string,
): Promise<PageMailCategory> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);
	if (mailTypeId && mailTypeId !== "all") {
		params.set("mailTypeId", String(mailTypeId));
	}
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data kategori surat");
	return res.json();
}

export async function fetchMailCategory(id: string): Promise<MailCategoryDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail kategori surat");
	return res.json();
}

export async function createMailCategory(
	data: MailCategoryPayload,
): Promise<MailCategoryDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat kategori surat");
	}
	return res.json();
}

export async function updateMailCategory(
	id: string,
	data: MailCategoryPayload,
): Promise<MailCategoryDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui kategori surat");
	}
	return res.json();
}

export async function deleteMailCategory(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus kategori surat");
}
